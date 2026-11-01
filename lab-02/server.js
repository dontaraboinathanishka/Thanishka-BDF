const express = require('express');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname, 'books.db');
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

        // Check if table is empty and insert initial seed data (8-10 rows)
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

// Root Home Route
app.get('/', (req, res) => {
    res.send('Welcome to Express.js & SQLite CRUD API Lab Server!');
});

// GET /books/ - Retrieve all books
app.get('/books/', async (req, res) => {
    try {
        const getBooksQuery = `SELECT * FROM book ORDER BY id ASC;`;
        const booksArray = await db.all(getBooksQuery);
        res.status(200).json(booksArray);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// GET /books/:bookId/ - Retrieve a specific book by ID
app.get('/books/:bookId/', async (req, res) => {
    try {
        const { bookId } = req.params;
        const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
        const book = await db.get(getBookQuery, [bookId]);
        
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST /books/ - Add a new book
app.post('/books/', async (req, res) => {
    try {
        const { title, author, price, pages } = req.body;
        if (!title || !author || price === undefined || pages === undefined) {
            return res.status(400).json({ error: 'Missing required fields: title, author, price, pages' });
        }
        
        const addBookQuery = `
            INSERT INTO book (title, author, price, pages)
            VALUES (?, ?, ?, ?);
        `;
        const result = await db.run(addBookQuery, [title, author, price, pages]);
        res.status(201).json({ 
            message: 'Book Added Successfully',
            bookId: result.lastID 
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// PUT /books/:bookId/ - Update an existing book by ID
app.put('/books/:bookId/', async (req, res) => {
    try {
        const { bookId } = req.params;
        const { title, author, price, pages } = req.body;
        
        const checkBookQuery = `SELECT * FROM book WHERE id = ?;`;
        const existingBook = await db.get(checkBookQuery, [bookId]);
        
        if (!existingBook) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const updateBookQuery = `
            UPDATE book
            SET title = ?, author = ?, price = ?, pages = ?
            WHERE id = ?;
        `;
        await db.run(updateBookQuery, [
            title || existingBook.title,
            author || existingBook.author,
            price !== undefined ? price : existingBook.price,
            pages !== undefined ? pages : existingBook.pages,
            bookId
        ]);

        res.status(200).json({ message: 'Book Updated Successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// DELETE /books/:bookId/ - Delete a book by ID
app.delete('/books/:bookId/', async (req, res) => {
    try {
        const { bookId } = req.params;
        const checkBookQuery = `SELECT * FROM book WHERE id = ?;`;
        const existingBook = await db.get(checkBookQuery, [bookId]);
        
        if (!existingBook) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const deleteBookQuery = `DELETE FROM book WHERE id = ?;`;
        await db.run(deleteBookQuery, [bookId]);
        res.status(200).json({ message: 'Book Deleted Successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});