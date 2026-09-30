const RENTALS_URL =
    "https://library-management-system-api-srx4.onrender.com/api/books/rentals";

let allRentals = [];

async function loadRentals() {

    const tableBody =
        document.getElementById("rentalsTableBody");

    try {

        const token =
            localStorage.getItem("libraryToken");

        const response = await fetch(RENTALS_URL, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load rentals"
            );
        }

        allRentals = data;

        displayRentals(allRentals);

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


function displayRentals(rentals) {

    const tableBody =
        document.getElementById("rentalsTableBody");

    tableBody.innerHTML = "";

    if (rentals.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="10">
                    No rental records found.
                </td>
            </tr>
        `;

        return;
    }


    rentals.forEach(rental => {

        const row =
            document.createElement("tr");

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

            <td class="${
                rental.status === "active"
                    ? "status-active"
                    : "status-returned"
            }">
                ${rental.status}
            </td>
        `;

        tableBody.appendChild(row);

    });
}


function formatDate(date) {

    if (!date) {
        return "-";
    }

    return new Date(date).toLocaleString();
}


// SEARCH + STATUS FILTER

function filterRentals() {

    const searchText =
        document
            .getElementById("rentalSearch")
            .value
            .toLowerCase()
            .trim();

    const status =
        document
            .getElementById("statusFilter")
            .value;


    const filteredRentals =
        allRentals.filter(rental => {

            const matchesSearch =
                !searchText ||

                (rental.student_name || "")
                    .toLowerCase()
                    .includes(searchText) ||

                (rental.student_reg_no || "")
                    .toLowerCase()
                    .includes(searchText) ||

                (rental.book_title || "")
                    .toLowerCase()
                    .includes(searchText);


            const matchesStatus =
                status === "all" ||
                rental.status === status;


            return matchesSearch && matchesStatus;

        });


    displayRentals(filteredRentals);
}


// Search while typing

document
    .getElementById("rentalSearch")
    .addEventListener(
        "input",
        filterRentals
    );


// Filter when status changes

document
    .getElementById("statusFilter")
    .addEventListener(
        "change",
        filterRentals
    );


// Load rental records

loadRentals();