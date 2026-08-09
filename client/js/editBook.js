// =========================================
// CHECK ADMIN LOGIN
// =========================================

const adminUser = requireLogin("admin");


// =========================================
// GET BOOK ID FROM URL
// =========================================

const params =
    new URLSearchParams(window.location.search);

const bookId =
    params.get("id");



// =========================================
// EDIT BOOK BUTTON
// =========================================

function editBook(id) {

    window.location.href =
        `edit-book.html?id=${id}`;
}



// =========================================
// LOAD BOOK DETAILS
// =========================================

async function loadBook() {

    if (!adminUser || !bookId) {
        return;
    }


    try {

        const response =
            await fetchWithAuth(
                `${API_URL}/${bookId}`
            );


        const book =
            await response.json();


        if (!response.ok) {

            alert(
                book.message ||
                "Book not found."
            );

            window.location.href =
                "books.html";

            return;
        }


        // =====================================
        // PUT BOOK DETAILS INTO FORM
        // =====================================

        document.getElementById(
            "bookId"
        ).value =
            book.book_id;


        document.getElementById(
            "title"
        ).value =
            book.title;


        document.getElementById(
            "author"
        ).value =
            book.author;


        document.getElementById(
            "price"
        ).value =
            book.price;


        document.getElementById(
            "totalCopies"
        ).value =
            book.total_copies;


    } catch (error) {

        console.error(
            "Load Book Error:",
            error
        );

        alert(
            "Unable to load book details."
        );
    }
}



// =========================================
// UPDATE BOOK
// =========================================

const editBookForm =
    document.getElementById(
        "editBookForm"
    );


if (editBookForm) {

    editBookForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // =================================
            // GET UPDATED VALUES
            // =================================

            const updatedBook = {

                title:
                    document.getElementById(
                        "title"
                    ).value.trim(),

                author:
                    document.getElementById(
                        "author"
                    ).value.trim(),

                price:
                    Number(
                        document.getElementById(
                            "price"
                        ).value
                    ),

                total_copies:
                    Number(
                        document.getElementById(
                            "totalCopies"
                        ).value
                    )
            };


            // =================================
            // VALIDATE COPIES
            // =================================

            if (
                updatedBook.total_copies < 1
            ) {

                alert(
                    "Total copies must be at least 1."
                );

                return;
            }


            try {

                // =================================
                // SEND UPDATE TO BACKEND
                // =================================

                const response =
                    await fetchWithAuth(
                        `${API_URL}/${bookId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    updatedBook
                                )
                        }
                    );


                const data =
                    await response.json();


                // =================================
                // SUCCESS
                // =================================

                if (response.ok) {

                    alert(
                        "Book updated successfully!"
                    );

                    window.location.href =
                        "books.html";

                } else {

                    // =================================
                    // ERROR
                    // =================================

                    alert(
                        data.message ||
                        "Unable to update book."
                    );
                }


            } catch (error) {

                console.error(
                    "Update Book Error:",
                    error
                );

                alert(
                    "Unable to connect to the server."
                );
            }

        }
    );
}



// =========================================
// LOAD BOOK WHEN PAGE OPENS
// =========================================

loadBook();