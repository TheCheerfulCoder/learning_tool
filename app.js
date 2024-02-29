const { secureHeapUsed } = require('crypto');
const express = require('express');
const path = require('path');
const { stringify } = require('querystring');
const app = express();
const port = 8080;
const ferryRoutes = {
  "SEA-BR": 60,
  "SEA-BI": 35,
  "ED-KING": 30,
  "MUK-CL": 20
}

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/:routeName/:departureTime", (req, res) => {
  // try {
  var routeName = req.params.routeName;
  var departureTime = req.params.departureTime;

  // Check if the routeName is valid
  if (!ferryRoutes.hasOwnProperty(routeName)) {
    res.send(`ERROR: ${routeName} is an invalid or unsupported route`);
  }

  // Check if the departureTime is valid
  const militaryTimeRegex = new RegExp(/^[0-2][0-9][0-5][0-9]$/);
  if (!militaryTimeRegex.test(departureTime) || Number(departureTime > 2400)) {
    res.send(`ERROR: "${departureTime}" is an invalid time format`);
  }

  // Calculate the estimated arrival time
  const departureHour = Number(departureTime.slice(0, 2));
  const departureMin = Number(departureTime.slice(2, 4));

  const routeLength = ferryRoutes[routeName];
  departureTimeObj = new Date(0, 0, 0, departureHour, departureMin, 0, 0);
  var estimatedArrivalTime = new Date(
    departureTimeObj.getTime() + routeLength * 60 * 1000
  );

  // Get the estimated arrival time in military time
  var estimatedArrivalHour = estimatedArrivalTime.getHours();
  var estimatedArrivalMin = estimatedArrivalTime.getMinutes();

  if (estimatedArrivalHour.toString().length < 2) {
    estimatedArrivalHour = "0" + estimatedArrivalHour.toString();
  }
  if (estimatedArrivalMin.toString().length < 2) {
    estimatedArrivalMin = "0" + estimatedArrivalMin.toString();
  }
  
  estimatedArrivalTime =
    estimatedArrivalHour.toString() + estimatedArrivalMin.toString();

  // Send the result to the user
  res.send(
    `{"routeName": "${routeName}", "departureTime": "${departureTime}", "estimatedArrivalTime": "${estimatedArrivalTime}"}`
  );
  // } catch {
  //   res.status(500).send("ERROR: 500 Internal Server Error");
  // }
});

app.listen(port);
console.log(`App running on http://localhost:${port}`);
