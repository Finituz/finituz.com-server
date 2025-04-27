const path = require("path");
const fs = require("fs/promises");
const translateText = require("../../middleware/translate/translate.js");
const { addToDataJSON } = require("../../utils.js");

async function uploadArticle(req, res) {
  const md = req.files.md;
  const uuid = req.params.uuid ?? crypto.randomUUID();

  const mdFilename = await translateText(md.name, "pt", "en").then(
    (translate) =>
      translate
        .replace(/[ ,\.]/g, (match) => (match === " " ? "_" : ""))
        .toLowerCase(),
  );

  const thumbnail = req.files.thumbnail;
  const thumbnailAlt = req.body.thumbnailAlt;
  const tags = req.body.tags;

  if (!md || !thumbnail) {
    return res
      .status(401)
      .send("POST must include a markdown file (md) and a thumbnail (jpg).");
  }

  try {
    const mdPath = path.join(process.env.BASE_PATH, "articles", uuid);
    const thumbnailDir = path.join(
      process.env.BASE_PATH,
      "imgs",
      "articles",
      uuid,
    );

    const thumbnailPath = path.join(
      thumbnailDir,
      `thumbnail.${thumbnail.mimetype.split("/")[1]}`,
    );

    console.log("Upload path: ", mdPath);
    await fs.mkdir(mdPath, { recursive: true });
    await fs.mkdir(thumbnailDir, { recursive: true });

    // en translation
    await translateText(String(md.data), "pt", "en").then(async (mdEN) => {
      await fs.writeFile(
        path.join(mdPath, `${mdFilename}-en.md`),
        String(mdEN),
      );
    });

    // upload br file
    await fs.writeFile(path.join(mdPath, `${mdFilename}-br.md`), md.data);

    // save thumbnail
    await fs.writeFile(thumbnailPath, thumbnail.data);

    // add article to data.json map
    addToDataJSON(uuid, md.name, mdPath, thumbnailPath, thumbnailAlt, tags);

    res.sendStatus(200);
  } catch (err) {
    console.error("Error processing file:", err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = uploadArticle;
