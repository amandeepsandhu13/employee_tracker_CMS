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
        return res.rows[0];
    },

    getAllRoles: async() => {
        const res = await pool.query('SELECT * FROM role');
        return res.rows;
    }
}