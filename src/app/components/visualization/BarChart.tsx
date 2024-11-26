import React from "react";
import * as d3 from "d3";
import { useRef, useEffect } from "react";

//npm i --save-dev @types/d3

const BarChart = () => {
  const data = [5000, 50000, 500, 6000, 4050, 3050, 200];
  const width = 640;
  const height = 400;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;

  const gx = useRef<SVGGElement>(null);
  const gy = useRef<SVGGElement>(null);

  // x scale
  const x = d3.scaleLinear(
    [0, data.length - 1],
    [marginLeft, width - marginRight],
  );

  // y scale
  const y = d3.scaleLinear(
    [0, d3.max(data)],
    [height - marginBottom, marginTop],
  );

  const line = d3.line((d, i) => x(i), y);

  useEffect(() => {
    if (gx.current) d3.select(gx.current).call(d3.axisBottom(x));
  }, [gx, x]);

  useEffect(() => {
    if (gx.current) d3.select(gy.current).call(d3.axisLeft(y));
  }, [gy, y]);

  return (
    <>
      <div className="flex h-screen flex-col content-center items-center justify-center">
        <h1
          id="title"
          className="font-bold text-neutral-900 dark:text-neutral-200"
        >
          Chart Showing United States GDP 1947 - 2015
        </h1>
        <svg width={width} height={height}>
          <g
            ref={gx}
            transform={`translate(0,${height - marginBottom})`}
            id="x-axis"
          />
          <g ref={gy} transform={`translate(${marginLeft},0)`} id="y-axis" />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            d={line(data) || ""}
          />
          <g fill="white" stroke="currentColor" strokeWidth="1.5">
            {data.map((d, i) => (
              <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
            ))}
          </g>
        </svg>
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
