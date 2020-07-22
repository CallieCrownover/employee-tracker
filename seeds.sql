
USE employee_trackerDB;

INSERT INTO department (name)
VALUES ("Engineering"),  ("Sales"), ("Design Department");

INSERT INTO role (title, salary, department_id)
VALUES ("manager", 100000,1), ("employee", 65000,1);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Daphne", "Moon",1,NULL), ("John", "Doe",2,1);

