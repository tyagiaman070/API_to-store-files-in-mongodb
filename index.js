var express = require("express");
var mongoose = require("mongoose");
var fs = require("fs");
const FileProduct = require("./models/files");
const formidable = require("formidable");

//your MONGODB LINK
mongoose
  .connect("mongodb://localhost:27017/hello", { useNewUrlParser: true })
  .then(() => {
    console.log("DB CONNECTED");
  });
mongoose.Promise = global.Promise;
var app = express();
app.use(express.json());
gridfs.mongo = mongoose.mongo;
var connection = mongoose.connection;
connection.on("error", console.error.bind(console, "connection error:"));
connection.once("open", function () {
  var gfs = gridfs(connection.db);

  app.get("/", function (req, res) {
    res.send("BACKEND API WORK");
  });
  app.get("/write", (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
      if (err) {
        return res.status(400).json({
          //aagr koi yaha taak pocha ha matlab vo admin ha lakin usski image ma kuch dekat ha ya to vo bhoot badi ha ya fhir not uploadable
          error: "Not able save product due to the image problem",
        });
      }

      let fileSchema = new FileProduct(fields);
      fileSchema.fileextension = file.fileName.type;
      fileSchema.fileName = file.fileName.name;
      fileSchema.fileUser.data = fs.readFileSync(file.fileName.path);
      fileSchema.fileUser.contentType = file.fileName.type;
      console.log("FILE IS HERE", file.fileUser);

      if (file.fileName) {
      }
      console.log("FEILDS", file.fileName.type);
      console.log("FEILDS", file.fileName.name);

      //save to DB
      fileSchema.save((err, filesBack) => {
        if (err) {
          console.log("====================================");
          console.log(err);
          console.log("====================================");
          return res.status(400).json({
            error: "file is not saved in DB",
          });
        }
        console.log(filesBack);

        res.json(filesBack);
      });
    });
  });

  // Reading a file from MongoDB
  app.get("/read", function (req, res) {
    FileProduct.find().exec((err, filesBack) => {
      if (err) {
        return res.status(400).json({
          error: "No File found in DB",
        });
      }
      res.send(filesBack);
    });
  });

  // Delete a file from MongoDB
  app.get("/delete", function (req, res) {
    let fileId = req.body.ID;
    FileProduct.findOneAndDelete({ _id: fileId }).exec((err, deletedFiles) => {
      if (err || !deletedFiles) {
        return res.status(400).json({
          error: "not able to delete File",
        });
      }
      return res.json({
        message: "Deleting was success",
        deletedFiles,
      });
    });
  });

  let port = 8000;

  app.listen(port, () => console.log(`app is listening on port ${port} !`));
});
