const crypto = require("crypto");

// SECRET KEY

const JWT_SECRET =
    process.env.JWT_SECRET ||
    "library-management-change-this-secret";


// BASE64 URL FUNCTIONS

function base64UrlDecode(value) {

    let padded =
        value
            .replace(/-/g, "+")
            .replace(/_/g, "/");


    while (padded.length % 4) {

        padded += "=";
    }


    return Buffer
        .from(padded, "base64")
        .toString("utf8");
}


// VERIFY TOKEN

function verifyToken(token) {

    const parts =
        String(token).split(".");


    // Token should have 3 parts
    if (parts.length !== 3) {

        throw new Error("Invalid token");
    }


    const [
        encodedHeader,
        encodedPayload,
        encodedSignature
    ] = parts;


    // Create expected signature
    const expectedSignature =
        crypto
            .createHmac(
                "sha256",
                JWT_SECRET
            )
            .update(
                `${encodedHeader}.${encodedPayload}`
            )
            .digest()
            .toString("base64")
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");


    // Compare signatures
    const signatureA =
        Buffer.from(encodedSignature);

    const signatureB =
        Buffer.from(expectedSignature);


    if (
        signatureA.length !== signatureB.length ||
        !crypto.timingSafeEqual(
            signatureA,
            signatureB
        )
    ) {

        throw new Error("Invalid signature");
    }


    // Get user information
    const payload =
        JSON.parse(
            base64UrlDecode(encodedPayload)
        );


    // Check expiration
    if (
        !payload.exp ||
        Date.now() >= payload.exp * 1000
    ) {

        throw new Error("Token expired");
    }


    return payload;
}


// AUTHENTICATE USER

function authenticateToken(
    req,
    res,
    next
) {

    const authHeader =
        req.headers.authorization;


    // Expected format:
    // Authorization: Bearer TOKEN

    const token =
        authHeader &&
        authHeader.startsWith("Bearer ")
            ? authHeader.substring(7)
            : null;


    // No token
    if (!token) {

        return res.status(401).json({

            message:
                "Login required"

        });
    }


    try {

        // Verify token
        req.user =
            verifyToken(token);


        // Continue to requested route
        next();

    } catch (error) {

        return res.status(401).json({

            message:
                "Invalid or expired login session"

        });
    }
}


// ROLE CHECK

function requireRole(role) {

    return function (
        req,
        res,
        next
    ) {

        // Check logged-in user's role
        if (
            !req.user ||
            req.user.role !== role
        ) {

            return res.status(403).json({

                message:
                    `${role} access required`

            });
        }


        // Correct role
        next();
    };
}


// EXPORT

module.exports = {

    authenticateToken,

    requireRole

};