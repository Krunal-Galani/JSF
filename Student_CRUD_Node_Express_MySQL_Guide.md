# Student CRUD API using Node.js, Express.js and MySQL

A beginner-friendly guide to create a **dynamic Student CRUD API** using
Node.js, Express.js and MySQL.

CRUD means:

-   **C** → Create
-   **R** → Read
-   **U** → Update
-   **D** → Delete

This project stores student data in a MySQL database instead of a
JavaScript array.

------------------------------------------------------------------------

## 1. Technologies Used

-   Node.js
-   Express.js
-   MySQL
-   mysql2
-   Thunder Client / Postman

------------------------------------------------------------------------

# 2. Project Structure

Create the project like this:

``` text
student-crud/
│
├── server.js
├── db.js
├── package.json
│
└── Routes/
    └── studentRoutes.js
```

### What each file does

  File                 Purpose
  -------------------- -----------------------------------------------------
  `server.js`          Creates the Express server and starts it
  `db.js`              Connects Node.js with MySQL
  `studentRoutes.js`   Contains all Student CRUD routes
  `package.json`       Contains project information and installed packages

------------------------------------------------------------------------

# 3. Create the Project

Open a terminal and run:

``` bash
mkdir student-crud
cd student-crud
npm init -y
```

Now install Express and MySQL:

``` bash
npm install express mysql2
```

------------------------------------------------------------------------

# 4. Create the MySQL Database

Open MySQL Workbench or phpMyAdmin.

Create a database:

``` sql
CREATE DATABASE student_db;
```

Select the database:

``` sql
USE student_db;
```

Create the Students table:

``` sql
CREATE TABLE Students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    age INT,
    course VARCHAR(100)
);
```

Now the table looks like:

``` text
Students
-------------------------
id
name
age
course
```

### Why use `AUTO_INCREMENT`?

When we insert a student, MySQL automatically creates the ID.

For example:

``` text
First student  → id = 1
Second student → id = 2
Third student  → id = 3
```

We don't have to manually enter the ID.

------------------------------------------------------------------------

# 5. Create `db.js`

`db.js` is responsible for connecting our Node.js application to MySQL.

``` javascript
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "student_db"
});

db.connect((err) => {

    if (err) {
        console.log("Database connection failed");
    } else {
        console.log("Database connected");
    }

});

module.exports = db;
```

## Important things in `db.js`

### `require("mysql2")`

``` javascript
const mysql = require("mysql2");
```

This imports the MySQL package.

### `createConnection()`

``` javascript
mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "student_db"
});
```

This tells Node.js which MySQL database to connect to.

### `module.exports`

``` javascript
module.exports = db;
```

This allows other files to use the database connection.

For example:

``` javascript
const db = require("../db");
```

------------------------------------------------------------------------

# 6. Create `server.js`

Create `server.js` in the main project folder.

``` javascript
const express = require("express");

const app = express();

const studentRoutes = require("./Routes/studentRoutes");

// Middleware
app.use(express.json());

// Student routes
app.use("/api/students", studentRoutes);

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

## Important things in `server.js`

### Create Express application

``` javascript
const express = require("express");

const app = express();
```

`express` is the framework.

`app` represents our Express application.

### `express.json()`

``` javascript
app.use(express.json());
```

This allows Express to read JSON data sent by Postman or Thunder Client.

For example:

``` json
{
    "name": "Rahul",
    "age": 21,
    "course": "Computer"
}
```

Without `express.json()`, `req.body` will not work correctly for JSON
requests.

### Connect routes

``` javascript
app.use("/api/students", studentRoutes);
```

This means all routes inside `studentRoutes.js` start with:

``` text
/api/students
```

### Start server

``` javascript
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

This starts our Node.js server on port `3000`.

------------------------------------------------------------------------

# 7. Create the Routes Folder

Create:

``` text
Routes
```

Inside it create:

``` text
studentRoutes.js
```

Final structure:

``` text
student-crud/
│
├── server.js
├── db.js
│
└── Routes/
    └── studentRoutes.js
```

------------------------------------------------------------------------

# 8. Understand `express.Router()`

At the top of `studentRoutes.js`:

``` javascript
const express = require("express");

const router = express.Router();
```

`router` is used to create and manage routes separately.

Instead of writing:

``` javascript
app.get(...)
app.post(...)
app.put(...)
app.delete(...)
```

we write:

``` javascript
router.get(...)
router.post(...)
router.put(...)
router.delete(...)
```

This keeps our project organized.

Think:

``` text
app
 |
 └── student router
       |
       ├── GET
       ├── POST
       ├── PUT
       └── DELETE
```

------------------------------------------------------------------------

# 9. Import the Database

Inside `studentRoutes.js`:

``` javascript
const db = require("../db");
```

`../db` means:

> Go one folder back and get `db.js`.

Because our structure is:

``` text
Routes/
    studentRoutes.js

db.js
```

------------------------------------------------------------------------

# 10. CREATE - Add Student

The route:

