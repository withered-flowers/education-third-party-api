const cors = require("cors");
const express = require("express");
const app = express();

const port = process.env.PORT || 10000;
// ini nanti valuenya harus pake ".env"
const GITHUB_TOKEN = "";

// -----Anggap aja ini file yang lain
const axios = require("axios");

// Axios yang punya pola nya dulu (instance dari axios)
const githubInstance = axios.create({
  baseURL: "https://api.github.com/",
  headers: {
    Acccept: "application/vnd.github+json",
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});

// module.exports = { githubInstance }
// -----End of Anggapan

// middleware untuk menggunakan cors
app.use(cors());
// middleware untuk bisa menerima json => "Accept" => application/json
app.use(express.json());
// middleware untuk bisa menerima => "Accept" => application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: false }));

// GET /custom-repos
app.get("/custom-repos", async (req, res, next) => {
  try {
    const { data } = await githubInstance.get("/user/repos");

    res.status(200).json({
      kodeSetatus: 200,
      dataKembalian: data,
    });
  } catch (err) {
    console.log(err);
    // harusnya ada error handling...
  }
});

// POST /custom-repos
// Selalu membuat public repository dengan "namaRepository" yang diberikan
app.post("/custom-repos", async (req, res, next) => {
  try {
    const { namaRepository } = req.body;

    const { data } = await githubInstance.post("/user/repos", {
      name: namaRepository,
    });

    res.status(201).json({
      kodeSetatus: 201,
      dataKembalian: data,
    });
  } catch (err) {
    console.log(err);
    // harusnya nanti ada error handling...
  }
});

// Jalanin
app.listen(port, (_) => console.log(`apps is working at ${port}`));
