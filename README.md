<h2 align='center'>📚 💻 All-in-One Learning Journey Planning System 📚 💻 </h2>

## Description:
A Learning Journey Planning System to complement the existing Learning Management System for All-In-One Printing Solution Equipment Servicing Company.

## Product Goal for the First Release:
Provide direction for staff to reach their career aspirations within the company, and allow them to plan their learning journey and track their progress.

## Development Team:

| Name  | Email |
| ------------- | ------------- |
| GOH SOON HAO  | soonhao.goh.2020@scis.smu.edu.sg |
| JETHRO ONG YONG EN | jethro.ong.2020@scis.smu.edu.sg |
| JOEY LAU RUN-QI | joeylau.2020@scis.smu.edu.sg | 
| SHAO ZIHANG  | zihang.shao.2020@scis.smu.edu.sg |
| TEOH CHIN HAO JORDAN  | jordan.teoh.2020@scis.smu.edu.sg |
| WANG ZHIJIE  | zhijie.wang.2020@scis.smu.edu.sg |


## Set Up Guide
1. Clone the repository 
2. Create a ```.env``` file under Server folder and place the database password* in the file
3. Create a new SQL connection to access data in the database <br/>
  ```
     hostname: learning-journey-planning-system.czgju3uctwbf.ap-southeast-1.rds.amazonaws.com
     username: admin
     port: 3306
     password: 
  ```
  
**Password is submitted in the .zip file*

## Installation Guide 
1. Navigate to Front-End Folder - At the root directory, type ```cd client``` and <br/>
  1.1. ```npm install``` <br/>
  1.2. ```npm install cypress``` <br/>
2. Navigate to Back-End Folder - At the root directory, type ```cd server``` and<br/>
  2.1. ```pip install Flask``` <br/>
  2.2. ``` pip install flask-sqlalchemy```  <br/>
  2.3. ``` pip install Flask-Cors```  <br/>
  2.4. ``` pip install mysql-connector``` <br/>
  2.5. ```pip install python-dotenv``` <br/>
  
 ## How to Run the Application?
 1. Run the Client (Front-End) <br/>
  1.1. At the root directory, type ```cd client``` and ```npm run start``` in the terminal
 2. Run the Server (Back-End) <br/>
  2.1. At the root directory, type ```cd server``` and ```python main.py``` in the terminal

 ## How to Test the Front-End of the Application?
 1. At the root directory, type ```cd client``` and <br/>
  1.1. ```npx cypress open``` to open Cypress <br/>
  1.2. In the window, click *"E2E Testing"* <br/>
  1.3. Next, select *"Chrome"* as preferred browser for E2E Testing <br/>
  1.4. Modify the ```spec.cy.ts``` file with a line break <br/>
  1.5. In the window, click on *"spec"* <br/>
  1.6. Watch the execution of the E2E Test <br/>
  1.7. ```npx cypress run``` to verify if the tests have passed in the terminal

 
 ## How to Test the Back-End of the Application?
 1. In your Visual Studio Code, click on *"Testing"* on the Activity Bar
 2. Next, click on *"Configure Python Tests"*
 3. From the prompt, select *"[unittest] Standard Python test framework"*
 4. From the prompt, select *"[.] Root directory"*
 5. From the prompt, select *"[*_test.py] Python files ending with ‘_test’"*
 6. The testing panel on the left should populate all the unit tests discovered in the repository
 7. From the context menu, choose *“Run tests”*

Lastly, here's the [link](https://github.com/SPM-G2T2/learning-journey-planning-system) to our Github Repository! 😁
