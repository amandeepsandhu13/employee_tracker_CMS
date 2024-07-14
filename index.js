const  inquirer  = require('inquirer');
const db = require('./db/connection');
const q = require('./db/queries');

init();

function init(){
    loadPrompts();
}

function loadPrompts(){
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'Please select option',
            choices: [
                {
                    name: 'View all employees',
                    value: 'VIEW_EMPLOYEES',
                },
                {
                    name: 'view all departments',
                    value: 'VIEW_DEPARTMENTS',
                },
                {
                    name: 'view all roles',
                    value: 'VIEW_ROLES',
                },
                {
                    name: 'add a department',
                    value: 'ADD_DEPARTMENT',
                },
                {
                    name: 'add a role',
                    value: 'ADD_ROLE',
                },
                {
                    name: 'add an employee',
                    value: 'ADD_EMPLOYEE',
                },
                {
                    name: 'update an employee role',
                    value: 'UPDATE_EMP_ROLE',
                },
                {
                    name: 'Quit',
                    value: 'quit',
                },
            ]
        }
    ]).then((res) => {
        let choice = res.choice;
        switch(choice){
            case 'VIEW_EMPLOYEES': viewEmployees();
            break;
            case 'VIEW_DEPARTMENTS': viewDepartments();
            break;
            case 'VIEW_ROLES': viewAllRoles();
            break;
            case 'ADD_DEPARTMENT': functionAddDept();
            break;
            case 'ADD_ROLE': addRole();
            break;
            case 'ADD_EMPLOYEE': addEmployee();
            break;
            case 'UPDATE_EMP_ROLE': updateEmpRole();
            break;
            default:
                quit();
        }
    }) .catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
            console.log("Prompt couldn't be rendered in the current environment");
        } else {
            // Something else went wrong
            console.error('An error occurred:', error);
        }
    });
}

// add department

const functionAddDept = async() => {
    const { deptName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'deptName',
            message: 'Enter the name of department: ',
        } 
    ]); 
    await q.addDepartment(deptName);
    console.log(`depatment added sucessfully`);
}
// get department
const viewDepartments = async() => {
    try{
        const depts = await q.getDepartments();
        console.table(depts);
    }catch(error){
        console.log("error fetching depts: " +err);
    }
}
const addRole = async() => {
    const { title, salary, departmentId } = await inquirer.prompt([
    {
        type: 'input',
        name: 'title',
        message: 'Enter role title',
    },
    {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary of the role:',
    },
    {
        type: 'input',
        name: 'departmentId',
        message: 'Enter the department ID for the role:',
    }

 ]);

 const newRole = await q.addRole(title, salary, departmentId);
 console.log('role added:' +newRole.title);
}

const viewAllRoles = async() => {
    try{
        const roles = await q.getAllRoles();
        console.table(roles);
    }catch(err){
        console.log(err);
    }
 }