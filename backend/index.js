const express = require('express')
const mongoose = require("mongoose")
const dotenv = require('dotenv').config()
const cors = require('cors')
const authController = require('./controllers/authController')
const blogController = require('./controllers/blogController')
const multer = require('multer')
const app = express()

// connect db
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL, () => console.log('MongoDB has been started successfully'))

// routes
app.use('/images', express.static('public/images'))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/auth', authController)
app.use('/blog', blogController)

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://656af660c3408b2383eb203a--glowing-biscuit-05792b.netlify.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

// multer
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/images')
    },
    filename: function(req, file, cb){
        cb(null, req.body.filename)
    }
})

const upload = multer({
    storage: storage
})

app.post('/upload', upload.single("image"), async(req, res) => {
    return res.status(200).json({msg: "Successfully uploaded"})
})

// connect server
app.listen(process.env.PORT, () => console.log('Server has been started successfully'))