``` javascript
router.post("/", (req, res) => {

    const { name, age, course } = req.body;

    const sql = `
        INSERT INTO Students (name, age, course)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [name, age, course], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            message: "Student added successfully"
        });

    });

});
```

## How it works

Send a POST request:

``` text
POST http://localhost:3000/api/students
```

Body:

``` json
{
    "name": "Rahul",
    "age": 21,
    "course": "Computer"
}
```

### Step 1: Get data from `req.body`

``` javascript
const { name, age, course } = req.body;
```

If the body is:

``` json
{
    "name": "Rahul",
    "age": 21,
    "course": "Computer"
}
```

then:

``` text
name   = Rahul
age    = 21
course = Computer
```

This is called **destructuring**.

It is similar to:

``` javascript
const name = req.body.name;
const age = req.body.age;
const course = req.body.course;
```

### Step 2: Create SQL query

``` sql
INSERT INTO Students (name, age, course)
VALUES (?, ?, ?)
```

The `?` values are replaced using:

``` javascript
[name, age, course]
```

So MySQL receives values like:

``` text
Rahul
21
Computer
```

### Why use `?`

Using `?` with `db.query()` is safer than directly joining user input
into SQL.

------------------------------------------------------------------------

# 11. READ - Get All Students

Route:

``` javascript
router.get("/", (req, res) => {

    const sql = "SELECT * FROM Students";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(result);

    });

});
```

Request:

``` text
GET http://localhost:3000/api/students
```

SQL:

``` sql
SELECT * FROM Students;
```

This gets all students.

Example response:

``` json
[
    {
        "id": 1,
        "name": "Rahul",
        "age": 21,
        "course": "Computer"
    },
    {
        "id": 2,
        "name": "Krunal",
        "age": 20,
        "course": "Computer Engineering"
    }
]
```

------------------------------------------------------------------------

# 12. READ - Get One Student

We can get a student using their ID.

Route:

``` javascript
router.get("/:id", (req, res) => {

    const id = req.params.id;

    const sql = "SELECT * FROM Students WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(result);

    });

});
```

Request:

``` text
GET http://localhost:3000/api/students/1
```

### What is `req.params`?

The URL is:

``` text
/api/students/1
```

The `1` is the route parameter.

Because we wrote:

``` javascript
router.get("/:id", ...)
```

we can get it using:

``` javascript
req.params.id
```

So:

``` javascript
const id = req.params.id;
```

gives:

``` text
id = 1
```

------------------------------------------------------------------------

# 13. UPDATE - Update Student

Route:

``` javascript
router.put("/:id", (req, res) => {

    const id = req.params.id;

    const { name, age, course } = req.body;

    const sql = `
        UPDATE Students
        SET name = ?, age = ?, course = ?
        WHERE id = ?
    `;

    db.query(sql, [name, age, course, id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            message: "Student updated successfully"
        });

    });

});
```

Request:

``` text
PUT http://localhost:3000/api/students/1
```

Body:

``` json
{
    "name": "Rahul",
    "age": 22,
    "course": "Computer Engineering"
}
```

### What happens?

URL gives:

``` text
id = 1
```

Body gives:

``` text
name   = Rahul
age    = 22
course = Computer Engineering
```

SQL becomes conceptually:

``` sql
UPDATE Students
SET name = ?,
    age = ?,
    course = ?
WHERE id = ?;
```

The values are:

``` javascript
[name, age, course, id]
```

------------------------------------------------------------------------

# 14. DELETE - Delete Student

Route:

``` javascript
router.delete("/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM Students WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });

    });

});
```

Request:

``` text
DELETE http://localhost:3000/api/students/1
```

The ID comes from:

``` javascript
req.params.id
```

SQL:

``` sql
DELETE FROM Students
WHERE id = ?;
```

------------------------------------------------------------------------

# 15. Complete `studentRoutes.js`

After understanding each route, your complete file is:

``` javascript
const express = require("express");

const router = express.Router();

const db = require("../db");


// GET ALL STUDENTS

router.get("/", (req, res) => {

    const sql = "SELECT * FROM Students";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(result);
    });

});


// GET STUDENT BY ID

router.get("/:id", (req, res) => {

    const id = req.params.id;

    const sql = "SELECT * FROM Students WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(result);
    });

});


// ADD STUDENT

