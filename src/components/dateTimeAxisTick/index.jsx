import React from "react";

const dateTimeAxisTick = (props) => {
  const { x, y, stroke, payload } = props
  // const date = new Date(payload.value);
  // let formattedTime;
  // let isMidnight = date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0

  // if (isMidnight) {
  //   formattedTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  // } else {
  //   formattedTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  // }

  // return (
  //   <g transform={`translate(${x},${y})`}>
  //     <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
  //       {"hello"}
  //     </text>
  //   </g>
  // );
  console.log(props);
  return (
    <g transform={`translate(${x},${y})`}>
    <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
      {payload.value}
    </text>
  </g>
  );
};

export default dateTimeAxisTick;
// export default class dateTimeAxisTick extends PureComponent {
//   render() {
//     const { x, y, stroke, payload } = this.props;

//     return (
//       <g transform={`translate(${x},${y})`}>
//         <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
//           {payload.value}
//         </text>
//       </g>
//     );
//   }
// }