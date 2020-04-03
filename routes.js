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
      if (fs.existsSync(`${__dirname}/json/config.json`)) {
        return res.sendFile(`${__dirname}/json/config.json`);
      } else {
        return res.sendFile(`${__dirname}/json-init/config.json`);
      }
    } catch (error) {
      console.log(error);
    }
  });

  app.get("/config", (req, res) => {
    try {
      let data = _getData();
      const config = JSON.parse(data);
      return res.status(200).json(config);
    } catch (error) {
      return res.status(500).json(error);
    }
  });

  app.get("/config/categories", (req, res) => {
    try {
      let data = _getData();
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
      let data = _getData();
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

      //get data
      let data = _getData();

      //backup old data
      _backupData(data);

      //write new change to config.json
      _writeData(data, key, value);

      return res.status(200).json(value);
    } catch (error) {
      return res.status(500).json(error);
    }
  });
};

function _getData() {
  let data;
  if (fs.existsSync(`${__dirname}/json/config.json`)) {
    data = fs.readFileSync(`${__dirname}/json/config.json`);
  } else {
    data = fs.readFileSync(`${__dirname}/json-init/config.json`);
  }

  return data;
}

function _backupData(data) {
  const date = new Date().valueOf().toString();
  const backupData = data;
  if (!fs.existsSync(`${__dirname}/json-backup/`))
    fs.mkdirSync(`${__dirname}/json-backup/`);
  if (!fs.existsSync(`${__dirname}/json-backup/${date}`))
    fs.mkdirSync(`${__dirname}/json-backup/${date}`);
  fs.writeFileSync(`${__dirname}/json-backup/${date}/config.json`, backupData);
}

function _writeData(data, key, value) {
  const config = JSON.parse(data);
  config[key] = value;
  const updatedData = JSON.stringify(config);
  if (!fs.existsSync(`${__dirname}/json`)) fs.mkdirSync(`${__dirname}/json`);
  fs.writeFileSync(`${__dirname}/json/config.json`, updatedData);
}

module.exports = routes;
