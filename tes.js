// const validator = require("validator");
// console.log(validator.isDate('12 01 2001'));

// const date = new Date('10:11');
//
// console.log(date);
//
// const conn = require('./config/db.config');
//
// let sql = 'SELECT * FROM user JOIN profile p on user.id = p.id';
//
// conn.query(sql, (err, res) => {
//     if(err) return err;
//     return res;
// })
//
// data.then(result => console.log(result));
// console.log(Boolean(0));

// function isEmpty(object) {
//     return Object.keys(object).length === 0
// }

// const data = {tes:'tes', d:'d'}
// const data = {}
// if (data) {
//     console.log('tes');
// }

// console.log(Object.keys(data).length);
let sql = 'SELECT * FROM user JOIN profile p on user.id = p.id';
// arr_params = [];
// if (params.search) {
//     arr_params.push(` p.name LIKE ''`);
// }
// if (params.div_id) {
//     arr_params.push(` p.div_id = ''`);
// }
// sql += arr_params.join(' AND ');
// console.log(sql);
// new RegExp(/(SELECT|select)/)
// if (!sql.match(/(SELECT|select)/g)) {
//     console.log('tes');
// }

class Database {
    constructor(table) {
        this.sql = '';
        this.table = table;
        this.from = ` FROM ${this.table}`;
        this.query = {};

        this.arr_select = [];
        this.arr_join = [];
        this.arr_where = [];
        this.arr_group = [];
        this.arr_order = [];
    }

    select(field) {
        let query = 'SELECT ';
        this.arr_select.push(field);
        query += this.arr_select.join(', ');
        this.sql = query + this.from;
        return this.query.select = query + this.from;
    }

    where(field, value, andor = 'AND') {
        let query = '';
        query = ' WHERE ';
        this.arr_where.push({
            field,
            value,
            operation: '=',
            andor
        });
        this.arr_where.forEach((e, i) => {
            query += `${e.field} ${e.operation} ${e.value}`;
            if (i < this.arr_where.length - 1) {
                query += ` ${e.andor} `;
            }
        })
        this.sql += query;
        return this.query.where = query;
    }

    join(table, condition, join = 'JOIN') {
        let query = '';
        this.arr_join.push(` ${join} ${table} on ${condition}`)
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

    get() {
        let data = '';
        if (this.query.select) {
            data += this.query.select
        }
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
        return data;
    }
}

const table1 = new Database('tes')
table1.select('*');
table1.where('tes', '\'%?%\'');
table1.select('saya1');
table1.join('tes', 'tes1 = tes2');
table1.select('saya');
table1.where('tes2', '?', 'OR');
table1.select('*, user.id')
table1.join('profile p', 'user.id = p.id')
table1.join('tes', 'tes1 = tes2');
table1.order('tes1');
table1.order('tes1', 'DESC');
table1.group('tes');
table1.group('tes2');
table1.where('tes2', '?');

console.log(table1.get());

// const tes = table1.getQuery();
// console.log(tes.replace(/(?=(WHERE|where))/g, 'JOIN '));