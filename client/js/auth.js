// GET CURRENT LOGGED-IN USER

function getCurrentUser() {

    try {

        const user =
            localStorage.getItem("libraryUser");

        return user ? JSON.parse(user) : null;

    } catch (error) {

        return null;
    }
}


// CHECK WHETHER USER IS LOGGED IN

function isLoggedIn() {

    const token =
        localStorage.getItem("libraryToken");

    const user =
        getCurrentUser();

    return Boolean(token && user);
}


// LOGOUT

function logout() {

    // Remove login information
    localStorage.removeItem("libraryToken");

    localStorage.removeItem("libraryUser");


    // Go back to login page
    window.location.href = "index.html";
}


// PROTECT A PAGE

function requireLogin(requiredRole = null) {

    const token =
        localStorage.getItem("libraryToken");

    const user =
        getCurrentUser();


    // No login information
    if (!token || !user) {

        window.location.href = "index.html";

        return null;
    }


    // If a specific role is required
    if (requiredRole && user.role !== requiredRole) {

        if (user.role === "admin") {

            window.location.href = "admin.html";

        } else {

            window.location.href = "user.html";
        }

        return null;
    }


    return user;
}


// REDIRECT ALREADY LOGGED-IN USER

function redirectLoggedInUser() {

    const token =
        localStorage.getItem("libraryToken");

    const user =
        getCurrentUser();


    if (!token || !user) {
        return;
    }


    // Send user to the correct dashboard

    if (user.role === "admin") {

        window.location.href = "admin.html";

    } else {

        window.location.href = "user.html";
    }
}