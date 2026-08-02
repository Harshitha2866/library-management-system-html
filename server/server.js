require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const bookRoutes = require("./routes/bookRoutes");
app.get("/test", (req, res) => {
    res.json({ message: "Test route works" });
});

console.log("Book routes loaded");

app.use("/api/books", bookRoutes);

console.log("Routes registered");

app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});