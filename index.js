const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

app.use(fileUpload());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.post("/upload", (req, res) => {
  if (req.files === null) return res.status(400).json({ msg: "bad request" });
  const file = req.files.file;

  file.mv(`${__dirname}/files/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: "server error" });
    }

    return res.status(200).json({
      filename: file.name,
      filepath: `/files/${file.name}`
    });
  });
});

app.get("/", (req, res) => {
  res.json("Server is running");
});

app.get("/files/:img", (req, res) => {
  try {
    const img = req.params["img"];
    return res.sendFile(`${__dirname}/files/${img}`);
  } catch (error) {}
});

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log("server is started!");
});
