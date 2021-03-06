# Third Party API & Express Error Handling
## Table of Content
1. [Third Party API](#third-party-api)
2. [Express Error Handling](#express-error-handling)
3. [References](#references)

Stats: Hanya Garis Besar Pembelajaran saja

### Third Party API
Pada saat bikin apps, kita tidak mungkin bikin / menyediakan semua data sendiri.

Pasti harus "narik" data dari tempat lain.

Ingat, pada saat membuat API, kita menyediakan "data" untuk digunakan oleh aplikasi.

Berarti kita juga bisa mengkonsumsi API dari tempat lain juga donk?

Itulah yang dinamakan Third Party API !

Pada pembelajaran ini kita akan menggunakan axios

Penarik data dari API (HTTP Client Library)

Cara instalasi
```shell
npm i axios
```

Misalnya pada pembelajaran kali ini kita menggunakan Third Party API dari repository kode terbesar sedunia: Github !

Step by Stepnya adalah sebagai berikut
```
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
```

Barulah setelah ini kita akan mulai mengkoding dengan express dan axios ini !

### Express Error Handling
Pada saat menuliskan kode pada routing express yang ada, seringkali ditemukan adanya kesamaan kode untuk handling error bukan?

Contohnya sebagai berikut:
```javascript
app.get('/endpoint-ke-satu', async (req, res) => {
  try {
    ...
  } catch(err) {
    if(err.name === "SESUATU") {
      res.status(400).json({ ... });
    } else if (err.name === "SESUATU_LAGI") {
      res.status(404).json({ ... });
    } else {
      res.status(500).json({ ... });
    }
  }
});

app.get('/endpoint-ke-dua', async (req, res) => {
  try {
    ...
  } catch(err) {
    if(err.name === "SESUATU") {
      res.status(400).json({ ... });
    } else if (err.name === "SESUATU_LAGI") {
      res.status(404).json({ ... });
    } else {
      res.status(500).json({ ... });
    }
  }
});
```

Berasa redundan bukan?

Bagaimana bila seandainya kita bisa membuat kode di atas menjadi lebih ringkas lagi?

Perkenalkan sebuah middleware yang disediakan oleh express yang bisa membantu kita untuk menangani error: "Express Error Handling"

Masih ingat pada kode middleware sebelumnya kita ada menggunakan `next` yang diinvoke bukan?

```javascript
async (req, res, next) => {
  ...
  next();
}
```

Nah ternyata, next ini kalau invoke tanpa parameter akan `bablas` ke routing selanjutnya bukan?

Bagaimana bila kita memberikan parameter pada `next` ini?

Ternyata di dalam express ini sendiri, sudah disiapkan untuk error handling !

sehingga kita tinggal mempassing error ke dalam next yang diinvoke ini, dan NANTINYA akan ditangkap oleh express error handling.

Contoh:

```javascript
app.get('/endpoint-ke-satu', async (req, res) => {
  try {
    ...
  } catch(err) {
    // passing error ke next middleware
    next(err);
  }
});

app.get('/endpoint-ke-dua', async (req, res) => {
  try {
    ...
  } catch(err) {
    // passing error ke next middleware
    next(err);
  }
});

// Lalu error akan ditangkap oleh SEBUAH middleware yang digunakan untuk 
// handle error

// Middleware adalah sebuah fungsi baru pada express.

// Pembedanya apa?
// Middleware untuk error handling, menerima EMPAT parameter
// err, req, res, dan next

app.use((err, req, res, next) => {
  // handle error di sini
  if(err.name === "SESUATU") {
    res.status(400).json({ ... });
  } else if (err.name === "SESUATU_LAGI") {
    res.status(404).json({ ... });
  } else {
    res.status(500).json({ ... });
  }
});
```

Jadi lebih singkat bukan kodenya?

### References
- [Third Party API](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Third_party_APIs)
- [Axios](https://github.com/axios/axios)
- [Express Error Handling](https://expressjs.com/en/guide/error-handling.html#writing-error-handlers)