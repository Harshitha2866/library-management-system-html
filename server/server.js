require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();


// MIDDLEWARE

app.use(cors());

app.use(express.json());


// AUTH ROUTES

const authRoutes =
    require("./routes/authRoutes");

app.use(
    "/api/auth",
    authRoutes
);


// BOOK ROUTES

const bookRoutes =
    require("./routes/bookRoutes");

app.use(
    "/api/books",
    bookRoutes
);


// INITIALIZE AUTH DATABASE

const {
    initializeAuthTables
} = require("./controllers/authController");


// START SERVER

const PORT =
    process.env.PORT || 5000;


async function startServer() {

    try {

        // Create users and rentals tables
        // and create demo accounts if needed

        await initializeAuthTables();


        app.listen(
            PORT,
            () => {

                console.log(
                    `Server running on http://localhost:${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "Failed to initialize server:",
            error
        );

        process.exit(1);
    }
}


startServer();