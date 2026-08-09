const API_URL = "http://localhost:5000/api/books";

const AUTH_URL = "http://localhost:5000/api/auth";
    

// AUTHENTICATED API REQUEST

async function fetchWithAuth(url, options = {}) {

    // Get login token from browser storage
    const token = localStorage.getItem("libraryToken");

    // Copy existing headers
    const headers = {
        ...(options.headers || {})
    };


    // Add token if the user is logged in
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }


    // Send request to backend
    const response = await fetch(url, {
        ...options,
        headers: headers
    });


    // If login session has expired
    if (response.status === 401) {

        localStorage.removeItem("libraryToken");
        localStorage.removeItem("libraryUser");

        window.location.href = "index.html";
    }


    return response;
}