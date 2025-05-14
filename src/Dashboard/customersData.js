// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { startGetAllOrders } from "../actions/order-action";
// import { Chart } from "chart.js/auto";
// import { Pie } from "react-chartjs-2";

// const CustomersOrders = () => {
//   const dispatch = useDispatch();
//   const orders = useSelector((state) => {
//     return state.order;
//   });
//   console.log(orders, "all orders");

//   useEffect(() => {
//     dispatch(startGetAllOrders());
//   }, [dispatch]);

//   // Initialize state to hold data for the pie chart
//   const [chartData, setChartData] = useState(null);

//   useEffect(() => {
//     if (orders && orders.paid) {
//       // Count the number of orders for each customer
//       const customersData = orders.paid?.reduce((acc, order) => {
//         const customerName = order.customerId?.customerName;
//         const operatorName = order.operatorId?.operatorName; // Get operator name
//         const key = `${customerName} (${operatorName})`; // Use both customer and operator name as key
//         acc[key] = acc[key] ? acc[key] + 1 : 1;
//         return acc;
//       }, {});

//       // Convert customer data to Chart.js format
//       const data = {
//         labels: Object.keys(customersData),
//         datasets: [
//           {
//             data: Object.values(customersData),
//             backgroundColor: [
//               "rgba(255, 99, 132, 0.6)",
//               "rgba(54, 162, 235, 0.6)",
//               "rgba(255, 206, 86, 0.6)",
//               "rgba(75, 192, 192, 0.6)",
//               "rgba(153, 102, 255, 0.6)",
//               "rgba(255, 159, 64, 0.6)",
//             ],
//           },
//         ],
//       };

//       // Update the state with the data for the pie chart
//       setChartData(data);
//     }
//   }, [orders]);

//   return (
//     <div style={{ width: '80%', margin: 'auto' }}>
//       <h2>Orders Count</h2>
//       <div style={{ width: '100%', textAlign: 'center' }}>
//         {chartData && <Pie data={chartData} />}
//       </div>
     
//     </div>
//   );
// };

// export default CustomersOrders;

