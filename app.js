import express from 'express';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mysql from 'mysql';
import bcrypt from 'bcrypt';

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

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

app.get("/login", (req, res) => {
  res.sendFile("/home/exigent/Web Development/Hawk_Gym/index.html");
})

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  let query   = `SELECT * FROM users WHERE username = ?`;
  let values  = [username];
  con.query(query, values, async (error, results, fields) => {
    if (error) {
      console.error('Error executing query:', error);
      return;
    }
    console.log('Query results:', results);
    let hashedPassword = results[0].password;
    let match          = await comparePasswords(password, hashedPassword);
    console.log(match);
    if (match) {
      res.send(`Username: ${username}<br>Password: ${password}`);
    } else {
      res.send("Invalid Username or Password");
    }
  });
});

app.get("/register", (req, res) => {
  res.send(`    <form action="/register" method="post">
  <input type="text" name="username" required>
  <input type="password" name="password" required>
  <button type="submit">Submit</button>
</form>`);
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const hashedPass = await hashPassword(password);
    const query = `INSERT INTO users(username, password) VALUES (?, ?)`;
    con.query(query, [username, hashedPass], (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Error registering user');
        return;
      }
      console.log('User registered successfully');
      res.send('User registered successfully');
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).send('Error registering user');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
