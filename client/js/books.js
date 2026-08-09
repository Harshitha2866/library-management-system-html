// CHECK LOGIN

const currentUser = requireLogin();

// Stop if nobody is logged in
if (!currentUser) {
    throw new Error("Login required");
}


// LOAD BOOKS

async function loadBooks() {

    try {

        const response =
            await fetchWithAuth(API_URL);

        // Get response data
        const books =
            await response.json();


        if (!response.ok) {

            alert(
                books.message ||
                "Unable to load books."
            );

            return;
        }

        // Get table body
        const tableBody =
            document.getElementById(
                "bookTableBody"
            );

        // Clear old rows
        tableBody.innerHTML = "";


        // DISPLAY EACH BOOK

        books.forEach(book => {

            // Calculate borrowed copies
            const borrowedCopies =
                Number(book.total_copies) -
                Number(book.available_copies);


            // ADMIN ACTIONS

            let adminActions = "";

            if (
                currentUser.role === "admin"
            ) {

                adminActions = `

                    <button
                        class="action-btn edit-btn"
                        onclick="editBook(${book.book_id})"
                    >
                        Edit
                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteBook(${book.book_id})"
                    >
                        Delete
                    </button>

                `;
            }


            // USER ACTION

            let userAction = "";


            if (
                currentUser.role === "user"
            ) {


                // USER BOOK ACTION

                if (Number(book.borrowed_by_me) === 1) {

                    // This user borrowed the book
                    userAction = `

                        <button
                            class="action-btn return-btn"
                            onclick="returnBook(${book.book_id})"
                        >
                            Return
                        </button>

                    `;

                }
                else if (
                    Number(book.available_copies) > 0
                ) {

                    // Book has available copies
                    userAction = `

                        <button
                            class="action-btn borrow-btn"
                            onclick="borrowBook(${book.book_id})"
                        >
                            Borrow
                        </button>

                    `;

                }
                else {

                    // No copies available
                    userAction = `

                        <span class="not-available">
                            Not Available
                        </span>

                    `;
                }

            }


            // CREATE TABLE ROW

            tableBody.innerHTML += `

                <tr>

                    <td>
                        ${book.book_id}
                    </td>


                    <td>
                        ${escapeHtml(book.title)}
                    </td>


                    <td>
                        ${escapeHtml(book.author)}
                    </td>


                    <td>
                        ₹${book.price}
                    </td>


                    <td>
                        ${book.total_copies}
                    </td>


                    <td>
                        ${book.available_copies}
                    </td>


                    <td>
                        ${borrowedCopies}
                    </td>


                    <td>

                        ${adminActions}

                        ${userAction}

                    </td>

                </tr>

            `;
        });


    } catch (error) {

        console.error(
            "Load Books Error:",
            error
        );

        alert(
            "Unable to load books."
        );
    }
}


// ESCAPE HTML

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


// SEARCH BOOKS

function searchBooks() {

    const input =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase();


    const rows =
        document.querySelectorAll(
            "#bookTableBody tr"
        );


    rows.forEach(row => {

        const rowText =
            row.innerText.toLowerCase();


        if (
            rowText.includes(input)
        ) {

            row.style.display = "";

        } else {

            row.style.display = "none";
        }

    });
}


// EDIT BOOK
// ADMIN ONLY

function editBook(id) {

    if (
        currentUser.role !== "admin"
    ) {

        alert(
            "Only admin can edit books."
        );

        return;
    }


    window.location.href =
        `edit-book.html?id=${id}`;
}


// DELETE BOOK
// ADMIN ONLY

async function deleteBook(id) {

    if (
        currentUser.role !== "admin"
    ) {

        alert(
            "Only admin can delete books."
        );

        return;
    }


    // Ask for confirmation
    const confirmDelete =
        confirm(
            "Are you sure you want to delete this book?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetchWithAuth(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        alert(
            data.message
        );


        if (response.ok) {

            loadBooks();
        }


    } catch (error) {

        console.error(
            "Delete Book Error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );
    }
}


// BORROW BOOK
// USER ONLY

async function borrowBook(id) {

    if (
        currentUser.role !== "user"
    ) {

        alert(
            "Only users can borrow books."
        );

        return;
    }


    try {

        const response =
            await fetchWithAuth(
                `${API_URL}/${id}/borrow`,
                {
                    method: "PUT"
                }
            );


        const data =
            await response.json();


        alert(
            data.message
        );


        if (response.ok) {

            loadBooks();
        }


    } catch (error) {

        console.error(
            "Borrow Book Error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );
    }
}


// RETURN BOOK
// USER ONLY

async function returnBook(id) {

    if (
        currentUser.role !== "user"
    ) {

        alert(
            "Only users can return books."
        );

        return;
    }


    try {

        const response =
            await fetchWithAuth(
                `${API_URL}/${id}/return`,
                {
                    method: "PUT"
                }
            );


        const data =
            await response.json();


        alert(
            data.message
        );


        if (response.ok) {

            loadBooks();
        }


    } catch (error) {

        console.error(
            "Return Book Error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );
    }
}


// LOAD BOOKS WHEN PAGE OPENS
loadBooks();