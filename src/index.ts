import express from "express";

const port = process.env.PORT ?? "3333";

const app = express();

app.get("/", function (req, res) {
  res.send({ hello: "world" });
});

app.listen(port, () => {
  console.log(`Server listening at: ${port}`);
});
