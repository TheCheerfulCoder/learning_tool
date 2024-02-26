const { secureHeapUsed } = require('crypto');
const express = require('express');
const path = require('path');
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
  try {
    var routeName = req.params.routeName;
    var departureTime = req.params.departureTime;
    var scheduledArrivalTime = req.params.scheduledArrivalTime;

    // Check if the routeName is valid
    if (!ferryRoutes.hasOwnProperty(routeName)) {
      res.send(`ERROR: ${routeName} is an invalid or unsupported route`);
    }

    // Check if the departureTime is valid
    const militaryTimeRegex = new RegExp(/^[0-2][0-9][0-9][0-9]$/);
    if (!militaryTimeRegex.test(departureTime) || (Number(departureTime > 2400))) {
      res.send(`ERROR: "${departureTime}" is an invalid time format`);
    }

    // Calculate the estimated arrival time
    departureTime = Number(departureTime);
    scheduledArrivalTime = Number(scheduledArrivalTime);

    routeLength = ferryRoutes[routeName];
    estimatedArrivalTime = departureTime + routeLength;

    if (estimatedArrivalTime > 2400) {
      estimatedArrivalTime = estimatedArrivalTime - 2400;
    }

    // Add preceding zeroes
    if (estimatedArrivalTime < 1000) {
      estimatedArrivalTime = 0 + estimatedArrivalTime.toString()
    }
    if (departureTime < 1000) {
      departureTime = 0 + departureTime.toString();
    }
    if (estimatedArrivalTime < 100) {
      estimatedArrivalTime = 00 + estimatedArrivalTime.toString();
    }
    if (departureTime < 100) {
      departureTime = 00 + departureTime.toString();
    }

    // Send the result to the user
    res.send(
      `{"routeName": "${routeName}", "departureTime": "${departureTime}", "estimatedArrivalTime": "${estimatedArrivalTime}"}`
    );
  } catch {
    res.status(500).send("ERROR: 500 Internal Server Error");
  }
});

app.listen(port);
console.log(`App running on http://localhost:${port}`);
