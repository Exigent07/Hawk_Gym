const express       = require('express');
const ejs           = require('ejs');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const mysql         = require('mysql');
const bcrypt        = require('bcrypt');
const {encode}  = require('html-entities');

const app   = express();
const port  = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const con = mysql.createConnection({
  host:     "localhost",
  user:     "root",
  password: "password",
  database: "gym"
});

async function hashPassword(password) {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function comparePasswords(plainPassword, hashedPassword) {
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  return match;
}

con.connect((err) => {
  if (err) {
    console.error('Error connecting to database');
  }
  console.log("Connected");
})

let query = {
  users: `CREATE TABLE IF NOT EXISTS users (
      id INT NOT NULL AUTO_INCREMENT,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      password VARCHAR(255) NOT NULL,
      fee_due DECIMAL(10, 2) NOT NULL DEFAULT 0,
      profile_pic VARCHAR(255),
      PRIMARY KEY (id)
    );`,
  attendence: `CREATE TABLE IF NOT EXISTS attendance (
      id INT NOT NULL AUTO_INCREMENT,
      user_id INT NOT NULL,
      date DATE NOT NULL,
      attended BOOLEAN NOT NULL DEFAULT false,
      PRIMARY KEY (id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );`,
  workout: `CREATE TABLE IF NOT EXISTS workouts (
      id INT NOT NULL AUTO_INCREMENT,
      user_id INT NOT NULL,
      date DATE NOT NULL,
      workout_type VARCHAR(255) NOT NULL,
      duration_minutes INT NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );`
}
Object.values(query).forEach(element => {
  con.query(element, (err, result) => {
    if (err) console.log(err);
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/login", (req, res) => {
  const input = req.body.username;
  const password = req.body.password;

  let query   = `SELECT * FROM users WHERE username = ? OR email = ?`;
  let values  = [input, input];
  con.query(query, values, async (error, results, fields) => {
    if (error) {
      console.error('Error executing query:', error);
      return;
    }
    console.log('Query results:', results);
    if (results.length === 0) {
      res.redirect("/?invalid")
      return;
    }
    let hashedPassword = results[0].password;
    let match          = await comparePasswords(password, hashedPassword);
    console.log(match);
    if (match) {
      res.send(`Username: ${results[0].username}<br>Password: ${password}`);
    } else {
      res.redirect("/?invalid")
    }
    
  });
});

app.post("/register", async (req, res) => {
  const username = encode(req.body.username);
  const password = req.body.password;
  const email    = req.body.email;

  try {
    const hashedPass = await hashPassword(password);
    const query = `INSERT INTO users(username, password, email) VALUES (?, ?, ?)`;
    con.query(query, [username, hashedPass, email], (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        res.redirect('/?failed');
        return;
      }
      console.log('User registered successfully');
      res.redirect("/?success")
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.redirect('/?failed');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
