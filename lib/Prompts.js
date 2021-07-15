const db = require('../db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

const Employee = require('./Employee');
const Roles = require('./Roles');
const Department = require('./Department');

const employee = new Employee;
const department = new Department;
const roles = new Roles;

function startPrompt() {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'task',
        message: 'Please select purpose:',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add department',
          'Add role',
          'Add employee',
          'Update employee role',
          'Update employee manager',
          'View employees by manager',
          'View employees by department',
          'Delete a departement',
          'Delete a role',
          'Delete an employee',
          'Exit & Close Database'
        ]
      }
    ])
    .then(choice => {
      switch (choice.task) {
        case 'View all employees' : 
          employee.viewAllEmployees();
          break;

        case 'View all departments' : 
          department.viewAllDepartments();
          break;

        case 'View all roles' : 
          roles.viewAllRoles();
          break;

        case 'Add department' : 
          department.addDepartment();
          break;

        case 'Add role' : 
          roles.addRole();
          break;

        case 'Add employee' : 
          employee.addEmployee();
          break;

        case 'Update employee role': 
          employee.updateEmployeeRole();
          break;

        case 'Update employee manager': 
          employee.updateEmployeeManager();
          break;

        case 'Update a role': 
          roles.updateRole();
          break;

        case 'View employees by manager': 
          employee.viewEmployeesByManager();
          break;

        case 'View employees by department': 
          employee.viewEmployeesByDepartment();
          break;

        case 'Delete a departement': 
          department.deleteDepartment();
          break;

        case 'Delete a role': 
          roles.deleteRoles();
          break;

        case 'Delete an employee': 
          employee.deleteEmployee();
          break;

        case 'Combined employee salaries by department': 
          department.combinedSalaries();
          break;

        default : 
          db.end((err) => {
            if (err) {
              return console.log({ Message: `${err}`});
            }
          
            console.log(
      `Thank you`
            );
          });
          break;
      }
    })
}

exports.startPrompt = startPrompt;