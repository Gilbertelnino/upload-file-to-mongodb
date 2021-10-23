import mongoose from "mongoose";
import dotenv from "dotenv";
import Grid from "gridfs-stream";
Grid.mongo = mongoose.mongo;

dotenv.config();

// Connect to database to upload file using  gfs. this might not be best practice but this is what in my mnd quickly
const connect = mongoose.createConnection(process.env.MONGO_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let gfs, gridFSBucket;

connect.once("open", () => {
  gridFSBucket = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "PDFDocuments",
  });
  // Init stream
  gfs = Grid(connect.db);
  gfs.collection("PDFDocuments");
});

export const getGridFSFiles = (id) => {
  return new Promise((resolve, reject) => {
    gfs.files.findOne({ _id: mongoose.Types.ObjectId(id) }, (err, files) => {
      if (err) reject(err);
      // Check if files
      if (!files || files.length === 0) {
        resolve(null);
      } else {
        resolve(files);
      }
    });
  });
};

export const createGridFSReadStream = (id) => {
  return gridFSBucket.openDownloadStream(mongoose.Types.ObjectId(id));
};
