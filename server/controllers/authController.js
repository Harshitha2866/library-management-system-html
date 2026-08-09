const crypto = require("crypto");

const db = require("../config/db");


// =========================================
// SECRET KEY
// =========================================

const JWT_SECRET =
    process.env.JWT_SECRET ||
    "library-management-change-this-secret";


// =========================================
// DATABASE QUERY HELPER
// =========================================

function query(sql, params = []) {

    return new Promise(
        (resolve, reject) => {

            db.query(
                sql,
                params,
                (err, result) => {

                    if (err) {

                        reject(err);

                    } else {

                        resolve(result);
                    }
                }
            );
        }
    );
}



// =========================================
// PASSWORD HASHING
// =========================================

function hashPassword(password) {

    // Create random salt
    const salt =
        crypto
            .randomBytes(16)
            .toString("hex");


    // Create password hash
    const hash =
        crypto
            .scryptSync(
                password,
                salt,
                64
            )
            .toString("hex");


    // Store salt + hash
    return `${salt}:${hash}`;
}



// =========================================
// VERIFY PASSWORD
// =========================================

function verifyPassword(
    password,
    storedPassword
) {

    const parts =
        String(storedPassword).split(":");


    if (parts.length !== 2) {

        return false;
    }


    const [
        salt,
        storedHash
    ] = parts;


    try {

        const derivedHash =
            crypto
                .scryptSync(
                    password,
                    salt,
                    64
                )
                .toString("hex");


        return crypto.timingSafeEqual(

            Buffer.from(
                derivedHash,
                "hex"
            ),

            Buffer.from(
                storedHash,
                "hex"
            )

        );

    } catch (error) {

        return false;
    }
}



// =========================================
// BASE64 URL ENCODING
// =========================================

function base64UrlEncode(value) {

    return Buffer
        .from(value)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}



// =========================================
// CREATE LOGIN TOKEN
// =========================================

function createToken(user) {

    const header = {

        alg: "HS256",

        typ: "JWT"

    };


    const currentTime =
        Math.floor(
            Date.now() / 1000
        );


    const payload = {

        id: user.id,

        username: user.username,

        role: user.role,

        iat: currentTime,

        // Token expires after 8 hours
        exp: currentTime + (8 * 60 * 60)

    };


    const encodedHeader =
        base64UrlEncode(
            JSON.stringify(header)
        );


    const encodedPayload =
        base64UrlEncode(
            JSON.stringify(payload)
        );


    const data =
        `${encodedHeader}.${encodedPayload}`;


    const signature =
        crypto
            .createHmac(
                "sha256",
                JWT_SECRET
            )
            .update(data)
            .digest()
            .toString("base64")
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");


    return `${data}.${signature}`;
}



// =========================================
// CREATE REQUIRED TABLES
// =========================================

async function initializeAuthTables() {

    // ================================
    // USERS TABLE
    // ================================

    await query(`

        CREATE TABLE IF NOT EXISTS users (

            id INT PRIMARY KEY AUTO_INCREMENT,

            username VARCHAR(100)
                NOT NULL UNIQUE,

            password_hash VARCHAR(255)
                NOT NULL,

            role ENUM('user', 'admin')
                NOT NULL,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP

        )

    `);



    // ================================
    // BORROWING TABLE
    // ================================

    await query(`

        CREATE TABLE IF NOT EXISTS rentals (

            id INT PRIMARY KEY AUTO_INCREMENT,

            book_id INT NOT NULL,

            user_id INT NOT NULL,

            rented_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP,

            returned_at TIMESTAMP
                NULL,

            status ENUM(
                'active',
                'returned'
            )
            NOT NULL DEFAULT 'active',

            INDEX idx_rental_book_status
                (book_id, status),

            INDEX idx_rental_user_status
                (user_id, status)

        )

    `);



    // =========================================
    // DEMO ADMIN ACCOUNT
    // =========================================

    const adminUsername =
        process.env.ADMIN_USERNAME ||
        "demo_admin";


    const adminPassword =
        process.env.ADMIN_PASSWORD ||
        "demo_admin123";


    const existingAdmin =
        await query(

            `
            SELECT id
            FROM users
            WHERE username = ?
            LIMIT 1
            `,

            [adminUsername]

        );


    if (existingAdmin.length === 0) {

        await query(

            `
            INSERT INTO users
            (
                username,
                password_hash,
                role
            )
            VALUES (?, ?, 'admin')
            `,

            [
                adminUsername,
                hashPassword(adminPassword)
            ]

        );

        console.log(
            `Demo admin created: ${adminUsername}`
        );
    }



    // =========================================
    // DEMO USER ACCOUNT
    // =========================================

    const userUsername =
        process.env.USER_USERNAME ||
        "demo_user";


    const userPassword =
        process.env.USER_PASSWORD ||
        "demo_user123";


    const existingUser =
        await query(

            `
            SELECT id
            FROM users
            WHERE username = ?
            LIMIT 1
            `,

            [userUsername]

        );


    if (existingUser.length === 0) {

        await query(

            `
            INSERT INTO users
            (
                username,
                password_hash,
                role
            )
            VALUES (?, ?, 'user')
            `,

            [
                userUsername,
                hashPassword(userPassword)
            ]

        );

        console.log(
            `Demo user created: ${userUsername}`
        );
    }
}



// =========================================
// LOGIN
// =========================================

async function login(req, res) {

    try {

        const {
            username,
            password,
            role
        } = req.body;


        // =====================================
        // VALIDATE INPUT
        // =====================================

        if (
            !username ||
            !password ||
            !role
        ) {

            return res.status(400).json({

                message:
                    "Username, password and role are required"

            });
        }


        // =====================================
        // VALIDATE ROLE
        // =====================================

        if (
            role !== "admin" &&
            role !== "user"
        ) {

            return res.status(400).json({

                message:
                    "Invalid role"

            });
        }


        // =====================================
        // FIND USER
        // =====================================

        const users =
            await query(

                `
                SELECT
                    id,
                    username,
                    password_hash,
                    role

                FROM users

                WHERE username = ?
                AND role = ?

                LIMIT 1
                `,

                [
                    username,
                    role
                ]

            );


        // =====================================
        // CHECK USER + PASSWORD
        // =====================================

        if (
            users.length === 0 ||
            !verifyPassword(
                password,
                users[0].password_hash
            )
        ) {

            return res.status(401).json({

                message:
                    "Invalid username or password"

            });
        }


        // =====================================
        // USER INFORMATION
        // =====================================

        const user = {

            id: users[0].id,

            username:
                users[0].username,

            role:
                users[0].role

        };


        // =====================================
        // CREATE TOKEN
        // =====================================

        const token =
            createToken(user);


        // =====================================
        // SEND RESPONSE
        // =====================================

        res.json({

            message:
                "Login successful",

            token: token,

            user: user

        });


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );


        res.status(500).json({

            message:
                "Login failed"

        });
    }
}



// =========================================
// EXPORT
// =========================================

module.exports = {

    login,

    initializeAuthTables

};