const consoleTable = require('console.table');
const inquirer = require('inquirer');
const database = require('./database/connection');

const sql = [
    'SELECT * FROM DEPARTMENTS',
    `SELECT ROLES.TITLE AS Job_Title, ROLES.ID AS ID, DEPARTMENTS.NAME AS Department, 
    ROLES.SALARY AS Salary FROM ROLES JOIN DEPARTMENTS ON DEPARTMENTS.ID = ROLES.DEPARTMENT_ID`,
    'SELECT E.ID AS EMPLOYEE_ID, E.FIRST_NAME, E.LAST_NAME,R.TITLE AS JOB_TITLE,D.NAME AS DEPARTMENTS,R.SALARY, CONCAT(T.FIRST_NAME, " ", T.LAST_NAME) AS MANAGER_INFO FROM EMPLOYEES E JOIN ROLES R ON R.ID = E.ROLE_ID JOIN DEPARTMENTS D ON D.ID = R.DEPARTMENT_ID LEFT JOIN EMPLOYEES T ON T.ID = E.MANAGER_ID ORDER BY E.ID;',
    ''
]

database.connect(err => {
    if (err) {
        throw err;
    } else {
        console.log('DATABASE CONNECTED!!');
    }
});

function prompter() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'menuItem',
            message: 'What would you like to do today?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees',
                'Add A Department', 'Add A Role', 'Add An Employee',
                'Update An Employee Role', 'Exit']
        }
    ])
        .then(selected => {
            switch (selected.menuItem) {
                case 'View All Departments':
                    displayAllDepartments()
                    break;
                case 'View All Roles':
                    displayAllRoles();
                    break;
                case 'View All Employees':
                    displayAllEmployees();
                    break;
                case 'Add A Department':
                    addDepartment();
                    break;
                case 'Add A Role':
                    addRole();
                    break
                case 'Add An Employee':
                    addEmployee()
                    break;
                case 'Update An Employee Role':
                    updateEmployee()
                    break;
                case 'exit':
                    console.log('Thank you.. Goodbye!')
                    process.exit();
            }
        })
}

function displayAllDepartments() {
    
    database.query(sql[0], (err, rows) => {
        if (err) {
            throw err;
        } else {
            console.table(rows);
            console.log('Going Back to Main Menu :)');
            prompter();
        }
    })
}

function displayAllRoles() {

    database.query(sql[1], (err, rows) => {
        if (err) {
            throw err;
        } else {
            console.table(rows);
            console.log('Going Back to Main Menu :)');
            prompter();
        }
    })
}

function displayAllEmployees() {
    database.query(sql[2], (err, rows) => {
        if (err) {
            throw err;
        } else {
            console.table(rows);
            console.log('Going Back to Main Menu :)');
            prompter();
        }
    })
}

function addDepartment() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: "What is the name of department you want to add?",
            validate: answer => {
                if (!answer) {
                    console.log("Please enter name of the department!!")
                    return false;
                }
                return true;
            }
        }
    ])
        .then(input => {
            const sql = `INSERT INTO DEPARTMENTS (NAME) VALUES(?)`;
            const param = [input.department];

            database.query(sql, param, (err, result) => {
                if (err) {
                    console.log(err)
                }
                prompter();
            })
        })
}

const addRole = () => {
    return database.promise().query(
        `SELECT ID, NAME FROM DEPARTMENTS`
    ).then(([departments]) => {
            const departmentInfo = departments.map(({
                id, name
            }) => ({
                name:name,
                value:id
            }))
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'role',
                    message: "What is the role you want to add?",
                    validate: answer => {
                        if (!answer) {
                            console.log("Please enter role!!")
                            return false;
                        }
                        return true;
                    }
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'What department does this role belong in?',
                    choices: departmentInfo
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary of the role?',
                    validate: answer => {
                        if (!answer) {
                            console.log("Please enter salary of the role!!")
                            return false;
                        }
                        return true;
                    }
                }
            ])
                .then(({ role, department, salary }) => {
                    database.promise().query(
                        `INSERT INTO ROLES (TITLE, SALARY, DEPARTMENT_ID) 
                VALUES (?,?,?)`,
                        [role, salary, department],
                        (err, result) => {
                            if (err) {
                                console.log(err)
                            }
                        }
                    )
                    prompter();
                })
        })
}

const addEmployee = () => {
    return database.promise().query(
        `SELECT ID, TITLE FROM ROLES`
    )
        .then(([roles]) => {

            database.promise().query(
                `SELECT ID, CONCAT(FIRST_NAME, ' ', LAST_NAME) AS MANAGER FROM EMPLOYEES`
            )
                .then(([manager]) => {

                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'employeeFirst',
                            message: 'Enter Employee First Name?',
                            validate: answer => {
                                if (!answer) {
                                    console.log("Please enter salary of the role!!")
                                    return false;
                                }
                                return true;
                            }
                        },
                        {
                            type: 'input',
                            name: 'employeeLast',
                            message: 'Enter Employee Last Name?',
                            validate: answer => {
                                if (!answer) {
                                    console.log("Please enter salary of the role!!")
                                    return false;
                                }
                                return true;
                            }
                        },
                        {
                            type: 'list',
                            name: 'roleTitle',
                            message: 'What role is the employee taking?',
                            choices: [roles.title]
                        },
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who will be this new employee's manager?",
                            choices: [manager.name]
                        }
                    ])
                        .then(({ employeeFirst, employeeLast, roleTitle, manager }) => {
                            database.promise().query(
                                `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
                    VALUES (?,?,?,?)`,
                                [employeeFirst, employeeLast, roleTitle, manager],
                                (err, result) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                }
                            )
                            prompter();
                        })
                })
        })
}

const updateEmployee = () => {
    return database.promise().query(
        `SELECT E.id, CONCAT(E.first_name, ' ', E.last_name) AS employee FROM employees E`
    )
        .then(([employees]) => {

            database.promise().query(
                `SELECT roles.id, roles.title FROM roles`
            )
                .then(([roles]) => {

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'employee',
                            message: 'Which employee would you like to update?',
                            choices: [employees.name]
                        },
                        {
                            type: 'list',
                            name: 'updatedRole',
                            message: 'What role will they be taking?',
                            choices: [roles.title]
                        }
                    ])
                        .then(({ employee, updatedRole }) => {
                            database.promise().query(
                                `UPDATE employees SET role_id = ?
                    WHERE id = ?`,
                                [updatedRole, employee],
                                (err, result) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                }
                            )
                            prompter();
                        })
                })
        })
}

prompter();