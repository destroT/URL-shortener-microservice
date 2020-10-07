// Imports
var express = require("express");
var path = require("path");
var cors = require("cors");

// Load Routes
var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");

// Initialize
var app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// initialize routes
app.use("/", indexRouter);
app.use("/api", apiRouter);

// Run server
const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server listening on port: ${PORT}`));
