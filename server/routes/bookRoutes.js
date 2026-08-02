const express = require("express");
const router = express.Router();

const {
    getAllBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    rentBook,
    returnBook
} = require("../controllers/bookController");

router.get("/", getAllBooks);

router.get("/:id", getBookById);

router.post("/", addBook);

router.put("/:id", updateBook);

router.delete("/:id", deleteBook);

router.put("/:id/rent", rentBook);

router.put("/:id/return", returnBook);

module.exports = router;