import React from 'react';

const TempDisplay = (props) => {
  const { name, color, currentTemp, minTemp, avgTemp, maxTemp } = props;

  return (
    <div className="bg-gray-50 flex grow flex-col items-center justify-center border-b border-r border-gray-400 p-2 w-56">
      <div className="flex items-center w-full">
        <div>
          <div className="text-xl w-10 font-bold">{name || 'T1'}</div>
          {/* <div className={`bg-${color || 'gray'}-800 h-0.5 w-full my-2`} /> */}
          <div className={`${color || 'bg-gray-800'} h-0.5 w-full my-2`} />
        </div>
        <div className="text-4xl text-center mx-auto">
          {currentTemp || '--.-'}&#176;C
        </div>
      </div>
      <div className="flex gap-2 pt-2 text-xs text-gray-500">
        <div>MIN : {minTemp || '--.-'}&#176;C</div>
        <div>AVG : {avgTemp || '--.-'}&#176;C</div>
        <div>MAX : {maxTemp || '--.-'}&#176;C</div>
      </div>
    </div>
  );
};

export default TempDisplay;
