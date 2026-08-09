// =========================================
// LOGIN FUNCTION
// =========================================

async function login(role) {

    // Get the correct input fields
    const usernameInput =
        document.getElementById(`${role}Username`);

    const passwordInput =
        document.getElementById(`${role}Password`);

    const message =
        document.getElementById(`${role}Message`);


    // Get entered values
    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    // Clear previous message
    message.textContent = "";


    // Check empty fields
    if (!username || !password) {

        message.textContent =
            "Please enter username and password.";

        return;
    }


    try {

        // Send login request to backend
        const response = await fetch(
            `${AUTH_URL}/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    password: password,
                    role: role
                })
            }
        );


        // Get backend response
        const data =
            await response.json();


        // Login failed
        if (!response.ok) {

            message.textContent =
                data.message || "Login failed.";

            return;
        }


        // =========================================
        // LOGIN SUCCESSFUL
        // =========================================

        // Save authentication token
        localStorage.setItem(
            "libraryToken",
            data.token
        );


        // Save user information
        localStorage.setItem(
            "libraryUser",
            JSON.stringify(data.user)
        );


        // Redirect according to role

        if (role === "admin") {

            window.location.href =
                "admin.html";

        } else {

            window.location.href =
                "user.html";
        }


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        message.textContent =
            "Unable to connect to the server.";
    }
}



// =========================================
// USER LOGIN FORM
// =========================================

const userLoginForm =
    document.getElementById("userLoginForm");


if (userLoginForm) {

    userLoginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            login("user");
        }
    );
}



// =========================================
// ADMIN LOGIN FORM
// =========================================

const adminLoginForm =
    document.getElementById("adminLoginForm");


if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            login("admin");
        }
    );
}