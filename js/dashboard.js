async function loadDashboard() {

    try {

        const response = await fetch(API_URL);
        const books = await response.json();

        document.getElementById("totalBooks").textContent = books.length;

        const available = books.filter(book => book.available).length;

        document.getElementById("availableBooks").textContent = available;

        document.getElementById("rentedBooks").textContent =
            books.length - available;

    } catch (error) {

        console.error(error);

    }

}

loadDashboard();