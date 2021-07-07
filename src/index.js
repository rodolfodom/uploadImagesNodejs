const express = require("express");
const path = require("path");
const multer = require("multer");
const { v4 } = require("uuid");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, v4() + path.extname(file.originalname).toLowerCase);
  },
  destination: path.join(__dirname, "public/uploads"),
});

// initializations
const app = express();

//settings
app.set("port", 4000);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//middlewares

app.use(
  multer({
    storage,
    dest: path.join(__dirname, "public/uploads"),
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png/;
      const mimetype = fileTypes.test(file.mimetype);
      const extname = fileTypes.test(path.extname(file.originalname));
      if (mimetype && extname) {
        return cb(null, true);
      }
      cb("ERROR: Tipo de archivo inválido");
    },
  }).single("image")
);

//routes

app.use(require("./routes/index.routes"));

//static files

app.use(express.static(path.join(__dirname, "public")));

// start server

app.listen(app.get("port"), () => {
  console.log(`server on port ${app.get("port")}`);
});
