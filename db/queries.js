const pool = require('./connection');
module.exports = {
    addDepartment: async(deptName) => {
        const res = await pool.query('INSERT INTO department (name) VALUES ($1)', [deptName]);
        return res.rows[0];
    },

    getDepartments: async() => {
        const res = await pool.query('SELECT * FROM department');
        return res.rows;
    },

    addRole: async(title, salary, departmentId) => {
        const res = await pool.query( 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *',
            [title, salary, departmentId]);
        return res.rows;
    },

    getAllRoles: async() => {
        const res = await pool.query('SELECT * FROM role');
        return res.rows;
    },
    addNewEmployee: async(first_name, last_name, role_id, manager_id) => {
        const res = await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [first_name, last_name, role_id, manager_id]
        ); return res.rows;
    },
    getEmployees: async() => {
        const res = await pool.query('SELECT * FROM employee');
        return res.rows;
    },
    getEmployeeById: async (id) => {
        try {
            const res = await pool.query('SELECT * FROM employee WHERE id = $1', [id]);
            return res.rows[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    updateEmployeeRole: async (employeeId, roleId) => {
        try {
            await pool.query(
                'UPDATE employee SET role_id = $1 WHERE id = $2',
                [roleId, employeeId]
            );
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}