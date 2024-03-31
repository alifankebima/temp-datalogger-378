import React from "react";

const dateTimeAxisTick = (props) => {
  const { x, y, stroke, payload, showDate } = props;
  const date = new Date(payload.value);
  let formattedTime;

  if (showDate) {
    formattedTime = date.toLocaleDateString();
  } else {
    formattedTime = date.toTimeString().split(' ')[0];
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#666"
        fontSize={14}
      >
        {formattedTime}
      </text>
    </g>
  );
};

export default dateTimeAxisTick;
