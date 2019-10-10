const express = require('express');
var multer = require('multer');
// const puppeteer = require('puppeteer');
// const https = require('https');
const axios = require('axios');
var FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch') ;
const { URLSearchParams } = require('url');


const port = 8080 || process.env.port;
var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

// const params = new URLSearchParams();
// const FormData = require('form-data');     

app.get('/print/:id', (req, res) => {
  var wstream = fs.createWriteStream('file.stl');

  fetch('http://www.embossify.com/v/' + req.params.id + '')
  .then( dt => dt.buffer() )
  .then(data => {
    wstream.write(data);
    wstream.end();
    console.log('stl created');
  });

  var params = new FormData();
  const buffer = fs.createReadStream('file.stl');
  const fileName = 'file.stl'
  
  // params.append('file', );
  params.append('file', buffer, {
    contentType: 'file/stl',
    name: 'file',
    filename: fileName,
  });

  fetch('http://192.168.2.77/api/files/local', {
    method: 'POST',
    body: params,
    Headers: {
      'X-Api-Key': 'DEE61047043B47F3A9DEA0F145430E6E',
    }
  })
  // .then(data => data.json())
  .then(data => res.send(data))
  .catch(err => res.send(err));
})

app.get('/dl/:id', (req, res) => {
  console.log("hello") ;

  var wstream = fs.createWriteStream('file.stl');

  fetch('http://www.embossify.com/v/' + req.params.id + '')
  .then( dt => dt.buffer() )
  .then(data => {
    wstream.write(data);
    wstream.end();
  }) ;
  // res.sendFile(`${process.cwd()}/file.stl`);
  // res.sendFile(`${process.cwd()}/Mouse.stl`);
  res.sendFile(`${process.cwd()}/Dolphin.stl`);
})

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '')
  },
  filename: (req, file, cb) => {
    console.log(file.filename);
    cb(null, 'file.jpg')
  }
});
var upload = multer({storage: storage});



app.get('/', (req, res) => {
  console.log('hello');
  res.send('hello world');
})

app.post('/set', upload.single('file') , (req, res) => {
// console.log(req)
  // var originalFileName = req.file.originalname
  // console.log(originalFileName)
  console.log("data upload")
  console.log(req);
  let base64String = req.body.file;
  // Remove header
  let base64Image = base64String.split(';base64,').pop();
  fs.writeFile('file.jpg', base64Image, {encoding: 'base64'}, (err) => {
      console.log('image created');
  });

  const params = new FormData();

  const buffer = fs.createReadStream('file.jpg');
  const fileName = 'file.jpg'
  
  // params.append('file', );
  params.append('file', buffer, {
    contentType: 'image/jpeg',
    name: 'file',
    filename: fileName,
  });
  params.append('mode', 1);
  params.append('targetWidth', 120);
  params.append('targetDepth', 5);
  
  // console.log('params.file');
  
  fetch('http://www.embossify.com/build', { 
    method: 'POST', 
    body: params
  })
  .then( data => {
      console.log(data);
      return data.json()
    })
  .then( data => {
    // console.log(data);
    res.send(data.bid)
    console.log(data.bid) ;
  })
  .catch(err => res.send(err));  
});

app.post('/android/set' ,upload.single('file'), (req, res) => {
  // console.log(req)
  var originalFileName = req.file.originalname
  console.log(originalFileName)
  console.log("data upload")

  if (originalFileName == 'sp3.jpeg' || originalFileName == 'sp3.jpg'){
    res.sendFile(`${process.cwd()}/sp3_hrany.stl`);
  }

  if (originalFileName == 'sp3d.jpeg' || originalFileName == 'sp3d.jpg'){
    res.sendFile(`${process.cwd()}/sp3d_EP_eq.stl`);
  }

  if (originalFileName == 'benzene.jpeg' || originalFileName == 'benzene.jpg'){
    res.sendFile(`${process.cwd()}/benzen-final-sup.stl`);
  }

  if (originalFileName == 'disk.jpeg' || originalFileName == 'disk.jpg'){
    res.sendFile(`${process.cwd()}/Disco_de_freno.stl`);
  }

  if (originalFileName == 'lungs.jpeg' || originalFileName == 'lungs.jpg'){
    res.sendFile(`${process.cwd()}/Lungs.stl`);
  }

  if (originalFileName == 'brain.jpeg' || originalFileName == 'brain.jpg'){
    res.sendFile(`${process.cwd()}/Brain.stl`);
  }

  if (originalFileName == 'heart.jpeg' || originalFileName == 'heart.jpg'){
    res.sendFile(`${process.cwd()}/Heart.stl`);
  }

  if (originalFileName == 'mole.jpeg' || originalFileName == 'mole.jpg'){
    res.sendFile(`${process.cwd()}/Mole.stl`);
  }

  const params = new FormData();

  const buffer = fs.createReadStream('file.jpg');
  const fileName = 'file.jpg'
  
  // params.append('file', );
  params.append('file', buffer, {
    contentType: 'image/jpeg',
    name: 'file',
    filename: fileName,
  });
  params.append('mode', 1);
  params.append('targetWidth', 120);
  params.append('targetDepth', 5);
  
  // console.log('params.file');
  
  fetch('http://www.embossify.com/build', { 
    method: 'POST', 
    body: params
  })
  .then( data => {
      // console.log(data);
      return data.json()
    })
  .then( data => {
    // console.log(data);
    res.send(data.bid)
    console.log(data.bid) ;
  })
  .catch(err => res.send(err));
});

app.listen('8080', () => {
    console.log('server listening on ' + port)
})
