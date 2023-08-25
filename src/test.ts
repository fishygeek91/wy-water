// const wyWater = require("./index.ts"); // assuming your module's entry point is named index.js
import { getWyomingSites, getDailyRiverMetrics, getInstantaneousRiverMetrics } from "./index.js";

// getWyomingSites()
//   .then((data) => {
//     console.log("Fetched Data:", data);
//   })
//   .catch((error) => {
//     console.error("Error fetching data:", error);
//   });
// getDailyRiverMetrics("13013650", "P7D")
//   .then((data) => {
//     console.log("Fetched Data:", data);
//   })
//   .catch((error) => {
//     console.error("Error fetching data:", error);
//   });

getInstantaneousRiverMetrics("13013650", "P7D")
  .then((data) => {
    console.log("Fetched Data:", data);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// wyWater
//   .getRiverFlowData("?site=13013650&format=json")
//   .then((data) => {
//     data.value.timeSeries[0].values.forEach((element) => {
//       console.log(element);
//     });
//     // console.log("Fetched Data:", data.value.timeSeries[0].values[0]);
//   })
//   .catch((error) => {
//     console.error("Error fetching data:", error);
//   });
