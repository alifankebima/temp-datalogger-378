import React from "react";

// interface DateTimeAxisTickProps {
//   x?: string | number;
//   y?: string | number;
//   stroke?: string;
//   payload: {
//     value?: number;
//   };
//   showDate?: boolean;
// }

interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: number;
  };
  showDate?: boolean;
}

const DateTimeAxisTick = ({ x, y, payload, showDate }: CustomTickProps) => {
  const date = new Date(payload?.value ?? 0);
  let formattedTime: string;

  if (showDate) {
    formattedTime = payload?.value ? date.toLocaleDateString() : "";
  } else {
    formattedTime = payload?.value ? date.toLocaleTimeString().split(".").join(":") : "";
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={14}>
        {formattedTime}
      </text>
    </g>
  );
};

export default DateTimeAxisTick;
