
async function login(role) {
    const usernameInput = document.getElementById(`${role}Username`);
    const passwordInput = document.getElementById(`${role}Password`);
    const message = document.getElementById(`${role}Message`);

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    message.textContent = "";

    if (!username || !password) {
        message.textContent = "Please enter username and password.";
        return;
    }

    try {
        const response = await fetch(`${AUTH_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
                role: role
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message || "Login failed.";
            return;
        }

        localStorage.setItem("libraryToken", data.token);
        localStorage.setItem("libraryUser", JSON.stringify(data.user));

        if (role === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "user.html";
        }

    } catch (error) {
        console.error("Login Error:", error);
        message.textContent = "Unable to connect to the server.";
    }
}

function clearLoginFields(role) {
    const username = document.getElementById(`${role}Username`);
    const password = document.getElementById(`${role}Password`);
    const message = document.getElementById(`${role}Message`);

    if (username) username.value = "";
    if (password) password.value = "";
    if (message) message.textContent = "";
}

function clearAllLoginFields() {
    clearLoginFields("user");
    clearLoginFields("admin");
}

document.addEventListener("DOMContentLoaded", () => {
    const userUsername = document.getElementById("userUsername");
    const userPassword = document.getElementById("userPassword");
    const adminUsername = document.getElementById("adminUsername");
    const adminPassword = document.getElementById("adminPassword");

    [userUsername, adminUsername].forEach(input => {
        if (input) input.setAttribute("autocomplete", "off");
    });

    [userPassword, adminPassword].forEach(input => {
        if (input) input.setAttribute("autocomplete", "new-password");
    });

    clearAllLoginFields();

    document.addEventListener("click", event => {
        const tab = event.target.closest(".login-tab");

        if (!tab) return;

        const selectedRole =
            tab.textContent.toLowerCase().includes("admin")
                ? "admin"
                : "user";

        clearLoginFields(
            selectedRole === "admin" ? "user" : "admin"
        );
    });

    const userLoginForm = document.getElementById("userLoginForm");

    if (userLoginForm) {
        userLoginForm.addEventListener("submit", event => {
            event.preventDefault();
            login("user");
        });
    }

    const adminLoginForm = document.getElementById("adminLoginForm");

    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", event => {
            event.preventDefault();
            login("admin");
        });
    }
});
