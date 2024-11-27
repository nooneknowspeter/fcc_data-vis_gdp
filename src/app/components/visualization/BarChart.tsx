"use client";

import React, { useState } from "react";
import * as d3 from "d3";
import { useEffect } from "react";
import axios from "axios";

//npm i --save-dev @types/d3

const BarChart = () => {
  // http request json with axios
  const [data, setData] = useState([[]]);

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
    const marginTop = 20;
    const marginRight = 60;
    const marginBottom = 20;
    const marginLeft = 60;

    // select svg element
    const svg = d3.select("svg");

    // console.log(data[0][1]);
    // console.log(
    //   new Intl.NumberFormat("en-US", {
    //     currency: "USD",
    //     style: "currency",
    //   }).format(data[0][1]),
    // );

    // Declare the x (horizontal position) scale.
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d, i) => i)])
      .range([marginLeft, width - marginRight]);

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
        let p = xScale(i * 1);
        // console.log("index: ", i);
        // console.log("position, x: ", p);
        return p;
      })
      .attr("fill", "currentColor")
      .attr("y", (d) => yScale(d[1] + 100))
      .attr("height", (d) => yScale(0) - yScale(d[1]))
      .attr("width", 2);

    // Add the x-axis and label.
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0))
      .attr("id", "x-axis");

    // Add the y-axis and label, and remove the domain line.
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
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
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ GDP"),
      )
      .attr("id", "y-axis");
  };

  return (
    <>
      <div className="flex h-screen flex-col content-center items-center justify-center">
        <h1
          id="title"
          className="font-bold text-neutral-900 dark:text-neutral-200"
        >
          Chart Showing United States GDP 1947 - 2015
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
