# Library Management System

A full-stack Library Management System developed using HTML, CSS, JavaScript, Node.js, Express.js, and MySQL. The application enables users to manage library books through a web interface and a RESTful API. It supports complete CRUD operations, book renting and returning, and search functionality with persistent storage in a MySQL database.

---

## Project Overview

The Library Management System is designed to simplify book management in a library. It allows users to add, view, update, delete, rent, return, and search books while maintaining data consistency through a MySQL database.

### Technology Stack

| Category | Technology |
|----------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Version Control | Git, GitHub |
| Deployment | Render |

---

## Features

- View all books
- Add new books
- Edit existing book details
- Delete books
- Search books by title or author
- Rent books
- Return rented books
- Prevent deletion of rented books
- REST API integration
- MySQL database connectivity

---

## Project Structure

```
library-management-system-html
│
├── css/
│   ├── style.css
│   ├── books.css
│   ├── form.css
│   ├── navbar.css
│   └── footer.css
│
├── js/
│   ├── api.js
│   ├── books.js
│   ├── addBook.js
│   └── editBook.js
│
├── images/
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── bookController.js
│   ├── routes/
│   │   └── bookRoutes.js
│   ├── package.json
│   ├── server.js
│   └── .env
│
├── index.html
├── books.html
├── add-book.html
├── edit-book.html
├── library.sql
└── README.md
```

---

## Database Schema

### Table: books

| Column | Type | Description |
|---------|------|-------------|
| book_id | INT | Primary Key |
| title | VARCHAR(255) | Book Title |
| author | VARCHAR(255) | Author Name |
| price | DECIMAL(10,2) | Book Price |
| available | BOOLEAN | Book Availability |

The database includes sample data with more than 30 books.

---

## REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/books | Retrieve all books |
| GET | /api/books/:id | Retrieve a book by ID |
| POST | /api/books | Add a new book |
| PUT | /api/books/:id | Update a book |
| DELETE | /api/books/:id | Delete a book |
| PUT | /api/books/:id/rent | Rent a book |
| PUT | /api/books/:id/return | Return a book |

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/Harshitha2866/library-management-system-html.git
```

### Navigate to the Project

```bash
cd library-management-system-html
```

### Install Backend Dependencies

```bash
cd server
npm install
```

### Configure Environment Variables

Create a `.env` file inside the `server` folder.

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=librarydb
PORT=5000
```

### Import the Database

Import the `library.sql` file into MySQL.

### Start the Backend Server

```bash
node server.js
```

The server runs on:

```
http://localhost:5000
```

### Launch the Frontend

Open `index.html` using Live Server in Visual Studio Code or any local web server.

---

## Deployment

Backend API:

```
https://library-management-system-api-srx4.onrender.com/api/books
```

---

## Screenshots

Create a folder named `screenshots` and add screenshots of the application.

```
screenshots/
│
├── home-page.png
├── books-page.png
├── add-book-page.png
├── edit-book-page.png
```

Example:

```markdown
## Home Page

![Home Page](screenshots/home-page.png)

## Books Page

![Books Page](screenshots/books-page.png)

## Add Book

![Add Book](screenshots/add-book-page.png)

## Edit Book

![Edit Book](screenshots/edit-book-page.png)
```

---

## Future Enhancements

- User Authentication
- Role-Based Access Control
- Book Categories
- Borrowing History
- Fine Management
- Dashboard with Statistics
- Book Cover Images
- Responsive Design
- Pagination

---

## Author

**Harshitha Minnikanti**

B.Tech – Artificial Intelligence and Data Science  
Shri Vishnu Engineering College for Women

GitHub: https://github.com/Harshitha2866

LinkedIn: (https://www.linkedin.com/in/harshitha-minnikanti-24a682354/)

---

## License

This project was developed for educational purposes as part of a Full Stack Development mini project.