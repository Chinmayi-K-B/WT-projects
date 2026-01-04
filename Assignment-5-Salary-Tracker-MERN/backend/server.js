const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- CONNECT TO MONGODB ---
mongoose.connect('mongodb://127.0.0.1:27017/salary_tracker')
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- 1. UPDATED SCHEMA ---
const salarySchema = new mongoose.Schema({
    employee: String,
    id: String,
    month: String,
    total: Number,
    advance: Number,
    remainingSalary: Number, // Backend will calculate this
    status: String,          // Backend will determine this
    paymentDate: Date,       // New Field as per PDF
    date: { type: Date, default: Date.now } // Record creation timestamp
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

// Add New Record (WITH CALCULATIONS)
app.post('/api/salary/add', async (req, res) => {
    try {
        const { employee, id, month, total, advance, paymentDate } = req.body;

        // --- BACKEND LOGIC STARTS HERE ---
        // 1. Calculate Remaining
        const remaining = total - advance;

        // 2. Determine Status
        let status = "Pending";
        if (remaining <= 0) {
            status = "Fully Paid";
        } else if (advance > 0) {
            status = "Partially Paid";
        }

        // 3. Create & Save Record
        const newRecord = new Salary({
            employee,
            id,
            month,
            total,
            advance,
            paymentDate,
            remainingSalary: remaining, // Saving the calculated value
            status: status              // Saving the calculated status
        });

        await newRecord.save();
        console.log("✅ Data Saved with Backend Logic!");
        res.json(newRecord);

    } catch (err) {
        console.error("❌ Save Error:", err);
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
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));