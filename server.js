const express = require("express");

const app = express();

const studentRoutes = require("./Routes/StudentRoute");

// Middleware
app.use(express.json());

// Routes
app.use("/api/students", studentRoutes);

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});