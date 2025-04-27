const path = require("path");

async function getArticle(req, res) {
  const dataJSON =
    await require("../../../finituz.github.io/public/articles/data.json");
  const uuid = req.params.uuid;

  try {
    const index = dataJSON.findIndex((article) => article.uuid == uuid);
    const article = dataJSON[index];
    const filename = article.title.en
      .replace(/[ ,\.]/g, (match) => (match === " " ? "_" : ""))
      .toLowerCase();

    const articlePath = path.join(process.env.BASE_PATH, article.path);

    res.sendFile(`${filename}-br.md`, { root: articlePath }, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(err.status || 500).send("Error sending file");
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function getArticleMetadata(req, res) {
  const dataJSON =
    await require("../../../finituz.github.io/public/articles/data.json");

  const uuid = req.params.uuid;

  const index = dataJSON.findIndex((article) => article.uuid == uuid);
  const article = dataJSON[index];
  try {
    res.send(article);
  } catch (e) {
    res.send(e);
  }
}

module.exports = { getArticle, getArticleMetadata };
