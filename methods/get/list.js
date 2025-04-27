async function listArticles(req, res) {
  const dataJSON =
    await require("../../../finituz.github.io/public/articles/data.json");

  if (dataJSON) {
    res.status(200).send(JSON.stringify(dataJSON));
  }
}

module.exports = listArticles;
