# Lab 3 – REST API, Query Parameters, Validation and Debugging

## Project Details

- **Name:** D. Thanishka
- **Registration Number:** 252U1R5039
- **Section:** CSE (AI & DE)
- **Course:** Backend Development Fundamentals
- **Lab:** Lab 3 – REST API, Query Parameters, Validation and Debugging
- **Institution:** Aurora Deemed to be University

## Deployment URL

**Render URL:** https://thanishka-lab-3.onrender.com/books

## Project Description

This project implements RESTful API operations using Node.js, Express.js, and SQLite. It provides endpoints to create, retrieve, update, and delete book records.

It also supports searching, sorting, pagination, price filtering, input validation, and proper HTTP status codes.

The database contains 10 book records with details such as book ID, title, author, price, and number of pages.

## Technologies Used

- Node.js
- Express.js
- SQLite
- SQLite3
- JavaScript
- Postman
- Visual Studio Code
- Render

## Project Structure

```text
lab-03/
│
├── server.js
├── goodreads.db
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
│
└── screenshots/
    ├── delete.png
    ├── get-all-books.png
    ├── get-book-by-id.png
    ├── not-found-error.png
    ├── post-success.png
    ├── post-validation-error.png
    ├── price-fltering.png
    ├── put-update.png
    ├── sorting-ascending.png
    └── sorting-descending.png
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone [https://github.com/dontaraboinathanishka/Thanishka-BDF.git](https://github.com/dontaraboinathanishka/Thanishka-BDF.git)
```

### 2. Open the project folder

```bash
cd lab-03
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The server runs at:

```text
http://localhost:3000
```

## API Endpoints

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/books` | Retrieve all books |
| GET | `/books/:bookId` | Retrieve a specific book |
| POST | `/books` | Add a new book |
| PUT | `/books/:bookId` | Update a book |
| DELETE | `/books/:bookId` | Delete a book |

## Query Parameters

### 1. Search Books

```text
GET /books?search_q=The
```

Searches for books using a partial title match.

Expected matching books include:
- The Alchemist
- Think Like a Monk
- The Power of Now
- The 5 AM Club

### 2. Sorting

**Ascending order:**

```text
GET /books?order_by=price&order=ASC
```

Sorts books by price from lowest to highest.

**Descending order:**

```text
GET /books?order_by=price&order=DESC
```

Sorts books by price from highest to lowest.

### 3. Pagination

**First five books:**

```text
GET /books?limit=5&offset=0
```

Returns five records starting from the first record.

**Next five books:**

```text
GET /books?limit=5&offset=5
```

Returns the next five records.

### 4. Price Filtering

```text
GET /books?min_price=200&max_price=350
```

Retrieves books within the price range of ₹200 to ₹350.

Expected books:
- The Alchemist – ₹250
- Rich Dad Poor Dad – ₹300
- Wings of Fire – ₹200
- Ikigai – ₹350
- Zero to One – ₹320

### 5. Combined Query

```text
GET /books?search_q=The&min_price=200&max_price=500&order_by=price&order=ASC&limit=3&offset=0
```

Combines searching, price filtering, sorting, and pagination.

Expected matching books are sorted by price in ascending order, with a maximum of three records returned.

## Database Records

The database contains the following 10 books:

| ID | Title | Author | Price (₹) | Pages |
|---:|---|---|---:|---:|
| 1 | The Alchemist | Paulo Coelho | 250 | 208 |
| 2 | Atomic Habits | James Clear | 450 | 320 |
| 3 | Rich Dad Poor Dad | Robert Kiyosaki | 300 | 336 |
| 4 | Wings of Fire | A.P.J. Abdul Kalam | 200 | 180 |
| 5 | Ikigai | Hector Garcia | 350 | 194 |
| 6 | Think Like a Monk | Jay Shetty | 400 | 288 |
| 7 | Deep Work | Cal Newport | 500 | 304 |
| 8 | The Power of Now | Eckhart Tolle | 280 | 236 |
| 9 | Zero to One | Peter Thiel | 320 | 210 |
| 10 | The 5 AM Club | Robin Sharma | 380 | 336 |

## Request Body for POST and PUT

Select **Body → raw → JSON** in Postman.

### POST – Add a New Book

```json
{
  "title": "C++ Programming",
  "author": "Bjarne Stroustrup",
  "price": 600,
  "pages": 450
}
```

Expected status code: **201 Created**

### PUT – Update an Existing Book

```json
{
  "title": "The Great Gatsby (Special Edition)",
  "author": "F. Scott Fitzgerald",
  "price": 599,
  "pages": 192
}
```

Use:

```text
PUT /books/1
```

Expected status code: **200 OK**

## HTTP Status Codes

| Status Code | Description |
|---|---|
| 200 | Request successful |
| 201 | Book created successfully |
| 400 | Invalid input or query parameters |
| 404 | Book or route not found |
| 500 | Internal server error |

## Input Validation

The application validates:

- Book title must not be empty.
- Author name must not be empty.
- Price must be a valid non-negative number.
- Pages must be a positive integer.
- Book ID must be a valid positive integer.
- Sorting order must be ASC or DESC.
- Sorting column must be valid.
- Pagination values must be valid.
- Minimum price must not exceed maximum price.

## Postman Testing

All API endpoints are tested using Postman.

The tests include:

1. Retrieve all 10 books using GET.
2. Retrieve a specific book using its ID.
3. Search books using the title.
4. Sort books by price in ascending order.
5. Sort books by price in descending order.
6. Test pagination using limit and offset.
7. Filter books using minimum and maximum prices.
8. Combine multiple query parameters.
9. Add a new book using POST.
10. Test invalid input validation.
11. Update a book using PUT.
12. Delete a book using DELETE.
13. Test invalid IDs and missing records.

