const express = require("express");
const router = express.Router();
const Salary = require("../models/Salary");

/*
  GET /test
  Test route to verify API
*/
router.get("/test", (req, res) => {
  res.send("Salary API working");
});

/*
  POST /addSalary
  Adds salary record with calculated fields
*/
router.post("/addSalary", async (req, res) => {
  try {
    const {
      employeeID,
      employeeName,
      monthYear,
      totalSalary,
      advanceAmount,
      paymentDate,
    } = req.body;

    // Validation
    if (advanceAmount > totalSalary) {
      return res.status(400).json({
        message: "Advance amount cannot be greater than total salary",
      });
    }

    // Calculate remaining salary
    const remainingSalary = totalSalary - advanceAmount;

    // Determine payment status
    let paymentStatus = "Pending";
    if (advanceAmount > 0 && advanceAmount < totalSalary) {
      paymentStatus = "Partially Paid";
    } else if (advanceAmount === totalSalary) {
      paymentStatus = "Paid";
    }

    // Save to MongoDB
    const salary = new Salary({
      employeeID,
      employeeName,
      monthYear,
      totalSalary,
      advanceAmount,
      remainingSalary,
      paymentDate,
      paymentStatus,
    });

    const savedSalary = await salary.save();

    res.status(201).json({
      message: "Salary record added successfully",
      data: savedSalary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*
  GET /getSalaries
  Fetch all salary records
*/
/*
  GET /getSalaries
  Fetch all salary records from MongoDB
*/
router.get("/getSalaries", async (req, res) => {
  try {
    const salaries = await Salary.find();
    res.status(200).json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
