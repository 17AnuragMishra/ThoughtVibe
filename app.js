'use strict';

/* Node Module */

const express = require("express");
require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');

/**
 * Custom modules
 */
const register = require("./src/routes/register_route");
const login = require("./src/routes/login_route");
const { connectDB, disconnectDB } = require('./src/config/mongoose_config')
const home = require('./src/routes/home_route');
const createBlog = require('./src/routes/create_blog_route'); 


/**
 * Initial Express 
 */
const app = express();



/**
 * Setting view engine
 */
app.set('view engine', 'ejs');

/**
 * Public directory
 */

app.use(express.static(`${__dirname}/public`));

/**
 * Parse urlEncoded body
 */

app.use(express.urlencoded({ extended: true }));

/**
 * parse json bodies
 */

app.use(express.json({ limit: '10mb' }));

/**
 * instance for season store
 */
const store = new MongoStore({
    mongoUrl: process.env.MONGO_CONNECTION_URI,
    collectionName: 'sessions',
    dbName: 'ThoughtVibe'
})

/**
 * initial express session
 */
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,

    cookie: {
        maxAge: Number(process.env.SESSION_MAX_AGE)
    }
}))


/**
 * Register
 */

app.use('/register', register);

/**
 * login page
 */
app.use('/login', login);

/**
 * Home page
 */
app.use('/', home);


/**
 * blog page
 */
app.use('/createblog', createBlog);


const PORT = process.env.PORT || 3000;
const server = app.listen(3000, async function () {
    console.log(`Server listening on port http://localhost:${PORT}`);

    try {
        await connectDB(process.env.MONGO_CONNECTION_URI);
    } catch (error) {
        console.error('Error connecting to database:', error.message);
        process.exit(1);
    }
});

 
/**Server start at 3000 port number */
server.on('close', async () => await disconnectDB())