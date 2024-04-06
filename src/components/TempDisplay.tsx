import React from "react";

interface TempDisplayProps {
  name?: string;
  color?: React.ComponentProps<"div">["className"];
  currentTemp?: number;
  minTemp?: number;
  avgTemp?: number;
  maxTemp?: number;
  disabled?: boolean;
  unit?: "C" | "F";
}

const tempLimit = (input: number | null): string => {
  if (typeof input !== "number") return "--.-";
  if (input >= -100 && input <= 200) return input.toFixed(1);
  if (input > 200) return ">200.0";
  if (input < -100) return "<-100.0";
  return "--.-";
};

const TempDisplay: React.FC<TempDisplayProps> = ({
  name = "T",
  color,
  currentTemp = null,
  minTemp = null,
  avgTemp = null,
  maxTemp = null,
  disabled = false,
  unit = "C",
}) => {
  return (
    <div className="bg-gray-50 flex grow flex-col justify-center border-b border-r border-gray-400 p-2 w-56">
      <div className="flex items-center w-full">
        <div>
          <div
            className={`${
              disabled
                ? "text-xl w-10 font-bold text-gray-500"
                : "text-xl w-10 font-bold"
            }`}
          >
            {name}
          </div>
          <div className={`${color || "bg-gray-800"} h-0.5 w-full my-2`} />
        </div>
        <div
          className={`${
            disabled
              ? "text-4xl text-center mx-auto text-gray-500"
              : "text-4xl text-center mx-auto"
          }`}
        >
          {tempLimit(currentTemp)}&#176;{unit}
        </div>
      </div>
      <div className="flex justify-between pt-2 me-6 text-xs text-gray-500">
        <div>
          MIN:
          <br /> {tempLimit(minTemp)}&#176;{unit}
        </div>
        <div>
          AVG:
          <br /> {tempLimit(avgTemp)}&#176;{unit}
        </div>
        <div>
          MAX:
          <br /> {tempLimit(maxTemp)}&#176;{unit}
        </div>
      </div>
    </div>
  );
};

export default TempDisplay;

