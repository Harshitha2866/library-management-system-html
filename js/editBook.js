function editBook(id) {
    window.location.href = `edit-book.html?id=${id}`;
}
const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

// Load Book Details
async function loadBook() {

    if (!bookId) return;

    try {

        const response = await fetch(`${API_URL}/${bookId}`);
        const book = await response.json();

        document.getElementById("bookId").value = book.book_id;
        document.getElementById("title").value = book.title;
        document.getElementById("author").value = book.author;
        document.getElementById("price").value = book.price;

    } catch (error) {

        console.error(error);

    }

}

// Update Book
document.getElementById("editBookForm")?.addEventListener("submit", async (e) => {

    e.preventDefault();

    const updatedBook = {

        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        price: document.getElementById("price").value

    };

    try {

        const response = await fetch(`${API_URL}/${bookId}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(updatedBook)

        });

        const data = await response.json();

        alert(data.message);

        window.location.href = "books.html";

    } catch (error) {

        console.error(error);

    }

});

loadBook();