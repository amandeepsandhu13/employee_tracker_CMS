const inquirer = require("inquirer");
const db = require("./db/connection");
const q = require("./db/queries");


// Initialize the application
init();

// Function to initialize and load prompts
function init() {
  loadPrompts();
}

// Function to load the main menu prompts
function loadPrompts() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "Please select option",
        choices: [
          {
            name: "View all employees",
            value: "VIEW_EMPLOYEES",
          },
          {
            name: "view all departments",
            value: "VIEW_DEPARTMENTS",
          },
          {
            name: "view all roles",
            value: "VIEW_ROLES",
          },
          {
            name: "add a department",
            value: "ADD_DEPARTMENT",
          },
          {
            name: "add a role",
            value: "ADD_ROLE",
          },
          {
            name: "add an employee",
            value: "ADD_EMPLOYEE",
          },
          {
            name: "update an employee role",
            value: "UPDATE_EMP_ROLE",
          },
          {
            name: "update an employee manager",
            value: "UPDATE_EMP_MANAGER",
        },
        {
            name: "Quit",
            value: "quit",
        },
        ],
      },
    ])
    .then((res) => {
      let choice = res.choice;
      switch (choice) {
        case "VIEW_EMPLOYEES":
          viewEmployees();
          break;
        case "VIEW_DEPARTMENTS":
          viewDepartments();
          break;
        case "VIEW_ROLES":
          viewAllRoles();
          break;
        case "ADD_DEPARTMENT":
          functionAddDept();
          break;
        case "ADD_ROLE":
          addRole();
          break;
        case "ADD_EMPLOYEE":
          addEmployee();
          break;
        case "UPDATE_EMP_ROLE":
          updateEmpRole();
          break;
          case "UPDATE_EMP_MANAGER":
            updateEmpManager();
            break;
        default:
            quit();
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
        console.log("Prompt couldn't be rendered in the current environment");
      } else {
        // Something else went wrong
        console.error("An error occurred:", error);
      }
    });
}

//update employee role

const updateEmpRole = async() => {
    try{

        const employees = await q.getEmployees();
        const employeeChoices = employees.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id,
        }));
        const { employeeId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Select the employee to update:',
                choices: employeeChoices,
            },
        ]);
        const roles = await q.getAllRoles();
        const roleChoices = roles.map(role => ({
            name: role.title,
            value: role.id,
        }));

        const { roleId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'Select the new role for the employee:',
                choices: roleChoices,
            },
        ]);
        await q.updateEmployeeRole(employeeId, roleId);
        console.log(`Updated employee's role successfully`);
        viewEmployees();

    } catch(err){
        console.log(err);
    }
};

// update employee manager
const updateEmpManager = async () => {
    try {
        const employees = await q.getEmployees();
        const employeeChoices = employees.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id,
        }));

        const { employeeId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Select the employee to update manager:',
                choices: employeeChoices,
            },
        ]);

        const { managerId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'managerId',
                message: 'Select the new manager for the employee:',
                choices: [...employeeChoices, { name: 'None', value: null }],
            },
        ]);

        await q.updateEmployeeManager(employeeId, managerId);
        console.log(`Updated employee's manager successfully`);
        viewEmployees();
    } catch (err) {
        console.log(err);
    }
};

// add department

const functionAddDept = async () => {
  const { deptName } = await inquirer.prompt([
    {
      type: "input",
      name: "deptName",
      message: "Enter the name of department: ",
    },
  ]);
  await q.addDepartment(deptName);
  console.log(`depatment added sucessfully`);
  loadPrompts();
};
// get department
const viewDepartments = async () => {
  try {
    const depts = await q.getDepartments();
    console.table(depts);
    loadPrompts();
  } catch (error) {
    console.log("error fetching depts: " + err);
  }
};
const addRole = async () => {
  const { title, salary, departmentId } = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Enter role title",
    },
    {
      type: "input",
      name: "salary",
      message: "Enter the salary of the role:",
    },
    {
      type: "input",
      name: "departmentId",
      message: "Enter the department ID for the role:",
    },
  ]);

  const newRole = await q.addRole(title, salary, departmentId);
  console.log("role added:" + newRole.title);
  loadPrompts();
};

const viewAllRoles = async () => {
  try {
    const roles = await q.getAllRoles();
    console.table(roles);
    loadPrompts();
  } catch (err) {
    console.log(err);
  }
};

// function to asdd new employee
const addEmployee = async () => {
  try {
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the first name of the employee:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the last name of the employee:",
      },
      {
        type: "input",
        name: "roleId",
        message: "Enter the role ID of the employee:",
      },
      {
        type: "input",
        name: "managerId",
        message: "Enter the manager ID of the employee (if applicable):",
      },
    ]);
    // Validate manager ID
    let validManagerId = managerId || null;
    if (managerId) {
      const manager = await q.getEmployeeById(managerId);
      if (!manager) {
        console.log(
          `Manager ID ${managerId} does not exist. Setting manager to null.`
        );
        validManagerId = null;
      }
    }
    const newEmp = await q.addNewEmployee(
      firstName,
      lastName,
      roleId,
      validManagerId
    );
    const getEmployee = await q.getEmployees();
    console.table(getEmployee);
    loadPrompts();     // Reload prompts after operation
  } catch (err) {
    console.log(err);
  }
};
// function to view all employees
const viewEmployees = async () => {
    try {
        const employees = await q.getEmployees();
        console.table(employees);
    } catch (err) {
        console.error('Error viewing employees:', err);
    }

    // Reload prompts after operation
    loadPrompts();
};

