const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require('util');
// require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "employee_tracker",
});
connection.queryPromise = util.promisify(connection.query);

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  init();
});

function init() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        choices: [
          "add department",
          "add roles",
          "add employees",
          "view departments",
          "view roles",
          "view employees",
          "update employee roles",
        ],
        message: "What would you like to do?",
      },
    ])
    .then(function (answers) {
      if (answers.choice === "add department") {
        addDepartment();
      }

      if (answers.choice === 'add roles') {
          addRole();
      }
    });
}

function addDepartment() {
  inquirer.prompt({
    type: "input",
    message: "What is your department name?",
    name: "departmentName",
  }).then(function (answers) {
    connection.query("INSERT INTO department (name) VALUES (?);", [answers.departmentName], function(err, res) {
        if (err) throw err;
    })
    init();
    // take the answer
    // save into the database using connection.query
    // go back to init after the department was created
  })
}


async function addRole() {
    // reading from the departments table
    let departments = await connection.queryPromise('SELECT * FROM department');

    // change to work with inquirer
    departments = departments.map(function(department) {
        return {
            name: department.name,
            value: department.id
        };
    });

    inquirer.prompt([
        {
            name: 'title',
            message: 'Enter the title: ',
            type: 'input',
        },
        {
            name: 'departmentId',
            message: 'Select the department',
            type: 'list',
            choices: departments
        },
    ]).then(function(answers) {
        console.log(answers);
    })

    // ask fortitle, salary, and department
}
