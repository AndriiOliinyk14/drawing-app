import express from "express";
import path from "path";

const app = express();

app.route("/*").get((req, res) => {
  res.set("Cache-Control", "max-age=31536000, immutable");
  res.sendFile(path.resolve(__dirname, `dist/${req.path}`));
});

app.route("/").get((req, res) => {
  res.set("Cache-Control", "max-age=31536000, immutable");
  res.sendFile(path.resolve(__dirname, "dist/index.html"));
});

app.listen(5000, () => {
  console.log("Server started on 5000");
});
