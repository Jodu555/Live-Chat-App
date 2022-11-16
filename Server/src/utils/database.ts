import { Database } from '@jodu555/mysqlapi';
const database = Database.getDatabase();

function create() {
	database.createTable('messages', {
		options: {
			softdelete: true,
			timestamps: true,
			K: ['name'],
		},
		name: {
			type: 'varchar(64)',
			null: false,
		},
		message: {
			type: 'Text',
			null: false,
		},
	});

	const messageSchema = {
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

type Message = {
	name?: string;
	message?: string;
	created_at?: number;
};

export default create;
export { Message };

// module.exports = create,Message;
