const express = require('express');
const mysql = require('mysql2');
const mysql2 = require('mysql');
const app = express();
const cors = require('cors')
const session = require('express-session')
const cookieparser = require('cookie-parser')
const bodyparser = require('body-parser')
const multer = require('multer');
const path = require('path')
const Jimp = require('jimp');
const fs = require('fs')
const SharpMulter = require("sharp-multer");
const sharp = require('sharp');
const http = require('http');
app.use(express.static('./public'))
app.use(bodyparser.json())
app.use(express.json())

// app.use(cors({
//     origin:["http://localhost:3000"],
//     methods:["POST","GET","DELETE","PUT"],
//     credentials: true
    
// }))
app.use(cors());
app.use('/thumbnails', express.static('../frontend/src/thumbnails'));
app.use('/images', express.static('../frontend/src/images'));
app.use(cookieparser())
app.use(bodyparser.json())
app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false,
    cookie:{
        secure: false,
        maxAge: 1000*60*60*24
    }
}))



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specified HTTP methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    next();
  });

let directoryname = '../frontend/src/images'
const thumbnailDirectory = '../frontend/src/thumbnails';

var test = []
var thumbnailtest = []
let thumbnailimages = ''
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${directoryname}`);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
      test.push(file);
    },
  });
  
  let thumbnailStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${thumbnailDirectory}`);
    },
    filename: (req, file, cb) => {
      cb(null, 'thumbnail_' + file.originalname);
      thumbnailtest.push(file.originalname)
      console.log(thumbnailtest)
    },
  });
  




  let maxSize = 2 * 1000 * 1000;
  let upload = multer({
    storage: storage,
    limits: {
      fileSize: maxSize,
    },
  });
  
  let thumbnailUpload = multer({
    storage: thumbnailStorage,
    limits: {
      fileSize: maxSize,
    },
  });


  let uploadHandler = upload.array('file');
  let thumbnailUploadHandler = thumbnailUpload.array('file');
  let array = [];
  
  app.post('/upload', (req, res) => {
    uploadHandler(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: "Maximum file size is 2mb." });
        }
        return res.status(500).json({ message: "Error uploading file." });
      }
  
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No file!" });
      }
  
      array.push(...req.files.map((file) => file.filename));
      res.status(200).json({ message: "Uploaded to the Server!" });
  
      req.files.forEach((file) => {
        const imagePath = file.path;
        const thumbnailPath = path.join(thumbnailDirectory, 'thumbnail_' + file.filename);
        thumbnailtest.push('thumbnail_'+file.filename)
  
        sharp(imagePath)
          .resize(30, 40)
          .toFile(thumbnailPath, (err, info) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ message: "Error saving thumbnail." });
            }
  
            console.log('Thumbnail saved successfully at:', thumbnailPath);
          });
      });
    });
  });
  
  app.post('/uploadThumbnail', (req, res) => {
    thumbnailUploadHandler(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: "Maximum file size is 2mb." });
        }
        return res.status(500).json({ message: "Error uploading file." });
      }
  
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No file!" });
      }
  
      array.push(...req.files.map((file) => file.filename));
      res.status(200).json({ message: "Uploaded thumbnail to the Server!" });
    });
  });



app.get('/getimages',(req,res)=>{
    const directoryPath = "../frontend/src/images/";
  
    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        res.status(500).send({
          message: "Unable to scan files!",
        });
      }
  
      let fileInfos = [];
      files.forEach((file) => {
        fileInfos.push({
          name: file,
          url:  file,
        });
      });
  
      res.status(200).send(fileInfos);
    });
})






const db = mysql.createConnection({
    host:"localhost",
    user:'root',
    password:"1234",
    database:'employeemanagement'
})






