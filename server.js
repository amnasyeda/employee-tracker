const db = require('./db/connection');
const { startPrompt } = require('./lib/prompts');

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