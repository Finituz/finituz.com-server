const path = require("path");
const fs = require("fs/promises");

async function deleteArticle(req, res) {
  const dataJSON =
    await require("../../../finituz.github.io/public/articles/data.json");

  const uuid = req.params.uuid;

  try {
    const articleIndex = dataJSON.findIndex((article) => article.uuid === uuid);

    const article = dataJSON[articleIndex];

    if (articleIndex == -1 || article == undefined) {
      res.status(404).send("Can't find article.");
      throw new TypeError("Can't find article.");
    }

    await fs
      .rm(path.join(process.env.BASE_PATH, article.path), { recursive: true })
      .then(async () => {
        await fs.rm(path.join(process.env.BASE_PATH, "imgs", article.path), {
          recursive: true,
        });

        dataJSON.splice(articleIndex, 1);

        await fs.writeFile(
          path.join(process.env.BASE_PATH, "articles", "data.json"),
          JSON.stringify(dataJSON),
        );

        res
          .status(200)
          .send({ statusCode: 200, body: `${uuid} successfully deleted!` });
      });
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = deleteArticle;
