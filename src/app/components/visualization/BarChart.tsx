import React from "react";
import * as d3 from "d3";
import { useRef, useEffect } from "react";

//npm i --save-dev @types/d3

const BarChart = () => {
  const data = [5000, 50000, 500, 1, 1, 1, 1];
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
  const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]);

  const line = d3.line((d: number, i: number) => x(i), y);

  useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
  useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);

  return (
    <>
      <div className="flex h-screen content-center items-center justify-center">
        <svg width={width} height={height}>
          <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
          <g ref={gy} transform={`translate(${marginLeft},0)`} />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            d={line(data)}
          />
          <g fill="white" stroke="currentColor" strokeWidth="1.5">
            {data.map((d, i) => (
              <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
            ))}
          </g>
        </svg>
      </div>
    </>
  );
};

export default BarChart;
