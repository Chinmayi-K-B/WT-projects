require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- CONNECT TO MONGODB ATLAS ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Atlas Connection Error:", err));

// --- SCHEMA ---
const salarySchema = new mongoose.Schema({
    employee: String,
    id: String,
    month: String,
    total: Number,
    advance: Number,
    remainingSalary: Number,
    status: String,
    paymentDate: Date,
    date: { type: Date, default: Date.now }
});

const Salary = mongoose.model('Salary', salarySchema);

// --- API ROUTES ---

// Get All Records
app.get('/api/salary/get', async (req, res) => {
    try {
        const records = await Salary.find().sort({ date: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add New Record
app.post('/api/salary/add', async (req, res) => {
    try {
        const { employee, id, month, total, advance, paymentDate } = req.body;

        const remaining = total - advance;

        let status = "Pending";
        if (remaining <= 0) status = "Fully Paid";
        else if (advance > 0) status = "Partially Paid";

        const newRecord = new Salary({
            employee,
            id,
            month,
            total,
            advance,
            paymentDate,
            remainingSalary: remaining,
            status
        });

        await newRecord.save();
        res.json(newRecord);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Record
app.delete('/api/salary/delete/:id', async (req, res) => {
    try {
        await Salary.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
