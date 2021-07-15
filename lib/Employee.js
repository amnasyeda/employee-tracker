const db = require('../db/connection');
const inquirer = require('inquirer');
const prompts = require('./prompts');

class Employee {

  viewAllEmployees() {
    db.promise()
    .query(`SELECT e.id, e.first_name, e.last_name, r.title, d.dep_name , r.salary,  CONCAT(e2.first_name, ' ', e2.last_name ) AS Manager
            FROM employee AS e
            LEFT JOIN employee AS e2 ON e2.id = e.manager_id
            LEFT JOIN roles AS r ON e.role_id = r.id 
            LEFT JOIN department AS d ON d.id = r.department_id`)
    .then(([rows, fields]) => {
      console.table('\n', rows);
      prompts.startPrompt();
    })
    .catch(err => {
      console.log(err);
    })
  }

  viewEmployeesByManager() {
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'manager',
          message: 'Please select a manager',
          choices: function() {
            return db.promise()
            .query(`SELECT e.* FROM employee AS e WHERE e.manager_id is NULL`)
            .then(([rows, fields]) => {
               return rows.map(el => `${el.id} : ${el.first_name} ${el.last_name}`);
            })
          },
          filter(val) {
            return parseInt(val.match(/(\d+)/));
          }
        }
      ]).then(result => {
        db.promise()
          .query(`SELECT e.id, e.first_name, e.last_name, r.title, d.dep_name , r.salary,  CONCAT(e2.first_name, ' ', e2.last_name ) AS Manager
                  FROM employee AS e
                  INNER JOIN employee AS e2 ON e2.id = e.manager_id AND e.manager_id = ${result.manager}
                  LEFT JOIN roles AS r ON e.role_id = r.id 
                  LEFT JOIN department AS d ON d.id = r.department_id`)
          .then(([rows, fields]) => {
            console.table('\n', rows);
            prompts.startPrompt();
          })
          .catch(err => {
            console.log(err);
          })
      })
    
  }

  viewEmployeesByDepartment() {
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'department',
          message: 'Please select a department',
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
      ]).then(result => {
        db.promise()
        .query(`SELECT e.id, e.first_name, e.last_name, r.title, d.dep_name , r.salary,  CONCAT(e2.first_name,' ',e2.last_name ) AS Manager
                FROM employee AS e
                INNER JOIN employee AS e2 ON e2.id = e.manager_id
                INNER JOIN roles AS r ON e.role_id = r.id 
                INNER JOIN department AS d ON d.id = r.department_id AND r.department_id = ${result.department}`)
        .then(([rows, fields]) => {
          console.table('\n', rows);
          prompts.startPrompt();
        })
        .catch(err => {
          console.log(err);
    })
      })
  }

  addEmployee() {
    return inquirer
    .prompt ([
      {
        type: 'input',
        name: 'firstName',
        message: 'What is the first name of this employee?',
        validate: nameInput => {
          if(nameInput) {
              return true;
          } else {
              console.log(`   Please enter a valid name!`);
              return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'What is the last name of this employee?',
        validate: salaryInput => {
          if(salaryInput) {
              return true;
          } else {
              console.log(`   Please enter a valid name!`);
              return false;
          }
        }
      },
      {
        type: 'list',
        name: 'role',
        message: 'What is the role of this employee?',
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
        type: 'list',
        name: 'manager',
        message: 'Who is the manager of this employee?',
        choices: function() {
          return db.promise()
          .query(`SELECT e.* FROM employee AS e WHERE e.manager_id is NULL`)
          .then(([rows, fields]) => {
            let res;
            res = rows.map(el => `${el.id} : ${el.first_name} ${el.last_name}`);
            res.push('Employee has no manager.');
            return res;
          })
        },
        filter(val) {
          return val === 'Employee has no manager.' ? val = null : parseInt(val.match(/(\d+)/));
        }
      },

    ]).then(result => {
      db.promise()
      .query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
              VALUES (?, ?, ?, ?)`, [result.firstName, result.lastName, result.role, result.manager])
      .then(([rows, fields]) => {
        if(rows.affectedRows === 0) {
          console.log('\n MESSAGE: Sorry! No changes were established, please try again. \n');
        } else {
          console.log(`\n MESSAGE: Success! ${result.firstName} ${result.lastName} was added to the database \n`);
        }
        prompts.startPrompt();
      })
      .catch(err => {
        console.log(err);
      })
    })
  }

  deleteEmployee() {
    return inquirer
    .prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Please select an employee to delete.',
        choices: function() {
          return db.promise()
          .query(`SELECT * FROM employee`)
          .then(([rows, fields]) => {
             return rows.map(el => `${el.id} : ${el.first_name} ${el.last_name}`);
          })
        },
        filter(val) {
          return parseInt(val.match(/(\d+)/));
        }
      }
    ])
    .then(result => {
      db.promise()
        .query(`DELETE FROM employee
                WHERE id = ${result.employee}`)
        .then(([rows, fields]) => {
          if(rows.affectedRows === 0) {
            console.log('\n MESSAGE: No changes were made. Please reselect the ID of the employee. \n');
          } else {
            console.log('\n MESSAGE: Success! The employee was deleted. \n');
          }
          prompts.startPrompt();
        })
        .catch(err => {
          console.log(err);
        })
    })
  }

  updateEmployeeManager() {
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee',
          message: 'Please select an employee to update their manager.',
          choices: function() {
            return db.promise()
            .query(`SELECT * FROM employee`)
            .then(([rows, fields]) => {
               return rows.map(el => `${el.id} : ${el.first_name} ${el.last_name}`);
            })
          },
          filter(val) {
            return parseInt(val.match(/(\d+)/));
          }
        },
        {
          type: 'list',
          name: 'manager',
          message: 'Please select the new manager for this employee.',
          choices: function() {
            return db.promise()
            .query(`SELECT * FROM employee AS e WHERE e.manager_id IS NULL`)
            .then(([rows, fields]) => {
               return rows.map(el => `${el.id} : ${el.first_name} ${el.last_name}`);
            })
          },
          filter(val) {
            return parseInt(val.match(/(\d+)/));
          }
        }
      ]).then(result => {
        db.promise()
          .query(`UPDATE employee
                  SET manager_id = ${result.manager}
                  WHERE id = ${result.employee}`)
          .then(([rows, fields]) => {
            if(rows.affectedRows === 0) {
              console.log('\n MESSAGE: No changes were established, Please reselect the ID of the employee. \n');
            } else {
              console.log("\n MESSAGE: Success! The employee's manager has been updated. \n");
            }
            prompts.startPrompt();
          })
          .catch(err => {
            console.log(err);
          })
        })
  }

  updateEmployeeRole () {
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee',
          message: 'Please select an employee to update the manager.',
          choices: function() {
            return db.promise()
            .query(`SELECT * FROM employee`)
            .then(([rows, fields]) => {
               return rows.map(el => `${el.id} : ${el.first_name} ${el.last_name}`);
            })
          },
          filter(val) {
            return parseInt(val.match(/(\d+)/));
          }
        },
        {
          type: 'list',
          name: 'role',
          message: 'What is the role of the employee?',
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
          .query(`UPDATE employee
                  SET role_id = ${result.role}
                  WHERE id = ${result.employee}`)
          .then(([rows, fields]) => {
            if(rows.affectedRows === 0) {
              console.log('\n MESSAGE: No changes were made. \n');
            } else {
              console.log("\n MESSAGE: Success! The employee's role has been updated. \n");
            }
            prompts.startPrompt();
          })
          .catch(err => {
            console.log(err);
          })
      })
  }
}

module.exports = Employee;