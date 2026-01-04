const express = require("express");
const postRoutes = require("./routes/posts");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("Blog REST API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
