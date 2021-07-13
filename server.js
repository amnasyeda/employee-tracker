const db = require('./db/connection');
const { startPrompt } = require('./lib/prompts');

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

db.connect(err => {
  if(err) throw err;
  console.log(`
  ======================================
  =                                    = 
  =  WELCOME TO THE EMPLOYEE TRACKER!  =
  =                                    =
  ======================================   
 `);
   startPrompt();
});