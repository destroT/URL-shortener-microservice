var express = require("express");
var path = require("path");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server listening on port: ${PORT}`));
