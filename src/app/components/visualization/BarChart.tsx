"use client";

import React, { useState } from "react";
import * as d3 from "d3";
import { useEffect } from "react";
import axios from "axios";

//npm i --save-dev @types/d3

const BarChart = () => {
  // http request json with axios
  const [data, setData] = useState<[string, number][]>([]);

  const url: string =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

  // data fetches when component mounts
  useEffect(() => {
    const fetchDataAsync = async () => {
      const response = await axios.get(url);
      const data = await response.data;
      setData(data.data);
    };
    fetchDataAsync();
  }, []);

  const width = 928;
  const height = 500;

  useEffect(() => {
    if (data.length > 0) createBarChart();
  });

  const createBarChart = () => {
    /*     console.log(data[0][1]);

    console.log(
      new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
      }).format(data[0][1]),
    );

    console.log(new Intl.DateTimeFormat("en-US").format(data[0][0]));

    data.map((el) => {
      console.log(el[0]);
      return el[0];
    });

    const test = d3
      .scaleTime()
      .domain(
        d3.extent(data, (d) => {
          // console.log(d[0]);

          return d[0];
        }),
      )
      .range([marginLeft, width - marginRight]);
    // console.log(test); */

    // margin
    const marginTop = 40;
    const marginRight = 60;
    const marginBottom = 40;
    const marginLeft = 60;

    const barWidth = 2;

    // select svg element
    const svg = d3.select("svg");

    // Declare the x (horizontal position) scale.
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d, i) => i) as [number, number])
      .range([marginLeft, width - marginRight]);
    // console.log(xScale);

    const xScaleDate = d3
      .scaleTime()
      .domain(
        d3.extent(data, (d) => new Date(d[0])) as [Date, Date], // Explicitly cast the type after filtering
      )
      .range([marginLeft, width - marginRight]);

    // console.log(d3.extent(data, (d, i) => new Date(d[0])));

    // Declare the y (vertical position) scale.
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[1])!]) // Use non-null assertion since we know data exists
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
      .call(
        d3
          .axisBottom(xScaleDate)
          .tickFormat((d) => d3.timeFormat("%Y")(d as Date)),
      );
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
          }).format(yScale as number);
        }),
      )
      .attr("class", "tick")
      .attr("id", "y-axis");
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

    // tooltips
    const tooltip = d3
      .select("div")
      .append("div")
      .attr("class", "tooltip absolute tooltip-open origin-center")
      .attr("data-theme", "black")
      .style("opacity", 0);

    d3.selectAll("rect")
      .on("mouseover", (event, d, i) => {
        // console.log("x", event.x, "y", event.y);

        // const x = event.x;

        tooltip.transition().duration(500).style("opacity", 0.9);
        tooltip
          .attr("data-tip", `${d[0]}, ${d[1]} Billion`)
          .attr("data-date", () => {
            const date = d[0];
            // console.log("date", date);
            return date;
          })
          .attr("data-gdp", () => {
            const gdp = d[1];
            // console.log("gdp", gdp);
            return gdp;
          });
        //   .style("transform", `translateY(${event.y - width / 1.5}px)`)
        //   .style("transform", `translateX(${x}px)`);
        // console.log(x);
        // console.log("innerWidth", innerWidth);
        // console.log("width", width);
      })
      .on("mouseout", function () {
        tooltip.transition().duration(500).style("opacity", 0);
      });
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
