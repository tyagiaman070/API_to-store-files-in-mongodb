const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema;

const fileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
    },
    fileextension: {
      type: String,
    },
    fileUser: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FileProduct", fileSchema);
