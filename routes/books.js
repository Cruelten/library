const express = require('express')
const router = express.Router()
const fileMulter = require('../middleware/file') //multer
const { v4: uuid } = require('uuid')

class Book {
    constructor(id = uuid(), title = "", description = "", authors = "", favorite = "", fileCover = "", fileName = "", fileBook = "") {
        this.id = id
        this.title = title
        this.description = description
        this.authors = authors
        this.favorite = favorite
        this.fileCover = fileCover
        this.fileName = fileName
        this.fileBook = fileBook
    }
}

const library = {
    books: [
        new Book(),
        new Book(),
    ],
};


router.get('/', (req, res) => {
    const {books} = library
    res.json(books)
})



router.get('/:id', (req, res) => { //Получаем книгу по ее ID
    const {books} = library
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if( idx !== -1) {
        res.json(books[idx])
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }
})


router.get('/:id/download', (req, res) => { //получаем ссылку на книгу для ее скачивания
    const {books} = library
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if( idx !== -1) {
        res.download(books[idx].fileBook)
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }
})


router.post('/', fileMulter.single('kniga-pdf'), (req, res) => { //создаем книгу
    const {books} = library
    const {title, description, authors, favorite, fileCover} = req.body

    if(req.file){
        const {path} = req.file
        const {filename} = req.file
        
        const newBook = new Book(id = uuid(), title, description, authors, favorite, fileCover, fileName = filename, fileBook = path) 

        books.push(newBook)

        res.status(201)
        res.json(newBook)
    } else {
        res.json("Пожалуйста, добавьте файл книги")
    }
})




router.put('/:id', (req, res) => { //редактируем книгу
    const {books} = library
    const {title, description, authors, favorite, fileCover, fileName, fileBook} = req.body
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1){
        books[idx] = {
            ...books[idx],
            title, 
            description, 
            authors, 
            favorite, 
            fileCover, 
            fileName,
            fileBook
        }

        res.json(books[idx])
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }
})

router.delete('/:id', (req, res) => {
    const {books} = library
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)
     
    if(idx !== -1){
        books.splice(idx, 1)
        res.json('ok')
    } else {
        res.status(404)
        res.json('404 | страница не найдена')
    }
})



module.exports = router