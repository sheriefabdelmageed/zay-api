const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes");

app.use(bodyParser());
app.use(fileUpload());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://zay-json.netlify.com/"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

routes(app);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("server is started!");
  console.log("server is running on port: http://localhost:", port);
});
