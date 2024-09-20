/**
 * node modules
 **/
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const compression = require('compression')

/**
 * custome module
 **/
const register = require("./src/routes/register_routes");
const login = require("./src/routes/login_routes");
const logout = require("./src/routes/logout_route");
const home = require("./src/routes/home_routes");
const createBlog = require("./src/routes/create_blog_routes");
const blogDetail = require("./src/routes/blog_detail_routes");
const readingList = require("./src/routes/reading_list_routes");
const updateBlog = require("./src/routes/update_blog_routes");
const profile = require("./src/routes/profile_routes");
const dashboard = require("./src/routes/dashboard_routes");
const settings = require("./src/routes/settings_routes");
const deleteBlog = require("./src/routes/delete_blog_route");
const {
  APP_PORT,
  MONGO_CONNECTION_URL,
  SESSION_SECRET,
  SESSION_MAX_AGE,
} = require("./src/config");
const { connectDB, disconnectDB } = require("./src/config/mongoose_config");
const userAuth = require("./src/middlewares/user_auth_middleware");

/**
 * Initial Express
 **/
const app = express();

/**
 *  setting view engine
 **/
app.set("view engine", "ejs");

/**
 * compression response body
**/
app.use(compression());

/**
 * setting public directory
 **/
app.use(express.static(`${__dirname}/public`));

/**
 * parsing urlencoded data
 **/
app.use(express.urlencoded({ extended: true }));

/**
 * parsing json data
 **/
app.use(express.json({ limit: "10mb" }));

/**
 * instance for session
 **/
const store = new MongoStore({
  mongoUrl: MONGO_CONNECTION_URL,
  collectionName: "sessions",
  dbName: "MindScribe",
});

/**
 * initial express session
 **/
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: Number(SESSION_MAX_AGE),
    },
  })
);

/**
 * Application Public Routes
 **/
app.use("/register", register);
app.use("/login", login);
app.use("/", home);
app.use("/blogs", blogDetail);
app.use("/profile", profile);

/**
 * Application Authorization Routes
 **/
app.use(userAuth);
app.use("/createblog", createBlog);
app.use("/logout", logout);
app.use("/readinglist", readingList);
app.use("/blogs", updateBlog,deleteBlog);
app.use("/dashboard", dashboard);
app.use("/settings", settings);

/**
 * Start Server
 **/
const server = app.listen(APP_PORT, async () => {
  console.log(`Server Start On: http://localhost:${APP_PORT}`);
  await connectDB(MONGO_CONNECTION_URL);
});

server.on("close", async () => await disconnectDB());
