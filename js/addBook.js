const form = document.getElementById("bookForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const book = {
        book_id: Number(document.getElementById("bookId").value),
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        price: Number(document.getElementById("price").value)
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(book)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Book added successfully!");

            form.reset();

            window.location.href = "books.html";
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert("Server Error");
    }
});