//login code
app.post('/login', (req, res) => {
  const query = 'SELECT * FROM user WHERE mobilenumber = ? AND password = ?';

  db.query(query, [req.body.number, req.body.password], (err, data) => {
    if (err) {
      return res.json(err);
    }
    if (data.length > 0) {
      if (data[0].userstatus === 'disable') {
        return res.json({ Login: false, message: 'User account is disabled' });
      }
      req.session.user = data[0]; // Store the user data in the session
      db.query('SELECT * FROM user WHERE mobilenumber = ?', [req.body.number], (err, allData) => {
        if (err) {
          return res.json(err);
        }
        return res.json({ Login: true, data: allData });
      });
    } else {
      return res.json({ Login: false, message: 'Wrong number or password' });
    }
  });
});

app.get('/checkLoggedIn', (req, res) => {
  if (req.session.user) {
    return res.json({ loggedIn: true, username: req.session.user.username });
  } else {
    return res.json({ loggedIn: false });
  }
});









  //addtasks
let images =''
app.post('/addtasks', (req, res) => {
  const imagesJson = JSON.stringify(test.map((file) => file.originalname));
  const thumbnailImagesJson = JSON.stringify(thumbnailtest);

  const {
    id,
    jobid,
    employeeusername,
    jobname,
    machinename,
    status,
    quantity,
    date,
    time,
  } = req.body;

  // Create the 'tasks' table if it doesn't exist
  const createTasksTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT PRIMARY KEY,
      jobid INT,
      username VARCHAR(255),
      jobname VARCHAR(255),
      machinename VARCHAR(255),
      status VARCHAR(255),
      quantity INT,
      date DATE,
      time VARCHAR(255),
      images JSON,
      thumbnailimages JSON
    )
  `;

  db.query(createTasksTableQuery, (err) => {
    if (err) {
      console.error("Failed to create 'tasks' table", err);
      return res.status(500).json({ message: 'Failed to add task' });
    }
   
    const insertTaskQuery = `
      INSERT INTO tasks (id, jobid, username, jobname, machinename, status, quantity, date, time, images, thumbnailimages)
      VALUES ('${id}', '${jobid}', '${employeeusername}', '${jobname}', '${machinename}', '${status}', '${quantity}', '${date}', '${time}', '${imagesJson}', '${thumbnailImagesJson}')
    `;

    setTimeout(() => {
      
    }, 100);
    db.query(insertTaskQuery, (err) => {
      if (err) {
        console.error("Failed to add task", err);
        return res.status(500).json({ message: 'Failed to add task' });
      }

      res.status(200).json({ message: 'Task added successfully' });

      test = [];
      thumbnailtest = [];
    });
  });
});






app.get('/getoriginalimages/:id', (req, res) => {
    const id = req.params.id;
    const q = 'SELECT images FROM tasks WHERE id=?';
    db.query(q, [id], (err, data) => {
      if (err) {
        return res.json(err);
      }
      return res.json(data);
    });
    
  });



app.get('/getusertasks/:empusername',(req,res)=>{
    const username = req.params.empusername;
    
    
    const q = "select *from tasks where username=?";
    db.query(q,[username],(err,data)=>{
        if(err){
            return res.json(err)
        }
        return res.json(data)
    })
})


app.get('/getallusertasks',(req,res)=>{
    const username = req.params.empusername;
    
    
    const q = "select *from tasks";
    db.query(q,[username],(err,data)=>{
        if(err){
            return res.json(err)
        }
        return res.json(data)
    })
})



//task status options get
app.get('/getdropdownlists/:dropdownname/:status',(req,res)=>{
    
    const dropdownstatus = req.params.status
    const dropdownname = req.params.dropdownname
    const q = "select *from dropdownconfiguration where dropdownname=? and dropdownstatus=?";
    db.query(q,[dropdownname,dropdownstatus],(err,data)=>{
        if(err){
            console.log(err)
        }
        return res.json(data)
    })
})


//select jobname dropdown

app.get('/getjobdropdown/:dropdownname/:status',(req,res)=>{
    
    const dropdownstatus = req.params.status
    const dropdownname = req.params.dropdownname
    const q = "select *from dropdownconfiguration where dropdownname=? and dropdownstatus=?";
    db.query(q,[dropdownname,dropdownstatus],(err,data)=>{
        if(err){
            console.log(err)
        }
        return res.json(data)
    })
})

//select machine name dropdown

app.get('/getmachinename/:dropdownname/:status',(req,res)=>{
    
    const dropdownstatus = req.params.status
    const dropdownname = req.params.dropdownname
    const q = "select *from dropdownconfiguration where dropdownname=? and dropdownstatus=?";
    db.query(q,[dropdownname,dropdownstatus],(err,data)=>{
        if(err){
            console.log(err)
        }
        return res.json(data)
    })
})



//Add Users

app.get('/users', (req, res) => {
  const query = 'SELECT * FROM user';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Failed to get users:', err);
      res.status(500).json({ error: 'Failed to get users' });
      return;
    }
    res.json(result);
  });
});

// Add new user
app.post('/users', (req, res) => {
  const {id, name, username, mobilenumber, password,userstatus } = req.body;
  const query = 'INSERT INTO user (id,name, username, mobilenumber, password,userstatus) VALUES (?,?, ?, ?, ?,?)';
  db.query(query, [id,name, username, mobilenumber, password,userstatus], (err, result) => {
    if (err) {
      console.error('Failed to add user:', err);
      res.status(500).json({ error: 'Failed to add user' });
      return;
    }
    res.json({ message: 'User added successfully' });
  });
});

// Update user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, username, mobilenumber, password,userstatus } = req.body;
  const query = 'UPDATE user SET name = ?, username = ?, mobilenumber = ?, password = ?,userstatus=? WHERE id = ?';
  db.query(query, [name, username, mobilenumber, password,userstatus, id], (err, result) => {
    if (err) {
      console.error('Failed to update user:', err);
      res.status(500).json({ error: 'Failed to update user' });
      return;
    }
    res.json({ message: 'User updated successfully' });
  });
});

// Delete user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM user WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Failed to delete user:', err);
      res.status(500).json({ error: 'Failed to delete user' });
      return;
    }
    res.json({ message: 'User deleted successfully' });
  });
});






//codes for machinesdetails crud
app.get('/dropdownconfigurations', (req, res) => {
  db.query('SELECT * FROM dropdownconfiguration', (error, results) => {
    if (error) {
      console.error('Error fetching dropdown configurations:', error);
      res.status(500).json({ error: 'Failed to fetch dropdown configurations' });
      return;
    }
    res.json(results);
  });
});

// Create a new dropdown configuration
app.post('/dropdownconfigurations', (req, res) => {
  const { id, dropdownname, value, dropdownstatus } = req.body;
  const query = 'INSERT INTO dropdownconfiguration (id, dropdownname, value, dropdownstatus) VALUES (?, ?, ?, ?)';
  db.query(query, [id, dropdownname, value, dropdownstatus], (error) => {
    if (error) {
      console.error('Error creating dropdown configuration:', error);
      res.status(500).json({ error: 'Failed to create dropdown configuration' });
      return;
    }
    res.sendStatus(201);
  });
});

// Update a dropdown configuration
app.put('/dropdownconfigurations/:id', (req, res) => {
  const { dropdownname, value, dropdownstatus } = req.body;
  const { id } = req.params;
  const query = 'UPDATE dropdownconfiguration SET dropdownname = ?, value = ?, dropdownstatus = ? WHERE id = ?';
  db.query(query, [dropdownname, value, dropdownstatus, id], (error) => {
    if (error) {
      console.error('Error updating dropdown configuration:', error);
      res.status(500).json({ error: 'Failed to update dropdown configuration' });
      return;
    }
    res.sendStatus(200);
  });
});

// Delete a dropdown configuration
app.delete('/dropdownconfigurations/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM dropdownconfiguration WHERE id = ?';
  db.query(query, [id], (error) => {
    if (error) {
      console.error('Error deleting dropdown configuration:', error);
      res.status(500).json({ error: 'Failed to delete dropdown configuration' });
      return;
    }
    res.sendStatus(200);
  });
});
















app.listen(8800,()=>{
    console.log('connected backend')
})