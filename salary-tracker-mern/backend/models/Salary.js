const mongoose = require("mongoose");

/*
  Salary Schema
  Stores employee salary details,
  advance payment, remaining salary,
  and payment status.
*/

const salarySchema = new mongoose.Schema({
  employeeID: {
    type: String,
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  monthYear: {
    type: String,
    required: true,
  },
  totalSalary: {
    type: Number,
    required: true,
  },
  advanceAmount: {
    type: Number,
    required: true,
  },
  remainingSalary: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Partially Paid", "Paid"],
    required: true,
  },
});

module.exports = mongoose.model("Salary", salarySchema);
