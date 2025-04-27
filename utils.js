const path = require("path");
const fs = require("fs/promises");
const translateText = require("./middleware/translate/translate.js");

async function addToDataJSON(
  uuid,
  title,
  mdPath,
  thumbnailPath,
  thumbnailAlt,
  tags,
) {
  try {
    const dataJSON =
      await require("../finituz.github.io/public/articles/data.json");
    const titleEn = await translateText(title, "pt", "en");
    const altEn = await translateText(thumbnailAlt, "pt", "en");
    const tagsEn = String(await translateText(tags, "pt", "en")).split(
      /[\s,]+/,
    );

    if (titleEn && altEn && tagsEn) {
      const dataObj = {
        uuid,
        title: { br: title, en: titleEn },
        path: mdPath.split("/public")[1],
        thumbnailPath: thumbnailPath.split("/public")[1],
        thumbnailAlt: { br: thumbnailAlt, en: altEn },
        createdAt: new Date().toLocaleDateString("UTC"),
        lastModified: new Date().toLocaleDateString("UTC"),
        tags: { br: tags.split(/[\s,]+/), en: tagsEn },
      };

      const isObjInDataJSON = dataJSON.findIndex(
        (article) => article.path == dataObj.path,
      );
      console.log(isObjInDataJSON);

      if (isObjInDataJSON == -1) {
        dataJSON.push(dataObj);

        await fs.writeFile(
          path.join(process.env.BASE_PATH, "articles", "data.json"),
          JSON.stringify(dataJSON),
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = { addToDataJSON };
