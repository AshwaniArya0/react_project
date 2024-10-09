const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/Login');
const multer = require('multer'); 
const path = require('path');
const fs = require('fs');
const app = express();
const db = require("./models")
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


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

app.use('/api/auth', authRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


db.sequelize.sync().then( () => {
  app.listen( PORT, () => {
    console.log("Server running on port ", PORT)
  })
})


