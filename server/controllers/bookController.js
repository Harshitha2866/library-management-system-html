const db = require("../config/db");

// GET ALL BOOKS
exports.getAllBooks = (req, res) => {
    db.query("SELECT * FROM books", (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(result);
    });
};

// GET BOOK BY ID
exports.getBookById = (req, res) => {
    const { id } = req.params;

    db.query(
        "SELECT * FROM books WHERE book_id = ?",
        [id],
        (err, result) => {
            if (err) return res.status(500).json({ message: err.message });

            if (result.length === 0) {
                return res.status(404).json({ message: "Book not found" });
            }

            res.json(result[0]);
        }
    );
};

// ADD BOOK
exports.addBook = (req, res) => {

    const { book_id, title, author, price } = req.body;

    db.query(
        "INSERT INTO books(book_id,title,author,price,available) VALUES(?,?,?,?,1)",
        [book_id, title, author, price],
        (err) => {

            if (err)
                return res.status(500).json({ message: err.message });

            res.json({ message: "Book added successfully" });

        }
    );
};

// UPDATE BOOK
exports.updateBook = (req, res) => {

    const { id } = req.params;
    const { title, author, price } = req.body;

    db.query(
        "UPDATE books SET title=?, author=?, price=? WHERE book_id=?",
        [title, author, price, id],
        (err) => {

            if (err)
                return res.status(500).json({ message: err.message });

            res.json({ message: "Book updated successfully" });

        }
    );
};

// DELETE BOOK
exports.deleteBook = (req, res) => {

    const { id } = req.params;

    // Check whether the book is rented
    db.query(
        "SELECT available FROM books WHERE book_id=?",
        [id],
        (err, result) => {

            if (err)
                return res.status(500).json({ message: err.message });

            if (result.length === 0)
                return res.status(404).json({ message: "Book not found" });

            if (result[0].available == 0)
                return res.status(400).json({
                    message: "Return the book before deleting."
                });

            // Delete the book
            db.query(
                "DELETE FROM books WHERE book_id=?",
                [id],
                (err) => {

                    if (err)
                        return res.status(500).json({ message: err.message });

                    res.json({ message: "Book deleted successfully" });

                }
            );

        }
    );

};

// RENT BOOK
exports.rentBook = (req, res) => {

    const { id } = req.params;

    db.query(
        "UPDATE books SET available=0 WHERE book_id=?",
        [id],
        (err) => {

            if (err)
                return res.status(500).json({ message: err.message });

            res.json({ message: "Book rented successfully" });

        }
    );
};

// RETURN BOOK
exports.returnBook = (req, res) => {

    const { id } = req.params;

    db.query(
        "UPDATE books SET available=1 WHERE book_id=?",
        [id],
        (err) => {

            if (err)
                return res.status(500).json({ message: err.message });

            res.json({ message: "Book returned successfully" });

        }
    );
};