router.post("/", (req, res) => {

    const { name, age, course } = req.body;

    const sql = `
        INSERT INTO Students (name, age, course)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [name, age, course], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            message: "Student added successfully"
        });
    });

});


// UPDATE STUDENT

router.put("/:id", (req, res) => {

    const id = req.params.id;

    const { name, age, course } = req.body;

    const sql = `
        UPDATE Students
        SET name = ?, age = ?, course = ?
        WHERE id = ?
    `;

    db.query(sql, [name, age, course, id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            message: "Student updated successfully"
        });
    });

});


// DELETE STUDENT

router.delete("/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM Students WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });
    });

});


module.exports = router;
```

------------------------------------------------------------------------

# 16. Important `module.exports`

At the bottom:

``` javascript
module.exports = router;
```

This exports our router.

Then `server.js` imports it:

``` javascript
const studentRoutes = require("./Routes/studentRoutes");
```

And connects it:

``` javascript
app.use("/api/students", studentRoutes);
```

------------------------------------------------------------------------

# 17. Start the Server

Run:

``` bash
node server.js
```

You should see:

``` text
Database connected
Server running on http://localhost:3000
```

------------------------------------------------------------------------

# 18. Test CRUD Using Thunder Client

## CREATE

``` text
POST
http://localhost:3000/api/students
```

Body:

``` json
{
    "name": "Rahul",
    "age": 21,
    "course": "Computer"
}
```

------------------------------------------------------------------------

## READ ALL

``` text
GET
http://localhost:3000/api/students
```

------------------------------------------------------------------------

## READ ONE

``` text
GET
http://localhost:3000/api/students/1
```

------------------------------------------------------------------------

## UPDATE

``` text
PUT
http://localhost:3000/api/students/1
```

Body:

``` json
{
    "name": "Rahul Patel",
    "age": 22,
    "course": "Computer Engineering"
}
```

------------------------------------------------------------------------

## DELETE

``` text
DELETE
http://localhost:3000/api/students/1
```

------------------------------------------------------------------------

# 19. CRUD Summary

  Operation   Method   URL                 SQL
  ----------- -------- ------------------- --------
  Create      POST     `/api/students`     INSERT
  Read all    GET      `/api/students`     SELECT
  Read one    GET      `/api/students/1`   SELECT
  Update      PUT      `/api/students/1`   UPDATE
  Delete      DELETE   `/api/students/1`   DELETE

------------------------------------------------------------------------

# 20. Most Important Express Concepts

## `req.body`

Used to get data from the request body.

Example:

``` json
{
    "name": "Rahul",
    "age": 21,
    "course": "Computer"
}
```

Code:

``` javascript
const { name, age, course } = req.body;
```

------------------------------------------------------------------------

## `req.params`

Used to get values from the URL.

URL:

``` text
/api/students/5
```

Route:

``` javascript
router.get("/:id", ...)
```

Code:

``` javascript
const id = req.params.id;
```

Result:

``` text
id = 5
```

------------------------------------------------------------------------

## `res.json()`

Sends JSON response to the client.

``` javascript
res.json({
    message: "Student added successfully"
});
```

------------------------------------------------------------------------

## `db.query()`

Sends SQL to MySQL.

``` javascript
db.query(sql, values, callback);
```

Basic pattern:

``` javascript
db.query(sql, [values], (err, result) => {

    if (err) {
        return res.status(500).json({
            message: "Database error"
        });
    }

    res.json(result);
});
```

------------------------------------------------------------------------

# 21. Complete Flow of the Project

``` text
Thunder Client / Postman
          |
          | HTTP Request
          ↓
      server.js
          |
          ↓
   studentRoutes.js
          |
          ↓
       db.query()
          |
          ↓
        MySQL
          |
          ↓
    Students Table
          |
          ↓
       Response
          |
          ↓
Thunder Client / Postman
```

------------------------------------------------------------------------

# 22. Simple Way to Remember

For every CRUD route, think:

``` text
1. Get data
       ↓
2. Create SQL
       ↓
3. db.query()
       ↓
4. Check error
       ↓
5. Send response
```

### POST

``` text
req.body
   ↓
INSERT
   ↓
MySQL
```

### GET

``` text
MySQL
   ↓
SELECT
   ↓
Response
```

### PUT

``` text
req.params + req.body
        ↓
      UPDATE
        ↓
      MySQL
```

### DELETE

``` text
req.params
    ↓
  DELETE
    ↓
  MySQL
```

------------------------------------------------------------------------

# 23. Common Beginner Errors

### Error 1: `req.body` is undefined

Make sure this is in `server.js`:

``` javascript
app.use(express.json());
```

------------------------------------------------------------------------

### Error 2: Database connection failed

Check:

``` javascript
host: "localhost",
user: "root",
password: "",
database: "student_db"
```

Make sure MySQL is running.

------------------------------------------------------------------------

### Error 3: Table doesn't exist

Check the database:

``` sql
USE student_db;

SHOW TABLES;
```

You should see:

``` text
Students
```

------------------------------------------------------------------------

### Error 4: Wrong column name

Check:

``` sql
DESCRIBE Students;
```

Our columns should be:

``` text
id
name
age
course
```

------------------------------------------------------------------------

### Error 5: PUT gives Database error

Temporarily print the real error:

``` javascript
if (err) {
    console.log(err);

    return res.status(500).json({
        message: "Database error"
    });
}
```

Check the terminal for the actual MySQL error.

------------------------------------------------------------------------

# 24. Final Project Structure

``` text
student-crud/
│
├── server.js
├── db.js
├── package.json
├── package-lock.json
│
└── Routes/
    └── studentRoutes.js
```

This is a simple and good structure for a **beginner Node.js + Express +
MySQL CRUD project**.

------------------------------------------------------------------------

## GitHub Upload

After testing your project, you can create a GitHub repository and
upload:

``` text
student-crud/
├── server.js
├── db.js
├── package.json
├── package-lock.json
├── Routes/
│   └── studentRoutes.js
└── README.md
```

**Do not upload passwords or sensitive database credentials to GitHub.**
For a real project, use environment variables such as `.env`.
