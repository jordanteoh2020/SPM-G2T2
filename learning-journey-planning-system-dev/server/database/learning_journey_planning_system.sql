DROP SCHEMA IF EXISTS learning_journey_planning_system;
CREATE SCHEMA learning_journey_planning_system;
USE learning_journey_planning_system;


DROP TABLE IF EXISTS role;
CREATE TABLE IF NOT EXISTS role (
role_id int NOT NULL AUTO_INCREMENT,
role_name varchar(50) NOT NULL,
PRIMARY KEY (role_id)
);


DROP TABLE IF EXISTS staff;
CREATE TABLE IF NOT EXISTS staff (
staff_id int NOT NULL AUTO_INCREMENT,
staff_fname varchar(50) NOT NULL,
staff_lname varchar(50) NOT NULL,
dept varchar(50) NOT NULL,
email varchar(50) NOT NULL,
role_id int NOT NULL,
FOREIGN KEY (role_id) REFERENCES role (role_id),
PRIMARY KEY (staff_id)
);


DROP TABLE IF EXISTS position;
CREATE TABLE IF NOT EXISTS position (
position_id int NOT NULL auto_increment,
position_name varchar(50) NOT NULL,
position_desc varchar(255) NOT NULL,
position_dept varchar(20) NOT NULL,
position_res varchar(1000) NOT NULL,
position_status varchar(10) NOT NULL,
PRIMARY KEY (position_id)
);


DROP TABLE IF EXISTS skill;
CREATE TABLE IF NOT EXISTS skill (
skill_id int NOT NULL auto_increment,
skill_name varchar(50) NOT NULL,
skill_desc varchar(255) NOT NULL,
skill_status varchar(10) NOT NULL,
PRIMARY KEY (skill_id)
);


DROP TABLE IF EXISTS position_skill;
CREATE TABLE IF NOT EXISTS position_skill (
position_id int NOT NULL,
skill_id int NOT NULL,
FOREIGN KEY (position_id) REFERENCES position (position_id),
FOREIGN KEY (skill_id) REFERENCES skill (skill_id),
PRIMARY KEY (position_id, skill_id)
);


DROP TABLE IF EXISTS course;
CREATE TABLE IF NOT EXISTS course (
course_id varchar(20) NOT NULL,
course_name varchar(50) NOT NULL,
course_desc varchar(255) NOT NULL,
course_status varchar(15) NOT NULL,
course_type varchar(10) NOT NULL,
course_category varchar(50) NOT NULL,
PRIMARY KEY (course_id)
);


DROP TABLE IF EXISTS skill_course;
CREATE TABLE IF NOT EXISTS skill_course (
skill_id int NOT NULL,
course_id varchar(20) NOT NULL,
FOREIGN KEY (skill_id) REFERENCES skill (skill_id),
FOREIGN KEY (course_id) REFERENCES course (course_id),
PRIMARY KEY (skill_id, course_id)
);


DROP TABLE IF EXISTS staff_skill;
CREATE TABLE IF NOT EXISTS staff_skill (
staff_id int NOT NULL,
skill_id int NOT NULL,
FOREIGN KEY (staff_id) REFERENCES staff (staff_id),
FOREIGN KEY (skill_id) REFERENCES skill (skill_id),
PRIMARY KEY (staff_id, skill_id)
);


DROP TABLE IF EXISTS learning_journey;
CREATE TABLE IF NOT EXISTS learning_journey (
lj_id int NOT NULL,
staff_id int NOT NULL,
position_id int NOT NULL,
skill_id int NOT NULL,
course_id varchar(20) NOT NULL,
FOREIGN KEY (staff_id) REFERENCES staff (staff_id),
FOREIGN KEY (position_id) REFERENCES position (position_id),
FOREIGN KEY (skill_id) REFERENCES skill (skill_id),
FOREIGN KEY (course_id) REFERENCES course (course_id),
PRIMARY KEY (lj_id, skill_id, course_id)
);