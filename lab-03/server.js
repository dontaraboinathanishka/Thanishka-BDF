const express = require('express');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname, 'goodreads.db');
let db = null;

// Initialize Database Connection and Start Express Server
const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        // Create 'book' table if it doesn't exist
        await db.exec(`
            CREATE TABLE IF NOT EXISTS book (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                price INTEGER NOT NULL,
                pages INTEGER NOT NULL
            );
        `);

        // Seed default dataset if empty
        const countResult = await db.get(`SELECT COUNT(*) AS count FROM book;`);
        if (countResult.count === 0) {
            await db.exec(`
                INSERT INTO book (title, author, price, pages) VALUES
                ('The Great Gatsby', 'F. Scott Fitzgerald', 499, 180),
                ('To Kill a Mockingbird', 'Harper Lee', 399, 281),
                ('1984', 'George Orwell', 299, 328),
                ('Pride and Prejudice', 'Jane Austen', 350, 279),
                ('The Catcher in the Rye', 'J.D. Salinger', 450, 234),
                ('The Hobbit', 'J.R.R. Tolkien', 599, 310),
                ('Fahrenheit 451', 'Ray Bradbury', 380, 256),
                ('Moby Dick', 'Herman Melville', 520, 635),
                ('War and Peace', 'Leo Tolstoy', 899, 1225),
                ('The Alchemist', 'Paulo Coelho', 299, 208);
            `);
            console.log('Seed data inserted successfully.');
        }

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}/`);
        });
    } catch (error) {
        console.error(`Database Error: ${error.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();

// GET / - Root welcome route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to Lab 03 REST API Server' });
});

// GET /books - Retrieve books with search, sort, price filter & pagination
app.get('/books', async (req, res) => {
    try {
        let {
            search_q = '',
            order_by = 'id',
            order = 'ASC',
            limit = 10,
            offset = 0,
            min_price,
            max_price
        } = req.query;

        // Whitelist order_by columns to prevent SQL injection in ORDER BY clause
        const validColumns = ['id', 'title', 'author', 'price', 'pages'];
        if (!validColumns.includes(order_by)) {
            order_by = 'id';
        }

        // Whitelist sort direction
        const sortDirection = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        // Convert limit & offset to integers
        const parsedLimit = parseInt(limit, 10) || 10;
        const parsedOffset = parseInt(offset, 10) || 0;

        let getBooksQuery = `
            SELECT * FROM book 
            WHERE title LIKE ?
        `;
        const queryParams = [`%${search_q}%`];

        // Price filtering
        if (min_price !== undefined && max_price !== undefined) {
            getBooksQuery += ` AND price BETWEEN ? AND ?`;
            queryParams.push(Number(min_price), Number(max_price));
        } else if (min_price !== undefined) {
            getBooksQuery += ` AND price >= ?`;
            queryParams.push(Number(min_price));
        } else if (max_price !== undefined) {
            getBooksQuery += ` AND price <= ?`;
            queryParams.push(Number(max_price));
        }

        getBooksQuery += ` ORDER BY ${order_by} ${sortDirection} LIMIT ? OFFSET ?;`;
        queryParams.push(parsedLimit, parsedOffset);

        const booksArray = await db.all(getBooksQuery, queryParams);
        res.status(200).json(booksArray);
    } catch (e) {
        res.status(500).json({ message: `Internal Server Error: ${e.message}` });
    }
});

// GET /books/:bookId - Retrieve a single book by ID
app.get('/books/:bookId', async (req, res) => {
    try {
        const { bookId } = req.params;
        const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
        const book = await db.get(getBookQuery, [bookId]);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (e) {
        res.status(500).json({ message: `Internal Server Error: ${e.message}` });
    }
});

// POST /books - Add a new book with input validation
app.post('/books', async (req, res) => {
    try {
        const { title, author, price, pages } = req.body;

        // Validation Checks
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ message: 'Title is required and must be a valid string' });
        }
        if (!author || typeof author !== 'string' || author.trim() === '') {
            return res.status(400).json({ message: 'Author is required and must be a valid string' });
        }
        if (price === undefined || isNaN(price) || Number(price) < 0) {
            return res.status(400).json({ message: 'Price is required and must be a non-negative number' });
        }
        if (pages === undefined || isNaN(pages) || Number(pages) <= 0) {
            return res.status(400).json({ message: 'Pages must be a positive number' });
        }

        const addBookQuery = `
            INSERT INTO book (title, author, price, pages)
            VALUES (?, ?, ?, ?);
        `;
        const result = await db.run(addBookQuery, [title.trim(), author.trim(), Number(price), Number(pages)]);
        
        res.status(201).json({
            message: 'Book Created Successfully',
            bookId: result.lastID
        });
    } catch (e) {
        res.status(500).json({ message: `Internal Server Error: ${e.message}` });
    }
});

// PUT /books/:bookId - Update an existing book
app.put('/books/:bookId', async (req, res) => {
    try {
        const { bookId } = req.params;
        const { title, author, price, pages } = req.body;

        const checkBookQuery = `SELECT * FROM book WHERE id = ?;`;
        const existingBook = await db.get(checkBookQuery, [bookId]);

        if (!existingBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Validate types if fields are present in request body
        if (price !== undefined && isNaN(price)) {
            return res.status(400).json({ message: 'Price must be a valid number' });
        }
        if (pages !== undefined && isNaN(pages)) {
            return res.status(400).json({ message: 'Pages must be a valid number' });
        }

        const updateBookQuery = `
            UPDATE book
            SET title = ?, author = ?, price = ?, pages = ?
            WHERE id = ?;
        `;
        await db.run(updateBookQuery, [
            title !== undefined ? title : existingBook.title,
            author !== undefined ? author : existingBook.author,
            price !== undefined ? Number(price) : existingBook.price,
            pages !== undefined ? Number(pages) : existingBook.pages,
            bookId
        ]);

        res.status(200).json({ message: 'Book Updated Successfully' });
    } catch (e) {
        res.status(500).json({ message: `Internal Server Error: ${e.message}` });
    }
});

// DELETE /books/:bookId - Remove a book
app.delete('/books/:bookId', async (req, res) => {
    try {
        const { bookId } = req.params;
        const checkBookQuery = `SELECT * FROM book WHERE id = ?;`;
        const existingBook = await db.get(checkBookQuery, [bookId]);

        if (!existingBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const deleteBookQuery = `DELETE FROM book WHERE id = ?;`;
        await db.run(deleteBookQuery, [bookId]);

        res.status(200).json({ message: 'Book Deleted Successfully' });
    } catch (e) {
        res.status(500).json({ message: `Internal Server Error: ${e.message}` });
    }
});