const path = require("path");
const router = require("express").Router();

const fileUpload = require("express-fileupload");

const fs = require("fs/promises");
const translateText = require("../middleware/translate/translate.js");
const dataJSON = require("../../finituz.github.io/public/articles/data.json");

async function updateDataJSON(
  title,
  mdPath,
  thumbnailPath,
  thumbnailAlt,
  tags,
) {
  const titleEn = await translateText(title, "br", "en");
  const altEn = await translateText(thumbnailAlt, "br", "en");
  const tagsEn = String(await translateText(tags, "br", "en")).split(",");

  const dataObj = {
    title: { br: title, en: titleEn },
    path: mdPath.split("/public")[1],
    thumbnailPath: thumbnailPath.split("/public")[1],
    thumbnailAlt: { br: thumbnailAlt, en: altEn },
    createdAt: new Date().toLocaleDateString("UTC"),
    lastModified: new Date().toLocaleDateString("UTC"),
    tags: { br: tags, en: tagsEn },
  };

  dataJSON.push(dataObj);

  await fs.writeFile(
    path.join(process.env.BASE_PATH, "articles", "data.json"),
    JSON.stringify(dataJSON),
  );
}

router.use(fileUpload());
router.post("/upload", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-Width, Content-Type, Accept",
  );

  const md = req.files.md;
  const mdFilename = md.name.replace(" ", "_");
  const thumbnail = req.files.thumbnail;
  const thumbnailAlt = req.body.thumbnailAlt;
  const tags = req.body.tags.split(" ");

  console.log(req.body);
  if (!md || !thumbnail) {
    return res
      .status(401)
      .send("POST must include a markdown file (md) and a thumbnail (jpg).");
  }

  try {
    const mdPath = path.join(process.env.BASE_PATH, "articles", mdFilename);
    const thumbnailDir = path.join(
      process.env.BASE_PATH,
      "imgs",
      "articles",
      mdFilename,
    );
    const thumbnailPath = path.join(
      thumbnailDir,
      `thumbnail.${thumbnail.mimetype.split("/")[1]}`,
    );

    console.log("Upload path: ", mdPath);
    await fs.mkdir(mdPath, { recursive: true });
    await fs.mkdir(thumbnailDir, { recursive: true });

    // en translation
    await translateText(md.data, "pt", "en").then(async (mdEN) => {
      await fs.writeFile(
        path.join(mdPath, `${mdFilename}-en.md`),
        String(mdEN),
      );
    });

    // upload br file
    await fs.writeFile(path.join(mdPath, `${mdFilename}-br.md`), md.data);

    // save thumbnail
    await fs.writeFile(thumbnailPath, thumbnail.data);

    // update data.json
    updateDataJSON(md.name, mdPath, thumbnailPath, thumbnailAlt, tags);

    res.sendStatus(200);
  } catch (err) {
    console.error("Error processing file:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
