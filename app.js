const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const history = require("./models/history");
const dotenv = require("dotenv");
dotenv.config();
const helmet = require("helmet");
const axios = require("axios");

const passengersRoutes = require("./routes/passengers-routes");
const ridesRoutes = require("./routes/ridesRoutes");
// const driversRoutes = require("./routes/drivers-routes");
const driversRoutes = require("./routes/drivers-routes");

const pendingDriversRoute = require("./routes/pendingDrivers-routes");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

// app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use("/api/passengers", passengersRoutes);
app.use("/api/rides", ridesRoutes);
app.use("/api/drivers", driversRoutes);
app.use("/api/pendingDrivers", pendingDriversRoute);

app.use(cors());
app.use(helmet());
let histories = [];

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://example.com",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user Connected");
  socket.on("inputChange", (data) => {
    socket.broadcast.emit("hello", "world");
  });
  // const emitReject = (data) => {
  //   socket.broadcast.emit("onRejecting", data);
  // };

  socket.on("passengerBooked", (data) => {
    console.log("Here we go");
    socket.broadcast.emit("passengerBooked", data);
    console.log(data);
  });
  socket.on("acceptingRequest", (data) => {
    // let da = [data[0], data[1]];
    socket.broadcast.emit("acceptedDriver", data);
    // console.log(data[1]);

    socket.broadcast.emit("rejectDriver", data);

    // emitReject(data);
  });
  socket.on("redirectDriver", (data) => {
    socket.broadcast.emit("redirectDrivers", data);
  });

  socket.on("drivers", (data) => {
    let drivers = [];
    // console.log(data);
    data[0].map((dd) => {
      let newDriver = {
        location: dd.location,
        vehicleType: dd.vehicleType,
        email: dd.email,
      };
      drivers.push(newDriver);
    });
    let ride = data[1];
    let ds = [drivers, ride];
    socket.broadcast.emit("drivers", ds);
  });

  socket.on("notifyingPassengers", (data) => {
    // console.log(data);
    socket.broadcast.emit("passengersNotification", data);
  });
  socket.on("passengersPicked", (data) => {
    socket.broadcast.emit("driverPickedPassengers", data);
    console.log("This");
  });
  socket.on("passengersDroped", (data) => {
    socket.broadcast.emit("driverDropedPassengers", data);
    console.log("This");
  });

  socket.on("demoButtonClicked", (msg) => {
    // console.log(histories);

    const getRides = async () => {
      let hist;
      hist = await history.find();
      socket.broadcast.emit("pp", hist);
      console.log("pp");
    };

    let rides = getRides();
  });
});

// server.listen(8000);

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

// server.listen(port, () => console.log("server running on port:" + port));

mongoose
  .connect(
    "mongodb+srv://alken:ezvukZlSa1J1rabk@cluster0.prrif.mongodb.net/taxi_dispatcher_system?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
