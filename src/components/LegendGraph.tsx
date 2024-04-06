import React from "react";

const legendGraph:React.FC<string> = (value = "") => {
  return <span>{value.toUpperCase()}</span>;
};

export default legendGraph;
