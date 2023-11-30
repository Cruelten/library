const express = require('express')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('./db')
const mongoose = require('mongoose')

const errorMiddleware = require('./middleware/error');

const indexBoooks = require('./routes/index')
const apiBoooks = require('./routes/books')



const verify = (username, password, done) => {
  db.users.findByUsername(username, (err, user) => {
      if (err) {return done(err)}
      if (!user) { return done(null, false) }

      if( !db.users.verifyPassword(user, password)) {
          return done(null, false)
      }

      return done(null, user)
  })
}

const options = {
  usernameField: "username",
  passwordField: "password",
}

passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser( (id, cb) => {
  db.users.findById(id,  (err, user) => {
    if (err) { return cb(err) }
    cb(null, user)
  })
})

const app = express()
app.set("view engine", "ejs");

app.use(express.urlencoded());
app.use(session({ secret: 'SECRET'}));


app.use(passport.initialize())
app.use(passport.session())



app.get('/api/user/', (req, res) => {
  res.render('home', { user: req.user })
})

app.get('/api/user/login',   (req, res) => {
  res.render('login')
})

app.post('/api/user/login',
passport.authenticate('local', { failureRedirect: '/api/user/login' }),
(req, res) => {
  console.log("req.user: ", req.user)
  res.redirect('/api/user/')
})

app.get('/api/user/logout',  (req, res) => {
  req.logout()
  res.redirect('/api/user/')
})

app.get('/api/user/profile',
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/login')
    }
    next()
  },
  (req, res) => {
    res.render('profile', { user: req.user })
  }
)




app.use('/', indexBoooks) //работаем с книгами
app.use('/api/books', apiBoooks) //работаем с книгами по API


app.use(errorMiddleware);


const server = 'root:example@mongo:27017'
const database = 'admin'
const PORT = process.env.PORT || 3000     

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://${server}/${database}`)

    console.log('MongoDB connected!!')
  } catch (err) {
    console.log('Failed to connect to MongoDB', err)
  }
}

connectDB()




console.log(`Работаем по порту ${PORT}`)
console.log(`URL ${server}`)
app.listen(PORT)

