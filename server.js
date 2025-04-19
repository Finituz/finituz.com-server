const express = require("express");

const router = require("./post/upload.js");
const app = express();
const port = process.env.PORT || 3001;
app.use("/", router);
app.get("/", (req, res) => {
  res.sendStatus(405);
});

app.listen(port, () => {
  console.log(`File manager listening on port ${port}`);
});
