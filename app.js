const rateLimit = require("express-rate-limit");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const { PORT, DATABASE_URL } = process.env;
const routes = require("./routes/index");
const cors = require("cors");

// Start : Do Not Delete This code // Sentry is error traking software
const { ProfilingIntegration } = require("@sentry/profiling-node");
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://ab61bb744299f6a2bd32f2e24cec0b6d@o4504937519710208.ingest.sentry.io/4506516605173760",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// End : Do Not Delete This code // Sentry is error traking software

// =======================
// configuration =========
// =======================
mongoose.set("strictQuery", false);
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: 0,
  keepAlive: true,
}); // connect to DATABASE_URL
console.log("MongoDb Connection: ", DATABASE_URL);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on("connected", function () {
  console.log("Mongoose default connection open to " + DATABASE_URL);
});

// If the connection throws an error
mongoose.connection.on("error", function (err) {
  console.log("Mongoose default connection error: " + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", function () {
  console.log("Mongoose default connection disconnected");
});

// Body-parser
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/v1", routes);
app.get("/", (req, res) => {
  res.send("Wel-Come Kaivee FrontEnd APIs");
});

const limiter = rateLimit({
  windowMs: 1000,
  max: 10,
});
// Rate Limiter
app.use(limiter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
