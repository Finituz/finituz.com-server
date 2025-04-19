app.get("/list-articles", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-Width, Content-Type, Accept",
  );
  res.setHeader("Content-Type", "application/json");

  await fs.readdir(basePath).then((dirs) => {
    // res.send(dirs);
    res.send(JSON.stringify(dirs));
    res.statusCode(200);
  });
});
