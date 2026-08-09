const express = require("express");

const router = express.Router();


// =========================================
// LOGIN ROUTE
// =========================================

// POST /api/auth/login

router.post(
    "/login",
    require("../controllers/authController").login
);


// =========================================
// EXPORT
// =========================================

module.exports = router;