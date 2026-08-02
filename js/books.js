async function loadBooks() {

    try {

        const response = await fetch(API_URL);

        const books = await response.json();

        const tableBody = document.getElementById("bookTableBody");

        tableBody.innerHTML = "";

        books.forEach(book => {

            tableBody.innerHTML += `
                <tr>
                    <td>${book.book_id}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>₹${book.price}</td>
                    <td>
                        ${book.available
                    ? '<span class="available">Available</span>'
                    : '<span class="rented">Rented</span>'
                }
                    </td>

                    <td>

                        <button
                            class="action-btn edit-btn"
                            onclick="editBook(${book.book_id})"
                            ${!book.available ? "disabled" : ""}>
                            Edit
                        </button>

                        <button
                            class="action-btn delete-btn"
                            onclick="deleteBook(${book.book_id})">
                            Delete
                        </button>

                        ${book.available
                    ? `<button
                                    class="action-btn rent-btn"
                                    onclick="rentBook(${book.book_id})">
                                    Rent
                            </button>`
                    : `<button
                                    class="action-btn return-btn"
                                    onclick="returnBook(${book.book_id})">
                                    Return
                            </button>`
                }

                    </td>

                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}

loadBooks();
function searchBooks() {

    const input = document.getElementById("searchInput").value.toLowerCase();

    const rows = document.querySelectorAll("#bookTableBody tr");

    rows.forEach(row => {

        const text = row.innerText.toLowerCase();

        if (text.includes(input)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

}
async function deleteBook(id) {

    if (!confirm("Are you sure you want to delete this book?")) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        alert(data.message);

        loadBooks();

    } catch (error) {

        console.error(error);

    }

}

async function rentBook(id) {

    try {

        const response = await fetch(`${API_URL}/${id}/rent`, {
            method: "PUT"
        });

        const data = await response.json();

        alert(data.message);

        loadBooks();

    } catch (error) {

        console.error(error);

    }

}

async function returnBook(id) {

    try {

        const response = await fetch(`${API_URL}/${id}/return`, {
            method: "PUT"
        });

        const data = await response.json();

        alert(data.message);

        loadBooks();

    } catch (error) {

        console.error(error);

    }

}