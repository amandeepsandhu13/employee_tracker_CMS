const pool = require('./connection');

// Sample data
const departments = [
  { name: 'Engineering' },
  { name: 'Finance' },
  { name: 'Marketing' },
];

const roles = [
  { title: 'Software Engineer', salary: 80000, department_id: 1 },
  { title: 'Accountant', salary: 60000, department_id: 2 },
  { title: 'Marketing Manager', salary: 70000, department_id: 3 },
];

const employees = [
  { first_name: 'John', last_name: 'Doe', role_id: 1, manager_id: null },
  { first_name: 'Jane', last_name: 'Smith', role_id: 2, manager_id: null },
  { first_name: 'Bob', last_name: 'Johnson', role_id: 3, manager_id: null },
];

// Function to insert sample data
const seedDatabase = async () => {
  try {
    // Insert departments
    for (const dept of departments) {
      await pool.query('INSERT INTO department (name) VALUES ($1)', [dept.name]);
    }

    // Insert roles
    for (const role of roles) {
      await pool.query(
        'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
        [role.title, role.salary, role.department_id]
      );
    }

    // Insert employees
    for (const emp of employees) {
      await pool.query(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
        [emp.first_name, emp.last_name, emp.role_id, emp.manager_id]
      );
    }

    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
