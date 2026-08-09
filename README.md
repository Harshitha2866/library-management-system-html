# Library Management System

A full-stack Library Management System that allows users to browse, borrow and return books while administrators can manage the complete library collection.

The application uses role-based authentication to ensure that users and administrators have access only to the features they are authorized to use.

## Features

### User

- Secure user login
- View all available books
- Search books by title or author
- View total and available copies
- Borrow available books
- Return borrowed books
- Track books borrowed by the logged-in user

### Admin

- Secure admin login
- View all books
- Add new books
- Edit existing books
- Delete books
- Manage total and available copies
- Prevent deletion of books with borrowed copies

### Authentication & Security

- JWT-based authentication
- Role-based access control
- Protected REST API endpoints
- Separate permissions for Admin and User
- Unauthorized requests return appropriate HTTP status codes
- Login session expires automatically
- Sensitive environment variables are excluded from Git

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js
- REST APIs

### Database

- MySQL

### Authentication

- JWT-style token authentication
- Role-based authorization
- Protected API routes

### Deployment

- Netlify — Frontend
- Render — Backend

## Project Structure

```text
library-management-system-html/
│
├── client/
│   ├── index.html
│   ├── admin.html
│   ├── user.html
│   ├── books.html
│   ├── add-book.html
│   ├── edit-book.html
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── navbar.css
│   │   ├── books.css
│   │   ├── dashboard.css
│   │   ├── form.css
│   │   ├── login.css
│   │   ├── footer.css
│   │   └── responsive.css
│   │
│   └── js/
│       ├── api.js
│       ├── auth.js
│       ├── login.js
│       ├── books.js
│       ├── addBook.js
│       └── editBook.js
│
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── authController.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── bookController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── bookRoutes.js
│   │
│   └── server.js
│
├── .gitignore
└── README.md