const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
const fs = require('fs');
const { Login, Employee } = require('../models'); 
require("dotenv").config();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir); 
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only jpg and png formats are allowed!'), false);
    }
    cb(null, true);
  }
}).single('img'); 


router.post("/register", async (req, res) => {
  console.log("Register Api backend")
  const { userName, pwd } = req.body;

  if (!userName || !pwd) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const existingUser = await Login.findOne({ where: { f_userName: userName } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(pwd, 10);
    const newUser = await Login.create({
      f_userName: userName,
      f_pwd: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully!",
      userId: newUser.f_sno,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


router.post("/login", async (req, res) => {
  const { userName, pwd } = req.body;

  if (!userName || !pwd) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const user = await Login.findOne({ where: { f_userName: userName } });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const isMatch = await bcrypt.compare(pwd, user.f_pwd);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign({ userId: user.f_sno }, process.env.JWT_SECRET, { expiresIn: "7d" });
    user.f_pwd = undefined; 

    res.status(200).json({
      message: "Login successful!",
      token,
      user,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


router.post("/saveEmployee", (req, res) => {
  console.log(req.body);

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image upload is required and must be jpg/png format." });
    }

    const { name, email, mobile, designation, gender, course } = req.body;

    const errors = {};
    if (!name) errors.name = "Name is required.";
    if (!email) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email format.";
    if (!mobile) errors.mobile = "Mobile number is required.";
    else if (!/^[0-9]+$/.test(mobile)) errors.mobile = "Mobile number must be numeric.";
    if (!designation) errors.designation = "Designation is required.";
    if (!gender) errors.gender = "Gender is required.";
    if (!course) errors.course = "Course is required.";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    try {
      const existingEmployee = await Employee.findOne({ where: { f_Email: email } });
      if (existingEmployee) {
        return res.status(400).json({ message: "Email already exists." });
      }

      const newEmployee = await Employee.create({
        f_Name: name,
        f_Email: email,
        f_Mobile: mobile,
        f_Designation: designation,
        f_Gender: gender,
        f_Course: course,
        f_Image: req.file.filename,
        f_CreateDate: new Date(),
      });

      res.status(201).json({
        message: "Employee registered successfully!",
        employee: newEmployee,
      });
    } catch (error) {
      console.error("Error saving employee:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });
});

router.get("/employee", async (req, res) => {
  try {
    const employees = await Employee.findAll(); 
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


router.post("/delete", async (req, res) => {
  const { id } = req.body; 
  console.log("Delete Api backend")
  if (!id) {
    return res.status(400).json({ message: "Employee ID is required." });
  }

  try {
    const employee = await Employee.findOne({ where: { f_Id: id } });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }
    await Employee.destroy({ where: { f_Id: id } });
    res.status(200).json({ message: "Employee deleted successfully." });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});



router.post("/editEmployee/:f_Email", (req, res) => {
  console.log("Request Body:", req.body); 
  const { f_Email } = req.params; 

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { name, email, mobile, designation, gender, course } = req.body;
    const errors = {};
    if (!name) errors.name = "Name is required.";
    if (!email) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email format.";
    if (!mobile) errors.mobile = "Mobile number is required.";
    else if (!/^[0-9]+$/.test(mobile)) errors.mobile = "Mobile number must be numeric.";
    if (!designation) errors.designation = "Designation is required.";
    if (!gender) errors.gender = "Gender is required.";
    if (!course) errors.course = "Course is required.";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    try {
      const employee = await Employee.findOne({ where: { f_Email: f_Email } });
      if (!employee) {
        return res.status(404).json({ message: "Employee not found." });
      }
      if (f_Email !== email) {
        const existingEmployee = await Employee.findOne({
          where: { f_Email: email }
        });

        if (existingEmployee) {
          return res.status(400).json({ message: "New email already exists for another employee." });
        }
      }
      await Employee.update({
        f_Name: name,
        f_Email: email, 
        f_Mobile: mobile,
        f_Designation: designation,
        f_Gender: gender,
        f_Course: course,
        f_Image: req.file ? req.file.filename : employee.f_Image,
      }, {
        where: { f_Email: f_Email } 
      });

      res.status(200).json({ message: "Employee updated successfully!" });
    } catch (error) {
      console.error("Error saving employee:", error); 
      res.status(500).json({ message: "Internal server error.", error: error.message });
    }
  });
});

module.exports = router;

