const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const port = 3000;
app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

var uName;
app.get('/', (req, res) => {
  uName = req.query.uName;
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post("/", function(req,res){
  const inputData = req.body.data;
  let botResponse = ''; 
  let responseSent = false; 

  const pythonProcess = spawn('python', ['-W', 'ignore', 'main.py', inputData, uName]);

  pythonProcess.stdout.on('data', (data) => {
    botResponse += data.toString().trim();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error from Python script: ${data}`);
    if (!responseSent) {
      res.status(500).json({ error: 'Internal Server Error' });
      responseSent = true;
    }
  });

  pythonProcess.once('close', () => {
    if (!responseSent) {
      res.json({ response: botResponse });
      responseSent = true;
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
