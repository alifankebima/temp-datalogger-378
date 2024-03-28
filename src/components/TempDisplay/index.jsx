import React from "react";

const tempLimit = (input) => {
  input = parseFloat(input).toFixed(1);
  if (input >= -100 && input <= 200) return input;
  if (input > 200) return ">200.0";
  if (input < -100) return "<-100.0";
  return "--.-";
};

const TempDisplay = (props) => {
  const { name, color, currentTemp, minTemp, avgTemp, maxTemp } = props;

  return (
    <div className="bg-gray-50 flex grow flex-col items-center justify-center border-b border-r border-gray-400 p-2 w-56">
      <div className="flex items-center w-full">
        <div>
          <div className="text-xl w-10 font-bold">{name || "T1"}</div>
          <div className={`${color || "bg-gray-800"} h-0.5 w-full my-2`} />
        </div>
        <div className="text-4xl text-center mx-auto">
          {tempLimit(currentTemp)}&#176;C
        </div>
      </div>
      <div className="flex gap-2 pt-2 text-xs text-gray-500">
        <div>MIN : {tempLimit(minTemp)}&#176;C</div>
        <div>AVG : {tempLimit(avgTemp)}&#176;C</div>
        <div>MAX : {tempLimit(maxTemp)}&#176;C</div>
      </div>
    </div>
  );
};

export default TempDisplay;