### Negative Testing Queries

**Invalid book ID:**

```text
GET /books/abc
```

Expected: **400 Bad Request**.

**Book not found:**

```text
GET /books/9999
```

Expected: **404 Not Found**.

**Invalid sorting column:**

```text
GET /books?order_by=wrong
```

Expected: **400 Bad Request**.

**Invalid sorting order:**

```text
GET /books?order=INVALID
```

Expected: **400 Bad Request**.

**Invalid pagination:**

```text
GET /books?limit=-5
```

Expected: **400 Bad Request**.

**Invalid price range:**

```text
GET /books?min_price=500&max_price=200
```

Expected: **400 Bad Request**.

## Screenshots

### 1. GET All Books

![GET All Books](screenshots/get-all-books.png)

### 2. GET Book by ID

![GET Book by ID](screenshots/get-book-by-id.png)

### 3. Sorting Ascending

![Sorting Ascending](screenshots/sorting-ascending.png)

### 4. Sorting Descending

![Sorting Descending](screenshots/sorting-descending.png)

### 5. Price Filtering

![Price Filtering](screenshots/price-flitering.png)

### 6. POST Validation Error

![POST Validation Error](screenshots/post-validation-error.png)

### 7. POST Successful Request

![POST Successful Request](screenshots/post-success.png)

### 8. PUT Update Request

![PUT Update Request](screenshots/put-update.png)

### 9. DELETE Request

![DELETE Request](screenshots/delete.png)

### 10. GET Book 404 Not Found

![404 Not Found](screenshots/not-found-error.png)

## Debugging & Troubleshooting

During the development and deployment of the REST API, several common errors were identified and resolved.

### 1. Port Already in Use (EADDRINUSE)

**Error:**
```text
Error: listen EADDRINUSE: address already in use :::3000
```

**Cause:**
Another application or previously running Node.js server is already using port 3000.

**Solution:**

Stop the previous server using `Ctrl + C` in its terminal.

Alternatively, find the process using port 3000 in Windows PowerShell:

```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

Restart the application:

```bash
npm run dev
```

### 2. Wrong Import Path

**Error:**
```text
Error: Cannot find module '../database'
```

**Cause:**
The required file path or filename is incorrect.

**Solution:**

Verify that the required file exists and correct the relative import path:

```javascript
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
```

### 3. SQLite Table Not Found

**Error:**
```text
SQLITE_ERROR: no such table: books
```

**Cause:**
The requested table does not exist in the connected SQLite database, or the application is connecting to a different database file.

**Solution:**

Verify database initialization and standardize table name in SQL queries:

```sql
CREATE TABLE IF NOT EXISTS book (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    price INTEGER,
    pages INTEGER
);
```

### 4. Missing Await in Asynchronous Operations

**Problem:**

Database operations return Promises. If `await` is missing, the response may contain a Promise instead of the actual database result.

**Incorrect Code:**

```javascript
const books = db.all("SELECT * FROM book");
res.json(books);
```

**Correct Code:**

```javascript
const books = await db.all("SELECT * FROM book");
res.json(books);
```

**Solution:**

Use `async/await` when handling asynchronous database operations and handle errors using `try/catch`.

### 5. Missing Module (MODULE_NOT_FOUND)

**Error:**
```text
Error: Cannot find module 'sqlite'
```

**Cause:**
The required npm package is not installed or cannot be found in `node_modules`.

**Solution:**

Install the missing dependency:

```bash
npm install sqlite sqlite3
```

Verify the installed packages:

```bash
npm ls sqlite sqlite3
```

### 6. Missing Dev Script in package.json

**Error:**
```text
npm error Missing script: "dev"
```

**Cause:**
The `dev` script is missing from `package.json`, or the terminal is running in the wrong project directory.

**Solution:**

Add the following scripts to `package.json`:

```json
"scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
}
```

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

### 7. Render Deployment Error (SQLite GLIBC Compatibility)

**Error:**
```text
GLIBC_2.38 not found
```

**Cause:**
The SQLite3 native binary was incompatible with the Linux runtime environment used by Render.

**Solution:**

Rebuild the SQLite3 native module in the Render build environment:

```bash
npm ci && npm rebuild sqlite3 --build-from-source
```

### 8. SQLite3 Native Binding Not Found

**Error:**
```text
Error: Could not locate the bindings file
```

**Cause:**
The SQLite3 native module was not successfully built or installed for the deployment environment.

**Solution:**

Rebuild the native module:

```bash
npm rebuild sqlite3 --build-from-source
```

Check the Render build logs to verify that the compilation completes successfully.

---

### Debugging Summary

| Error | Solution |
|---|---|
| EADDRINUSE | Stop the process using the port |
| Wrong import path | Correct the require path |
| No such table | Verify database and table creation |
| Missing await | Use async/await |
| MODULE_NOT_FOUND | Install the required package |
| Missing dev script | Add scripts to package.json |
| GLIBC compatibility | Rebuild SQLite3 for Render |
| Native binding not found | Rebuild SQLite3 native module |

**Result:** Common backend errors were identified, debugged, and resolved through proper dependency management, database configuration, asynchronous programming, and deployment troubleshooting.

## Conclusion

This lab helped me understand REST API development using Node.js, Express.js, and SQLite. I implemented CRUD operations and learned how to use query parameters for searching, sorting, pagination, and price filtering.

I also understood input validation, HTTP status codes, database integration, and debugging techniques. Postman helped me test the API endpoints and verify their responses. Finally, I deployed the REST API using Render.

---

**End of Lab 3**
