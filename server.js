const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

// import all route callbacks
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();
// connect server to the database using knex sql query builder, assign to the variable for later use of queries
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  }
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

// root route
app.get('/', (req, res) => { res.send('Welcome to the server side, it is working!') });
//sign in route
app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) });
// another syntax:
// Here: app.post('/signin', signin.handleSignIn(db, bcrypt));
// In signin.js: const handleSignIn = (db, bcrypt) => (req, res) => {};
// registration route
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
// this route is for future profile page
app.get('/profile/:id', profile.handleProfileGet(db));
// update detection count if user submits the image
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
// make call to clarifai api and get our response
app.post('/imageurl', (req, res) => { image.handleClarifaiCall(req, res) });

app.listen(process.env.PORT || 3000, () => {
  console.log(`smart-brain server is running on port ${process.env.PORT}..`);
});