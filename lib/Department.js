const db = require('../db/connection');
const inquirer = require('inquirer');
const prompts = require('./prompts');

class Department {
    viewAllDepartments() {
      db.promise()
      .query(`SELECT * FROM department`)
      .then(([rows, fields]) => {
        console.table(`\n`, rows);
        prompts.startPrompt();
      })
      .catch(err => {
        console.log(err);
      })
    }
    
    addDepartment () {
      return inquirer
        .prompt ([
          {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department?',
            validate: nameInput => {
              if(nameInput) {
                  return true;
              } else {
                  console.log(`Please enter a valid department name!`);
                  return false;
              }
            }
          }
        ]).then(result => {
            db.promise()
            .query(`INSERT INTO department (dep_name)
                    VALUES (?)`, [result.departmentName])
            .then(([rows, fields]) => {
              if(rows.affectedRows === 0) {
                console.log('\n MESSAGE: Sorry! No changes were established, please try again. \n');
              } else {
                console.log(`\n MESSAGE: Success! ${result.departmentName} was added to your database. \n`);
              }
              prompts.startPrompt();
            })
          })
          .catch(err => {
            console.log(err);
          })
    }

    deleteDepartment() {
      return inquirer
        .prompt([
          {
            type: 'list',
            name: 'department',
            message: 'Please select a department to delete.',
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
            .query(`DELETE FROM department
                    WHERE id = ${result.department}`)
            .then(([rows, fields]) => {
              if(rows.affectedRows === 0) {
                console.log('\n MESSAGE: No changes were made. Please try again. \n');
              } else {
                console.log('\n MESSAGE: Success! The department has been deleted. \n');
              }
  
              prompts.startPrompt();
            })
            .catch(err => {
              console.log(err);
            })
        })
    }

    combinedSalaries () {
      db.promise()
            .query(`SELECT d.dep_name AS Department, COUNT(d.dep_name) AS EmployeeCount, SUM(r.salary) AS TotalSalary 
                    FROM employee AS e
                    LEFT JOIN roles AS r ON e.role_id = r.id 
                    LEFT JOIN department AS d ON d.id = r.department_id
                    GROUP BY d.dep_name`)
            .then(([rows, fields]) => {
              console.table(`\n`, rows);
              prompts.startPrompt();
            })
            .catch(err => {
              console.log(err);
            })
    }
  }
  
  module.exports = Department;