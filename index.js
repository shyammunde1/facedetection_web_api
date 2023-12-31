const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcrypt-nodejs");

const register = require("./controllers/register");
const profile = require("./controllers/profile");
const signin = require("./controllers/signin");
const image = require("./controllers/image");

// import handleRegister from "./controllers/register";
// import signinHandler from "./controllers/signin";
// import profileHandler from "./controllers/profile";

const app = express();

app.use(express.json());
app.use(cors());

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    host: process.env.DATABASE_HOST,
    Port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB,
  },
});
// console.log(
//   db
//     .select("*")
//     .from("users")
//     .then((data) => {
//       console.log(data);
//     })
// );

// app.get("/", (req, res) => {
//   res.json(database.users);
// });
// app.get("/",(req,res)=> {res.send("it is working")})
app.post("/signin", signin.signinHandler(db, bcrypt));

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.profileHandler(req, res, db);
});
app.put("/image", (req, res) => {
  image.imageHandler(req, res, db);
});
app.post("/imageurl", (req, res) => {
  image.handleAPICall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port  ${process.env.PORT}`);
});
