/*
  Aplikasi express untuk listing repositories yang ada

  Mulai dari baca github
  https://docs.github.com/en/rest
  https://docs.github.com/en/rest/overview/resources-in-the-rest-api
    Dari sini diketahui
      URL dasar dari github API adalah: 
        - https://api.github.com
      Secara eksplisit butuh Header 
        Header adalah [Key - Value] property tambahan pada HTTP
        Formatnya adalah Key: Value
        
        Header yang diminta untuk github adalah
        - Accept: application/vnd.github.v3+json
  https://docs.github.com/en/rest/overview/other-authentication-methods#via-oauth-and-personal-access-tokens
    Dari sini diketahui butuh authentikasi juga via PAT (Personal Access Token)
      Authorization:
        - username: <username_orang_yang_akan_mengakses>
        - password: <personal_access_token>

  Endpoint Github yang digunakan:
    - https://docs.github.com/en/rest/reference/repos#list-repositories-for-a-user
    - https://docs.github.com/en/rest/reference/pulls#list-pull-requests
  
  .env
    GITHUB_ACCESS_TOKEN=....

  app.js
    GET /github/repos
      Listing semua repo yang dimiliki oleh si user, yang publik saja
    GET /github/pull-request 
      Listing semua pull request dari rmt-17-quimper-fox/p2-cms-integration-server
*/

require("dotenv").config();

const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.use(require("cors")());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// file: apis/axios.js

// Dokumentasi dibaca di sini ...
// https://github.com/axios/axios
const axios = require("axios");

const instance = axios.create({
  baseURL: "https://api.github.com/",
  // Header yang dibutuhkan untuk github,
  headers: {
    Accept: "application/vnd.github.v3+json",
  },
  // Nah ternyata untuk curl -u itu, kita butuh Authentication
  // Sudah disiapkan Axios
  // Note:
  // harus baca dari APInya apakah support "Basic Authentication"
  // (Kebetulan di Github support)
  auth: {
    username: process.env.GITHUB_USERNAME,
    password: process.env.GITHUB_ACCESS_TOKEN,
  },
});

// Jangan lupa untuk bisa dipakai di tempat lain nantinya perlu di... export
// module.exports = instance;

// end of dile apis/axios.js

app.get("/github/repos", async (req, res) => {
  // Axios instance.get akan mengembalikan Promise<Response>
  // jadi kita bisa await untuk ambil responsenya
  const response = await instance.get(
    `/users/${process.env.GITHUB_USERNAME}/repos`
  );

  // ingat di axios hasil tarikan data nya ada di object response punya data
  const dataTarikan = response.data;

  // Balikin ke user
  res.status(200).json({
    statusCode: 200,
    data: dataTarikan,
  });
});

app.get("/github/pull-request", async (req, res) => {
  const response = await instance.get(
    `/repos/rmt-17-quimper-fox/p2-cms-integration-server/pulls`,
    {
      params: {
        direction: "asc",
      },
    }
  );

  const dataTarikan = response.data;
  const manipulasiData = dataTarikan.map((e) => {
    return {
      url: e.url,
      username: e.user.login,
    };
  });

  res.status(200).json({
    statusCode: 200,
    data: manipulasiData,
  });
});

app.listen(port, (_) => console.log(`Application is working at port ${port}`));
