const fs = require("fs");

const routes = app => {
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

  app.get("/config/download", (req, res) => {
    try {
      return res.sendFile(`${__dirname}/json/config.json`);
    } catch (error) {
      console.log(error);
    }
  });

  app.get("/config", (req, res) => {
    try {
      const data = fs.readFileSync(`${__dirname}/json/config.json`);
      const config = JSON.parse(data);
      return res.status(200).json(config);
    } catch (error) {
      return res.status(500).json(error);
    }
  });

  app.get("/config/categories", (req, res) => {
    try {
      const data = fs.readFileSync(`${__dirname}/json/config.json`);
      const config = JSON.parse(data);
      const categories = [];
      for (const prop in config) {
        categories.push(prop);
      }
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json(error);
    }
  });

  

  app.get("/config/categories/:key", (req, res) => {
    try {
      if (!(req && req.params && req.params.key))
        return res.status(500).json({ error: "Bad Request" });
      const key = req.params.key;
      const data = fs.readFileSync(`${__dirname}/json/config.json`);
      const config = JSON.parse(data);
      const filtered = config[key];
      return res.status(200).json(filtered);
    } catch (error) {
      return res.status(500).json(error);
    }
  });

  app.post("/config/update", (req, res) => {
    try {
      const key = req.body.key;
      const value = req.body.value;
      const data = fs.readFileSync(`${__dirname}/json/config.json`);
      const config = JSON.parse(data);
      config[key] = value;
      const updatedData = JSON.stringify(config);
      fs.writeFileSync(`${__dirname}/json/config.json`, updatedData);
      return res.status(200).json(value);
    } catch (error) {
      return res.status(500).json(error);
    }
  });
};

module.exports = routes;
