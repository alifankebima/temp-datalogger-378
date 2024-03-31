import React from "react";

const tempLimit = (input) => {
  input = parseFloat(input).toFixed(1);
  if (input >= -100 && input <= 200) return input;
  if (input > 200) return ">200.0";
  if (input < -100) return "<-100.0";
  return "--.-";
};

const TempDisplay = (props) => {
  const { name, color, currentTemp, minTemp, avgTemp, maxTemp, isDisabled } = props;

  return (
    <div className="bg-gray-50 flex grow flex-col justify-center border-b border-r border-gray-400 p-2 w-56">
      <div className="flex items-center w-full">
        <div>
          <div className={`${isDisabled ? "text-xl w-10 font-bold text-gray-500" : "text-xl w-10 font-bold"}`}>{name || "T"}</div>
          <div className={`${color || "bg-gray-800"} h-0.5 w-full my-2`} />
        </div>
        <div className={`${isDisabled ? "text-4xl text-center mx-auto text-gray-500" : "text-4xl text-center mx-auto"}`}>
          {tempLimit(isDisabled ? null : currentTemp)}&#176;C
        </div>
      </div>
      <div className="flex justify-between pt-2 me-6 text-xs text-gray-500">
        <div>MIN:<br /> {tempLimit(isDisabled ? null : minTemp)}&#176;C</div>
        <div>AVG:<br /> {tempLimit(isDisabled ? null : avgTemp)}&#176;C</div>
        <div>MAX:<br /> {tempLimit(isDisabled ? null : maxTemp)}&#176;C</div>
      </div>
    </div>
  );
};

export default TempDisplay;
