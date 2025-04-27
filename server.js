const express = require("express");

const uploadArticle = require("./methods/post/upload.js");
const deleteArticle = require("./methods/delete/delete.js");
const listArticles = require("./methods/get/list.js");
const { getArticle, getArticleMetadata } = require("./methods/get/article.js");

require("colors");

const app = express();
const fileUpload = require("express-fileupload");
const cors = require("cors");

const ARTICLES_PATH = "/articles";
const PORT = process.env.PORT || 3001;
const CORS_OPTIONS = {
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(fileUpload());
app.use(cors(CORS_OPTIONS));

app.post(ARTICLES_PATH, uploadArticle);
app.patch(ARTICLES_PATH.concat("/:uuid"), uploadArticle);
app.delete(ARTICLES_PATH.concat("/:uuid"), deleteArticle);
app.get(ARTICLES_PATH, listArticles);
app.get(ARTICLES_PATH.concat("/:uuid"), getArticle);
app.get(ARTICLES_PATH.concat("/metadata/:uuid"), getArticleMetadata);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`.blue);
});
