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
        this.arr_having = [];
        this.arr_order = [];
        this.arr_binding = [];
    }

    select(fields) {
        let query = 'SELECT ';
        this.arr_select.push(fields);
        query += this.arr_select.join(', ');
        return this.query.select = query + this.from;
    }

    where(field, value = '?', andor = 'AND', operator = '=') {
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

    having(field, value = '?', andor = 'AND', operator = '=') {
        let query = ' HAVING ';
        this.arr_having.push({
            field,
            value,
            operator,
            andor,
        });
        this.arr_having.forEach((e, i) => {
            query += `${e.field} ${e.operator} ${e.value}`;
            if (i < this.arr_where.length - 1) {
                query += ` ${e.andor} `;
            }
        })
        return this.query.having = query;
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

    limit(value) {
        this.query.limit = ' limit ? ';
        this.bind(value);
    }

    offset(value) {
        this.query.offset = ' offset ? ';
        this.bind(value);
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
            if (this.query.having) {
                data += this.query.having;
            }
            if (this.query.order) {
                data += this.query.order;
            }
            if (this.query.limit) {
                data += this.query.limit;
            }
            if (this.query.offset) {
                data += this.query.offset;
            }
        }
        if (this.query.update) {
            data += this.query.update
            if (this.query.where) {
                data += this.query.where;
            }
        }
        if (this.query.delete) {
            data += this.query.delete
            if (this.query.where) {
                data += this.query.where;
            }
        }
        return data.trim();
    }

    insert(data, callback) {
        const query = `INSERT INTO ${this.table} SET ?`;
        return conn.query(query, data, callback);
    }

    update(data) {
        const query = `UPDATE ${this.table} SET ? `;
        this.arr_binding.push(data);
        return this.query.update = query;
    }

    delete() {
        const query = `DELETE FROM ${this.table} `;
        return this.query.delete = query;
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