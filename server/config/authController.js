const db = require("../config/db");
const crypto = require("crypto");


// =========================================
// CREATE PASSWORD HASH
// =========================================

function hashPassword(password) {

    return crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
}



// =========================================
// CREATE DEMO USERS
// =========================================

async function initializeAuthTables() {

    return new Promise((resolve, reject) => {

        // Create users table
        db.query(
            `
            CREATE TABLE IF NOT EXISTS users (

                id INT AUTO_INCREMENT PRIMARY KEY,

                username VARCHAR(100) UNIQUE NOT NULL,

                password VARCHAR(255) NOT NULL,

                role ENUM('admin', 'user') NOT NULL

            )
            `,

            (err) => {

                if (err) {
                    return reject(err);
                }


                // Create rentals table
                db.query(
                    `
                    CREATE TABLE IF NOT EXISTS rentals (

                        id INT AUTO_INCREMENT PRIMARY KEY,

                        book_id INT NOT NULL,

                        user_id INT NOT NULL,

                        status ENUM('active', 'returned')
                        DEFAULT 'active',

                        borrowed_at TIMESTAMP
                        DEFAULT CURRENT_TIMESTAMP,

                        returned_at TIMESTAMP NULL

                    )
                    `,

                    (err) => {

                        if (err) {
                            return reject(err);
                        }


                        createDemoUsers(resolve, reject);

                    }
                );
            }
        );
    });
}



// =========================================
// CREATE DEMO USERS
// =========================================

function createDemoUsers(resolve, reject) {

    const demoUsers = [

        {
            username: "demo_admin",
            password: "demo_admin123",
            role: "admin"
        },

        {
            username: "demo_user",
            password: "demo_user123",
            role: "user"
        }

    ];


    let completed = 0;


    demoUsers.forEach(user => {

        const hashedPassword =
            hashPassword(user.password);


        db.query(
            `
            SELECT id
            FROM users
            WHERE username = ?
            `,

            [user.username],

            (err, result) => {

                if (err) {
                    return reject(err);
                }


                // User already exists
                if (result.length > 0) {

                    completed++;

                    if (completed === demoUsers.length) {
                        resolve();
                    }

                    return;
                }


                // Create user
                db.query(
                    `
                    INSERT INTO users
                    (
                        username,
                        password,
                        role
                    )
                    VALUES (?, ?, ?)
                    `,

                    [
                        user.username,
                        hashedPassword,
                        user.role
                    ],

                    (err) => {

                        if (err) {
                            return reject(err);
                        }


                        console.log(
                            `Demo ${user.role} created: ${user.username}`
                        );


                        completed++;


                        if (
                            completed ===
                            demoUsers.length
                        ) {

                            resolve();
                        }
                    }
                );
            }
        );
    });
}



// =========================================
// LOGIN
// =========================================

exports.login = (req, res) => {

    const {
        username,
        password,
        role
    } = req.body;


    if (
        !username ||
        !password ||
        !role
    ) {

        return res.status(400).json({

            message:
                "Username, password and role are required."

        });
    }


    const hashedPassword =
        hashPassword(password);


    db.query(
        `
        SELECT
            id,
            username,
            role

        FROM users

        WHERE username = ?
        AND password = ?
        AND role = ?

        LIMIT 1
        `,

        [
            username,
            hashedPassword,
            role
        ],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: err.message
                });
            }


            if (result.length === 0) {

                return res.status(401).json({

                    message:
                        "Invalid username, password or role."

                });
            }


            const user =
                result[0];



            // =========================================
            // CREATE JWT-STYLE TOKEN
            // =========================================

            const header = Buffer
                .from(
                    JSON.stringify({
                        alg: "HS256",
                        typ: "JWT"
                    })
                )
                .toString("base64url");


            const payload = Buffer
                .from(
                    JSON.stringify({
                        id: user.id,
                        username: user.username,
                        role: user.role,

                        // Token expires after 24 hours
                        exp:
                            Math.floor(
                                Date.now() / 1000
                            ) + (24 * 60 * 60)
                    })
                )
                .toString("base64url");


            const unsignedToken =
                `${header}.${payload}`;


            const signature =
                crypto
                    .createHmac(
                        "sha256",
                        process.env.JWT_SECRET
                    )
                    .update(unsignedToken)
                    .digest("base64url");


            const token =
                `${unsignedToken}.${signature}`;


            res.json({

                message:
                    "Login successful",

                token: token,

                user: {

                    id: user.id,

                    username:
                        user.username,

                    role:
                        user.role
                }
            });
        }
    );
};



// =========================================
// EXPORT INITIALIZER
// =========================================

exports.initializeAuthTables =
    initializeAuthTables;