const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");

require("console.table");
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
          "view employees",
          "view departments",
          "view roles",
          "add employees",
          "add department",
          "add roles",
          "update employee roles",
        ],
        message: "What would you like to do?",
      },
    ])
    .then(function (answers) {
      if (answers.choice === "add department") {
        addDepartment();
      }

      if (answers.choice === "add roles") {
        addRole();
      }

      if (answers.choice === "add employees") {
        addEmployees();
      }

      if (answers.choice === "view departments") {
        viewDepartments();
      }

      if (answers.choice === "view roles") {
        viewRoles();
      }

      if (answers.choice === "view employees") {
        viewEmployees();
      }

      if (answers.choice === "update employee roles") {
        updateEmployeeRoles();
      }
    });
}

function viewDepartments() {
  console.log("retrieving department from database");
  connection.query("SELECT * FROM department", function (err, answer) {
    console.log("\n Departments retrieved from Database \n");
    console.table(answer);
  });
  init();
}

// allows user to view all employees currently in the database
function viewEmployees() {
  console.log("retrieving employess from database");
  var fancyQuery =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id;";
  connection.query(fancyQuery, function (err, answer) {
    console.log("\n Employees retrieved from Database \n");
    console.table(answer);
  });
  init();
}

// allows user to view all employee roles currently in the database
function viewRoles() {
  connection.query("SELECT * FROM role", function (err, answer) {
    console.log("\n Roles Retrieved from Database \n");
    console.table(answer);
  });
  init();
}



function addDepartment() {
  let deptArray = [];
  connection.query("SELECT * FROM department", function(err,res){
    if (err) throw err;
    for (let i=0; i < res.length; i++){
      let currentDept = {name: res[i].name}
      deptArray.push(currentDept);
    }
  inquirer
    .prompt({
      type: "list",
      message: "What is your department name?",
      choices: deptArray,
      name: "departmentName",
    })
    .then(function (answers) {
      connection.query(
        "INSERT INTO department (name) VALUES (?);",
        [answers.departmentName],
        function (err, res) {
          if (err) throw err;
          // console.log("successfully added!")
        }
      );
      init();
      // take the answer
      // save into the database using connection.query
      // go back to init after the department was created
      })
    })
}

async function addRole() {
  // reading from the departments table
  let departments = await connection.queryPromise("SELECT * FROM department");

  // change to work with inquirer
  departments = departments.map(function (department) {
    return {
      name: department.name,
      value: department.id,
    };
  });

  inquirer
    .prompt([
      {
        name: "title",
        message: "Enter the title: ",
        type: "input",
      },
      {
        name: "salary",
        message: "Enter the salary pay: ",
        type: "input",
      },
      {
        name: "departmentId",
        message: "Select the department",
        type: "list",
        choices: departments,
      },
    ])
    .then(function (answers) {
      console.log(answers);
      init();
    });
    
  // ask fortitle, salary, and department
}

function addEmployees() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter employee first name",
        name: "firstname",
      },
      {
        type: "input",
        message: "Enter employee last name",
        name: "lastname",
      },
      {
        type: "input",
        message: "Enter employee's role ID",
        name: "roleID",
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.firstname,
          last_name: answer.lastname,
          role_id: answer.roleID,
          manager_id: null,
        },
        function (err, answer) {
          if (err) {
            throw err;
          }
          console.table(answer);
          console.log("employee added!");
          init();
        }
      );
    });
}



// grabs all employees (id, first name, last name) and then allows user to select employee to update role
function updateEmployeeRoles() {
  let allEmployees = [];
  connection.query("SELECT * FROM employee", function (err, answer) {
    // console.log(answer);
    for (let i = 0; i < answer.length; i++) {
      let employeeString =
        answer[i].id + " " + answer[i].first_name + " " + answer[i].last_name + " " + answer[i].role_id + " " + answer[i].manager_id;
      allEmployees.push(employeeString);
    }
    // console.log(allEmployees)

    inquirer
      .prompt([
        {
          type: "list",
          name: "updateEmployeeRole",
          message: "select employee to update role",
          choices: allEmployees,
        },
        {
          type: "list",
          message: "select new role",
          choices: ["manager", "employee"],
          name: "newRole",
        },
      ])
      .then(function (answer) {
        console.log("about to update", answer);
        const idToUpdate = {};
        idToUpdate.employeeId = parseInt(
          answer.updateEmployeeRole.split(" ")[0]
        );
        if (answer.newRole === "manager") {
          idToUpdate.role_id = 1;
        } else if (answer.newRole === "employee") {
          idToUpdate.role_id = 2;
        }
        connection.query(
          "UPDATE employee SET role_id = ? WHERE id = ?",
          [idToUpdate.role_id, idToUpdate.employeeId],
          function (err, data) {
            init();
          }
        );
      });
  });
}
