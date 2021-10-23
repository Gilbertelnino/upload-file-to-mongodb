import { getGridFSFiles, createGridFSReadStream } from "./gridfs";

// retrieve pdf file
function getPDFFile(req, res) {
  const id = req.params.id;
  const files = await getGridFSFiles(id);
  if (!files) {
    return res.status(404).send({ files: "file not found" });
  }
  const readStream = createGridFSReadStream(id);
  readStream.pipe(res);
}
