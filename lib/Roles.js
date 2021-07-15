const db = require('../db/connection');
const inquirer = require('inquirer');
const prompts = require('./prompts');

class Roles {

  viewAllRoles() {
    db.promise()
    .query(`SELECT r.id, r.title, d.dep_name AS department, r.salary
            FROM roles AS r
            LEFT JOIN department AS d
            ON d.id = r.department_id`)
    .then(([rows, fields]) => {
      console.table('\n', rows);
      prompts.startPrompt();
    })
    .catch(err => {
      console.log(err);
    })
  }
  
  addRole () {
    return inquirer
    .prompt ([
      {
        type: 'input',
        name: 'roleName',
        message: 'What is the role called?',
        validate: nameInput => {
          if(nameInput) {
              return true;
          } else {
              console.log(`   Please enter a valid role!`);
              return false;
          }
        }
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for this role?',
        validate: salaryInput => {
          if(salaryInput) {
              return true;
          } else {
              console.log(`   Please enter a valid salary!`);
              return false;
          }
        },
        filter(val) {
          return parseInt(val);
        }
      },
      {
        type: 'list',
        name: 'department',
        message: 'What is the deparment for this role?',
        choices: function() {
          return db.promise()
          .query(`SELECT * FROM department`)
          .then(([rows, fields]) => {
             return rows.map(el => `${el.id} : ${el.dep_name}`);
          })
        },
        filter(val) {
          return parseInt(val.match(/(\d+)/));
        }
      }
    ])
    .then(result => {
      db.promise()
        .query(`INSERT INTO roles (title, salary, department_id)
                VALUES (?, ?, ?)`, [result.roleName, result.salary, result.department])
        .then(([rows, fields]) => {
          if(rows.affectedRows === 0) {
            console.log('\n MESSAGE: Sorry! No changes were established, please try again. \n');
          } else {
            console.log(`\n MESSAGE: Success! ${result.roleName} was added to the database. \n`);
          }
          prompts.startPrompt();
        })
    })
    .catch(err => {
      console.log(err);
    })
  }
  updateRole() {
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'role',
          message: 'Please select a role to update!',
          choices: function() {
            return db.promise()
            .query(`SELECT * FROM roles`)
            .then(([rows, fields]) => {
               return rows.map(el => `${el.id} : ${el.title}`);
            })
          },
          filter(val) {
            return parseInt(val.match(/(\d+)/));
          }
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the salary of this role?',
          validate: salaryInput => {
            if(salaryInput) {
                return true;
            } else {
                console.log(`   Please enter a valid salary!`);
                return false;
            }
          },
          filter(val) {
            return parseInt(val);
          }
        },
        {
          type: 'list',
          name: 'department',
          message: 'What is the deparment of this role?',
          choices: function() {
            return db.promise()
            .query(`SELECT * FROM department`)
            .then(([rows, fields]) => {
               return rows.map(el => `${el.id} : ${el.dep_name}`);
            })
          },
          filter(val) {
            return parseInt(val.match(/(\d+)/));
          }
        }
      ])
      .then(result => {
        db.promise()
          .query(`UPDATE roles
                  SET salary = ${result.salary}, department_id = ${result.department}
                  WHERE id = ${result.role}`)
          .then(([rows, fields]) => {
            if(rows.affectedRows === 0) {
              console.log('\n MESSAGE: No changes were established, please try again. \n');
            } else {
              console.log("\n MESSAGE: Success! The role has been updated. \n");
            }
            prompts.startPrompt();
          })
          .catch(err => {
            console.log(err);
          })
      });
  }

  deleteRoles() {
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'role',
          message: 'Please choose a role to delete',
          choices: function() {
            return db.promise()
            .query(`SELECT * FROM roles`)
            .then(([rows, fields]) => {
               return rows.map(el => `${el.id} : ${el.title}`);
            })
          },
          filter(val) {
            return parseInt(val.match(/(\d+)/));
          }
        }
      ])
      .then(result => {
        db.promise()
          .query(`DELETE FROM roles
                  WHERE id = ${result.role}`)
          .then(([rows, fields]) => {
            if(rows.affectedRows === 0) {
              console.log('\n MESSAGE: No changes were established. Please reselect the ID. \n');
            } else {
              console.log('\n MESSAGE: Success! The role was deleted. \n');
            }
            prompts.startPrompt();
          })
          .catch(err => {
            console.log(err);
          })
      });
  }
}

module.exports = Roles;