const express = require("express");
const getPrediction = require("./run_model");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.get("/api", (req, res) => {
    res.send("API is running");
}
);

app.post("/api/predict", async (req, res) => {
    try {
        const jsonData = req.body;
        console.log(jsonData);
        const result = await getPrediction(jsonData);
        console.log(result);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
