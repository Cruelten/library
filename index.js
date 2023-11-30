const express = require('express')

const errorMiddleware = require('./middleware/error');


const indexBoooks = require('./routes/index')
const apiBoooks = require('./routes/books')
const listOfUser = require('./routes/user')


const app = express()
app.use(express.urlencoded());
app.set("view engine", "ejs");

app.use('/', indexBoooks) //работаем с книгами
app.use('/api/books', apiBoooks) //работаем с книгами по API
app.use('/api/user', listOfUser) //работаем с пользователями


app.use(errorMiddleware);

const PORT = process.env.PORT || 3000
console.log(`Работаем по порту ${PORT}`)
app.listen(PORT)