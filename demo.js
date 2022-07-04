const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();
const helmet = require("helmet");
const axios = require("axios");

const passengersRoutes = require("./routes/passengers-routes");
const ridesRoutes = require("./routes/ridesRoutes");
// const driversRoutes = require("./routes/drivers-routes");
const driversRoutes = require("./routes/drivers-routes");
const io = require("socket.io");

const pendingDriversRoute = require("./routes/pendingDrivers-routes");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
const server = app.listen(3000, () =>
  console.log(`Server running on port ${300}.`)
);

// const server = require("http").createServer(app);
const socket = require("socket.io")(server);
socket.on("connection", async (client) => {
  console.log("client connected...");

  client.on("message", async (msg) => {
    // let message = await Message.Schema.statics.create(msg);
    socket.emit("message", "This is the mesage");
  });

  let latest = await Message.Schema.statics.latest(10);
  client.emit("latest", latest);
});

app.use("/api/passengers", passengersRoutes);
app.use("/api/rides", ridesRoutes);
app.use("/api/drivers", driversRoutes);
app.use("/api/pendingDrivers", pendingDriversRoute);

app.use(cors());
app.use(helmet());

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

server.listen(port, () => console.log("server running on port:" + port));

mongoose
  .connect(
    "mongodb+srv://alken:ezvukZlSa1J1rabk@cluster0.prrif.mongodb.net/taxi_dispatcher_system?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
