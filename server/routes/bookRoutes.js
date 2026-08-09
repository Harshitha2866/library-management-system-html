const express = require("express");

const router = express.Router();


// =========================================
// BOOK CONTROLLER
// =========================================

const {
    getAllBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook
} = require("../controllers/bookController");


// =========================================
// AUTHENTICATION MIDDLEWARE
// =========================================

const {
    authenticateToken,
    requireRole
} = require("../middleware/authMiddleware");



// =========================================
// VIEW BOOKS
// =========================================

// Both USER and ADMIN can view books

router.get(
    "/",
    authenticateToken,
    getAllBooks
);


router.get(
    "/:id",
    authenticateToken,
    getBookById
);



// =========================================
// ADMIN OPERATIONS
// =========================================

// Only ADMIN can add a book

router.post(
    "/",
    authenticateToken,
    requireRole("admin"),
    addBook
);


// Only ADMIN can edit a book

router.put(
    "/:id",
    authenticateToken,
    requireRole("admin"),
    updateBook
);


// Only ADMIN can delete a book

router.delete(
    "/:id",
    authenticateToken,
    requireRole("admin"),
    deleteBook
);



// =========================================
// USER BORROW / RETURN
// =========================================

// Only USER can borrow a book

router.put(
    "/:id/borrow",
    authenticateToken,
    requireRole("user"),
    borrowBook
);


// Only USER can return a book

router.put(
    "/:id/return",
    authenticateToken,
    requireRole("user"),
    returnBook
);



// =========================================
// EXPORT
// =========================================

module.exports = router;