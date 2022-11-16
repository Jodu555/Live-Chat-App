var Database = require('@jodu555/mysqlapi').Database;
var database = Database.getDatabase();
function create() {
    database.createTable('messages', {
        options: {
            softdelete: true,
            timestamps: true,
            K: ['name']
        },
        'name': {
            type: 'varchar(64)',
            null: false,
        },
        'message': {
            type: 'Text',
            null: false,
        },
    });
    var messageSchema = {
        name: {
            default: 'Anonymous',
            anum: true,
            min: 3,
            max: 15,
        },
        message: {
            min: 3,
        },
    };
    database.registerSchema('message', messageSchema, 'messages');
}
module.exports = create;
