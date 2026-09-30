const RENTALS_URL =
    "https://library-management-system-api-srx4.onrender.com/api/books/rentals";

async function loadRentals() {
    const tableBody = document.getElementById("rentalsTableBody");

    try {
        const token = localStorage.getItem("libraryToken");

        const response = await fetch(RENTALS_URL, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load rentals");
        }

        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="10">No rental records found.</td>
                </tr>
            `;
            return;
        }

        data.forEach(rental => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${rental.student_name || "-"}</td>
                <td>${rental.student_reg_no || "-"}</td>
                <td>${rental.phone || "-"}</td>
                <td>${rental.email || "-"}</td>
                <td>${rental.branch || "-"}</td>
                <td>${rental.year || "-"}</td>
                <td>${rental.book_title || "-"}</td>
                <td>${formatDate(rental.rented_at)}</td>
                <td>${formatDate(rental.returned_at)}</td>
                <td class="${rental.status === "active" ? "status-active" : "status-returned"}">
                    ${rental.status}
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {

        console.error("Rental Error:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="10">
                    Failed to load rental records.
                </td>
            </tr>
        `;
    }
}

function formatDate(date) {

    if (!date) {
        return "-";
    }

    return new Date(date).toLocaleString();
}

loadRentals();