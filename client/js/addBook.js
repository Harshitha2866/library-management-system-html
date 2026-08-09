// =========================================
// CHECK ADMIN LOGIN
// =========================================

const user = requireLogin("admin");


// =========================================
// ADD BOOK FORM
// =========================================

if (user) {

    const form =
        document.getElementById("bookForm");


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // =====================================
            // GET FORM VALUES
            // =====================================

            const book = {

                book_id:
                    Number(
                        document.getElementById(
                            "bookId"
                        ).value
                    ),

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


            // =====================================
            // VALIDATE TOTAL COPIES
            // =====================================

            if (book.total_copies < 1) {

                alert(
                    "Total copies must be at least 1."
                );

                return;
            }


            // =====================================
            // SEND BOOK TO BACKEND
            // =====================================

            try {

                const response =
                    await fetchWithAuth(
                        API_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(book)
                        }
                    );


                // Get backend response
                const data =
                    await response.json();


                // =====================================
                // SUCCESS
                // =====================================

                if (response.ok) {

                    alert(
                        "Book added successfully!"
                    );


                    // Clear form
                    form.reset();


                    // Go to books page
                    window.location.href =
                        "books.html";

                } else {

                    // =================================
                    // ERROR
                    // =================================

                    alert(
                        data.message ||
                        "Unable to add book."
                    );
                }


            } catch (error) {

                console.error(
                    "Add Book Error:",
                    error
                );

                alert(
                    "Unable to connect to the server."
                );
            }

        }
    );
}