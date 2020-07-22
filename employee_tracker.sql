DROP DATABASE employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department (
id INT NOT NULL, auto_increment,
name VARCHAR(30) NOT NULL,
primary key (id)
);

CREATE TABLE role (
id INT NOT NULL, auto_increment,
title VARCHAR(30), NOT NULL,
salary DECIMAL(10,5), NOT NULL,
department_id INT, NOT NULL,
primary key (id)
);

CREATE TABLE employee (
id INT NOT NULL, auto_increment,
first_name VARCHAR(30), NOT NULL,
last_name VARCHAR(30), NOT NULL,
role_id INT, NOT NULL,
manager_id INT, NOT NULL,
primary key(id)
);



USE employee_tracker;
SELECT * FROM department;