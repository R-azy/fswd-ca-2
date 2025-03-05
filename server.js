const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();

const app=express();
const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection failed.'))

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'The book title']
    },
    author: {
        type: String,
        required: [true, 'Name of the author']
    },
    genre: {
        type: String,
        required: [true, 'Genre of the book.']
    },
    publishedYear: {
        type: Number,
        required: [true, 'Year of publication']
    },
    availableCopies: {
        type: Number,
        required: [true, 'Number of copies available in the library']
    },
    borrowedBy: {
        type: ArrayofObjectIds,
        referencesUser: [true, 'List of users who borrowed this book']
    }
});

const bookGenre = mongoose.model('bookGenre', bookSchema);


app.post('/book', async(req, res) => {
    const {title, autor, genre, publishedYear, availableCopies,borrowedBy} = req.body;

    if(!title || !author || !genre || !PublishedYear || !availableCopies) {
        return res.status(400).json({error: 'The field is required'})
    }

    try {
        const newBook = new bookGenre({title, author, genre, PublishedYear, availableCopies});
        await bookGenre.save();
        return res.status(201).json({message: 'New Book created successfully!', details: bookGenre});
    }
    catch(err) {
        res.status(500).json({error: 'Book not created'});
    };
});

app.get('/book', async(req, res) => {
    try {
        const bookItems = await bookGenre.find();
        return res.status(201).json(Items);
    }
    catch(err) {
        return res.status(500).json({error: 'Cannot fetch book.'});
    };
});

app.put('book/:id', async(req, res) => {
    const {id} = req.params;
    const {title, author, genre, PublishedYear, availableCopies} = req.body;
    
    try {
        const updateBook = await bookGenre.findByIdAndUpdate(id,
            {title, author, genre, PublishedYear, availableCopies},
            {new: true, runValidators: true}
        );
        if (!updateBook) {
            return res.status(400).json({error: 'Book not updated'})
        }
        return res.status(201).json({message: 'Book updated successfully!'});
    }
    catch(err) {
        return res.status(500).json({error: 'Cannot fetch Book'})
    };
});

app.delete('book/:id', async(req,res) => {
    const {id} = req.params;

    try {
        const deleteBook = await bookGenre.findByIdAndDelete(id);
        if(!deleteBook) {
            return res.status(404).json({error: 'Cannot find book'});
        }
        return res.status(201).json({message: 'Book deleted successfully!'});
    }
    catch(err) {
        return res.status(500).json({error: 'Book cannot be deleted'})
    };
});

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});