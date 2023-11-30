const express = require('express')
const router = express.Router()
const fileMulter = require('../middleware/file') //multer
const { v4: uuid } = require('uuid')

class Book {
    constructor(id = uuid(), title = "", description = "", authors = "", favorite = "", fileCover = "", fileName = "", fileBook = "") {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.fileBook = fileBook;
    }
}

const library = {
    books: [
        new Book(id = uuid(), 'Война и мир', 'Великая книги Льва Толстого', 'Лев Толстой'),
        new Book(id = uuid(), 'Евгений Онегин', 'Бессмертная классика', 'Александр Пушкин'),
    ],
};






router.get('/', (req, res) => {
    const {books} = library;
    res.render("index", {
        title: "Библиотека",
        books: books,
    });
});


router.get('/create', (req, res) => { 
    res.render("create", {
        title: "Библиотека | Создание книги",
        books: {},
    });
});

router.post('/create', fileMulter.single('fileBook'), (req, res) => {
    const {books} = library;
    const {title, description, authors, favorite, fileCover} = req.body;

    if(req.file){
        const {path} = req.file
        const {filename} = req.file
        const newBook = new Book(id = uuid(), title, description, authors, favorite, fileCover, fileName = filename, fileBook = path) 
        books.push(newBook);  
        res.redirect('/')      
    } else {
        const newBook = new Book(id = uuid(), title, description, authors) 
        books.push(newBook);  
        res.redirect('/')      
    }

});



router.get('/update/:id', (req, res) => { //вносим правки в книгу
    const {books} = library;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx === -1) {
        res.redirect('/404');
    } 

    res.render("update", {
        title: "Библиотека | Редактирование книги",
        books: books[idx],
    });
});
router.post('/update/:id',  fileMulter.single('fileBook'), (req, res) => {
    const {books} = library;
    const {id} = req.params;
    const {title, description, authors, favorite, fileCover} = req.body;
    const idx = books.findIndex(el => el.id === id);
   
    if (idx === -1) {
        res.redirect('/404');
    } else {
        if(req.file){
            const {path} = req.file
            const {filename} = req.file
            books[idx] = {
                ...books[idx],
                title,
                description,
                authors,
                favorite, 
                fileCover,
                fileName: filename,
                fileBook: path,
            };

        } else {
            books[idx] = {
                ...books[idx],
                title,
                description,
                authors,
            };

        }
    }
    res.redirect(`/${id}`);
});


router.post('/delete/:id', (req, res) => {
    const {books} = library;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx === -1) {
        res.redirect('/404');
    } 

    books.splice(idx, 1);
    res.redirect(`/`);
});




router.get('/:id', (req, res) => { //Получаем книгу по ее ID
    const {books} = library;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx === -1) {
        res.redirect('/404');
        return;
    } 
    res.render("view", {
        title: "Подробнее о книге",
        book: books[idx],
    });
    
});


router.get('/:id/download', (req, res) => { //скачиваем книгу
    const {books} = library
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if( idx !== -1) {
        res.download(books[idx].fileBook)
    } else {
        res.redirect('/404');
    }
})


module.exports = router;