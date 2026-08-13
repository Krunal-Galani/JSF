const express = require("express");
const router = express.Router();

const db = require("../db");


// GET ALL STUDENTS

router.get("/", (req, res) => {

    const sql = "SELECT * FROM students";

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

    const sql = "SELECT * FROM students WHERE id = ?";

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


// =====================
// UPDATE STUDENT
// =====================

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