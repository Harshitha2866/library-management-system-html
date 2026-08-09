const db = require("../config/db");

// GET ALL BOOKS

exports.getAllBooks = (req, res) => {

    const userId = req.user.id;

    db.query(
        `
        SELECT
            b.*,

            CASE
                WHEN r.id IS NOT NULL
                THEN 1
                ELSE 0
            END AS borrowed_by_me

        FROM books b

        LEFT JOIN rentals r
            ON b.book_id = r.book_id
            AND r.user_id = ?
            AND r.status = 'active'

        ORDER BY b.book_id
        `,

        [userId],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(result);
        }
    );
};


// GET BOOK BY ID

exports.getBookById = (req, res) => {

    const { id } = req.params;

    db.query(
        "SELECT * FROM books WHERE book_id = ?",
        [id],

        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (result.length === 0) {

                return res.status(404).json({
                    message: "Book not found"
                });
            }

            res.json(result[0]);
        }
    );
};


// ADD BOOK
// ADMIN ONLY

exports.addBook = (req, res) => {

    const {
        book_id,
        title,
        author,
        price,
        total_copies
    } = req.body;


    // Check copies
    if (!total_copies || total_copies < 1) {

        return res.status(400).json({
            message: "Total copies must be at least 1."
        });
    }


    db.query(
        `INSERT INTO books
        (
            book_id,
            title,
            author,
            price,
            available,
            total_copies,
            available_copies
        )
        VALUES (?, ?, ?, ?, 1, ?, ?)`,

        [
            book_id,
            title,
            author,
            price,
            total_copies,
            total_copies
        ],

        (err) => {

            if (err) {

                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Book added successfully"
            });
        }
    );
};


// UPDATE BOOK
// ADMIN ONLY

exports.updateBook = (req, res) => {

    const { id } = req.params;

    const {
        title,
        author,
        price,
        total_copies
    } = req.body;


    if (!total_copies || total_copies < 1) {

        return res.status(400).json({
            message: "Total copies must be at least 1."
        });
    }


    // First get the current book
    db.query(
        `SELECT total_copies, available_copies
         FROM books
         WHERE book_id = ?`,

        [id],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: err.message
                });
            }


            if (result.length === 0) {

                return res.status(404).json({
                    message: "Book not found"
                });
            }


            const currentTotal =
                result[0].total_copies;

            const currentAvailable =
                result[0].available_copies;


            // Copies currently borrowed
            const borrowedCopies =
                currentTotal - currentAvailable;


            // New total cannot be less
            // than currently borrowed copies
            if (total_copies < borrowedCopies) {

                return res.status(400).json({

                    message:
                        `Total copies cannot be less than ${borrowedCopies}, because ${borrowedCopies} copy/copies are currently borrowed.`

                });
            }


            // Calculate new available copies
            const newAvailableCopies =
                total_copies - borrowedCopies;


            db.query(
                `UPDATE books
                 SET title = ?,
                     author = ?,
                     price = ?,
                     total_copies = ?,
                     available_copies = ?,
                     available = ?
                 WHERE book_id = ?`,

                [
                    title,
                    author,
                    price,
                    total_copies,
                    newAvailableCopies,
                    newAvailableCopies > 0 ? 1 : 0,
                    id
                ],

                (err) => {

                    if (err) {

                        return res.status(500).json({
                            message: err.message
                        });
                    }


                    res.json({
                        message:
                            "Book updated successfully"
                    });
                }
            );
        }
    );
};


// DELETE BOOK
// ADMIN ONLY

exports.deleteBook = (req, res) => {

    const { id } = req.params;


    db.query(
        `SELECT available_copies
         FROM books
         WHERE book_id = ?`,

        [id],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: err.message
                });
            }


            if (result.length === 0) {

                return res.status(404).json({
                    message: "Book not found"
                });
            }


            // Don't delete if ANY copy is borrowed
            if (result[0].available_copies < 1) {

                return res.status(400).json({

                    message:
                        "Return all borrowed copies before deleting the book."

                });
            }


            db.query(
                "DELETE FROM books WHERE book_id = ?",
                [id],

                (err) => {

                    if (err) {

                        return res.status(500).json({
                            message: err.message
                        });
                    }


                    res.json({
                        message:
                            "Book deleted successfully"
                    });
                }
            );
        }
    );
};


// BORROW BOOK
// USER ONLY

exports.borrowBook = (req, res) => {

    const { id } = req.params;

    const userId = req.user.id;


    // Check available copies
    db.query(
        `SELECT available_copies
         FROM books
         WHERE book_id = ?`,

        [id],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: err.message
                });
            }


            if (result.length === 0) {

                return res.status(404).json({
                    message: "Book not found"
                });
            }


            // No copies available
            if (result[0].available_copies <= 0) {

                return res.status(400).json({

                    message:
                        "No copies of this book are currently available."

                });
            }


            // Decrease available copies by 1
            db.query(
                `UPDATE books
                 SET available_copies = available_copies - 1,
                     available = CASE
                         WHEN available_copies - 1 > 0
                         THEN 1
                         ELSE 0
                     END
                 WHERE book_id = ?
                 AND available_copies > 0`,

                [id],

                (err, updateResult) => {

                    if (err) {

                        return res.status(500).json({
                            message: err.message
                        });
                    }


                    if (updateResult.affectedRows === 0) {

                        return res.status(400).json({

                            message:
                                "No copies of this book are available."

                        });
                    }


                    // Record the borrowing
                    db.query(
                        `INSERT INTO rentals
                        (
                            book_id,
                            user_id,
                            status
                        )
                        VALUES (?, ?, 'active')`,

                        [
                            id,
                            userId
                        ],

                        (err) => {

                            if (err) {

                                // Restore the copy
                                db.query(
                                    `UPDATE books
                                     SET available_copies =
                                         available_copies + 1,
                                         available = 1
                                     WHERE book_id = ?`,

                                    [id]
                                );


                                return res.status(500).json({
                                    message: err.message
                                });
                            }


                            res.json({

                                message:
                                    "Book borrowed successfully"

                            });
                        }
                    );
                }
            );
        }
    );
};


// RETURN BOOK
// USER ONLY

exports.returnBook = (req, res) => {

    const { id } = req.params;

    const userId = req.user.id;


    // Check whether this user
    // borrowed this book
    db.query(
        `SELECT id
         FROM rentals
         WHERE book_id = ?
         AND user_id = ?
         AND status = 'active'
         LIMIT 1`,

        [
            id,
            userId
        ],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: err.message
                });
            }


            if (result.length === 0) {

                return res.status(403).json({

                    message:
                        "You can return only a book borrowed by you."

                });
            }


            const rentalId =
                result[0].id;


            // Mark borrowing as returned
            db.query(
                `UPDATE rentals
                 SET status = 'returned',
                     returned_at = NOW()
                 WHERE id = ?`,

                [rentalId],

                (err) => {

                    if (err) {

                        return res.status(500).json({
                            message: err.message
                        });
                    }


                    // Increase available copies
                    db.query(
                        `UPDATE books
                         SET available_copies =
                             available_copies + 1,
                             available = 1
                         WHERE book_id = ?`,

                        [id],

                        (err) => {

                            if (err) {

                                return res.status(500).json({
                                    message: err.message
                                });
                            }


                            res.json({

                                message:
                                    "Book returned successfully"

                            });
                        }
                    );
                }
            );
        }
    );
};