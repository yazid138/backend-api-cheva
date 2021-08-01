const conn = require('./db.config');

class Database {
    constructor(table) {
        this.table = table;
        this.from = ` FROM ${this.table}`;
        this.query = {};

        this.arr_select = [];
        this.arr_join = [];
        this.arr_where = [];
        this.arr_group = [];
        this.arr_order = [];
        this.arr_binding = [];
    }

    select(fields) {
        let query = 'SELECT ';
        this.arr_select.push(fields);
        query += this.arr_select.join(', ');
        return this.query.select = query + this.from;
    }

    where(field, value, andor = 'AND', operator = '=') {
        let query = ' WHERE ';
        this.arr_where.push({
            field,
            value,
            operator,
            andor,
        });
        this.arr_where.forEach((e, i) => {
            query += `${e.field} ${e.operator} ${e.value}`;
            if (i < this.arr_where.length - 1) {
                query += ` ${e.andor} `;
            }
        })
        return this.query.where = query;
    }

    join(table, condition, join = '') {
        let query = '';
        this.arr_join.push(` ${join} JOIN ${table} on ${condition}`);
        query += this.arr_join.join('');
        this.query.join = query;
    }

    group(field) {
        let query = ' GROUP BY '
        this.arr_group.push(field);
        query += this.arr_group.join(', ');
        this.query.group = query;
    }

    order(field, ascdsc = 'ASC') {
        let query = ' ORDER BY '
        this.arr_order.push(`${field} ${ascdsc}`);
        query += this.arr_order.join(', ');
        this.query.order = query;
    }

    getQuery() {
        let data = '';
        if (this.query.select) {
            data += this.query.select
            if (this.query.join) {
                data += this.query.join;
            }
            if (this.query.where) {
                data += this.query.where;
            }
            if (this.query.group) {
                data += this.query.group;
            }
            if (this.query.order) {
                data += this.query.order;
            }
        }
        return data;
    }

    insert(data, callback) {
        sql = `INSERT INTO ${this.table} SET ?`;
        return conn.query(sql, data, callback);
    }

    delete(condition) {
        sql = `DELETE FROM ${this.table} WHERE ${condition}`;
        return conn.query(sql, data, callback);
    }

    bind(bind) {
        this.arr_binding.push(bind);
    }

    result(callback) {
        const sql = this.getQuery();
        const binding = this.arr_binding;
        return conn.query(sql, binding, callback);
    }
}

module.exports = {Database};