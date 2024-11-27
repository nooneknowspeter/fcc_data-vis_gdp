"use client";

import React, { useState } from "react";
import * as d3 from "d3";
import { useEffect } from "react";
import axios from "axios";

//npm i --save-dev @types/d3

const BarChart = () => {
  // http request json with axios
  const [data, setData] = useState([]);

  const url: string =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

  const fetchData = async () => {
    const response = await axios.get(url);
    return response.data;
  };

  // data fetches when component mounts
  useEffect(() => {
    const fetchDataAsync = async () => {
      const data = await fetchData();
      setData(data.data);
    };
    fetchDataAsync();
  }, []);

  const width = 928;
  const height = 500;

  useEffect(() => {
    createBarChart();
  });

  const createBarChart = () => {
    // margin
    const marginTop = 40;
    const marginRight = 60;
    const marginBottom = 40;
    const marginLeft = 60;

    const barWidth = 2;

    // select svg element
    const svg = d3.select("svg");

    // tooltip
    const tooltip = d3
      .select("svg")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // console.log(data[0][1]);

    // console.log(
    //   new Intl.NumberFormat("en-US", {
    //     currency: "USD",
    //     style: "currency",
    //   }).format(data[0][1]),
    // );

    // console.log(new Intl.DateTimeFormat("en-US").format(data[0][0]));

    // data.map((el) => {
    //   console.log(el[0]);
    //   return el[0];
    // });

    // const test = d3
    //   .scaleTime()
    //   .domain(
    //     d3.extent(data, (d) => {
    //       // console.log(d[0]);

    //       return d[0];
    //     }),
    //   )
    //   .range([marginLeft, width - marginRight]);
    // // console.log(test);

    // Declare the x (horizontal position) scale.
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d, i) => i))
      .range([marginLeft, width - marginRight]);
    // console.log(xScale);

    const xScaleDate = d3
      .scaleTime()
      .domain(d3.extent(data, (d, i) => new Date(d[0])))
      .range([marginLeft, width - marginRight]);

    // console.log(d3.extent(data, (d, i) => new Date(d[0])));

    // Declare the y (vertical position) scale.
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[1])])
      .range([height - marginBottom, marginTop]);

    // Add a rect for each bar.
    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("id", (d, i) => i)
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("x", (d, i) => {
        const p = xScale(i * 1);

        // console.log("index: ", i);
        // console.log("position, x: ", p);

        return p;
      })
      .transition()
      .ease(d3.easeCubic)
      .duration(2500)
      .attr("fill", "currentColor")
      .attr("y", (d) => yScale(d[1] + 100))
      .attr("height", (d) => yScale(0) - yScale(d[1]))
      .attr("width", barWidth);

    // Add the x-axis and label.
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .transition()
      .ease(d3.easeCubic)
      .delay(3000)
      .duration(2000)
      .call(d3.axisBottom(xScaleDate).tickFormat(d3.timeFormat("%Y")));
    // .call((g) => g.select(".domain").remove());

    // Add the y-axis and label, and remove the domain line.
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .transition()
      .ease(d3.easePolyIn.exponent(3))
      .delay(4500)
      .duration(2000)
      .call(
        d3.axisLeft(yScale).tickFormat((yScale) => {
          // console.log(
          //   new Intl.NumberFormat("en-US", {
          //     currency: "USD",
          //     style: "currency",
          //   }).format(yScale),
          // );

          return new Intl.NumberFormat("en-US", {
            currency: "USD",
            style: "currency",
          }).format(yScale);
        }),
      )
      .attr("class", "tick")
      // .call((g) => g.select(".domain").remove())
      // .call((g) =>
      //   g
      //     .append("text")
      //     .attr("x", -marginLeft)
      //     .attr("y", 10)
      //     .attr("fill", "currentColor")
      //     .attr("text-anchor", "start")
      //     .text("↑ GDP"),
      // )
      .attr("id", "y-axis");
  };

  return (
    <>
      <div className="flex h-screen flex-col content-center items-center justify-center">
        <h1
          id="title"
          className="font-bold text-neutral-900 dark:text-neutral-200"
        >
          Bar Chart Showing United States GDP 1947 - 2015
        </h1>
        <svg id="bar-chart" width={width} height={height}></svg>
        <a
          className="text-sm text-neutral-900 dark:text-neutral-200"
          href="https://fred.stlouisfed.org/"
          target="_blank"
        >
          Source: Federal Reserve Economic Data
        </a>
      </div>
    </>
  );
};

export default BarChart;
