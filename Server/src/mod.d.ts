declare module '@jodu555/mysqlapi' {
	// export var Database: object {
	// 	// createDatabase: (host: string, username: string, password: string, database: string) => Object;
	// }
	// export interface Database {
	//     function create: () => any
	// }
	// export function createDatabase(host: string, username: string, password: string, database: string): Object;

	interface IOverDatabase {
		createDatabase: (host: string, username: string, password: string, database: string) => Database;
		getDatabase: () => Database;
	}

	interface TableOptionsTimestamps {
		createdAt?: Boolean | String;
		updatedAt?: Boolean | String;
		deletedAt?: Boolean | String;
	}

	interface TableOptions {
		timestamps?: TableOptionsTimestamps | Boolean;
		softdelete?: Boolean;
		PK?: String;
		K?: String | String[];
		FK?: Object;
	}

	interface TypeOptions {
		type: String;
		null?: Boolean;
	}

	interface TableObject {
		options: TableOptions;
		[key: string]: String | TypeOptions | TableOptions;
	}

	interface Database {
		connect: () => void;
		createTable: (tablename: string, table: TableObject) => void;
		registerSchema: (name: string, schema: object, reference_table_name: string) => void;
		get: (thing: string) => thingDatabase;
		getSchema: (name: string) => any;
	}

	interface thingDatabase {
		create: (thing: object) => Promise<object>;
		update: (search: object, thing: object) => void;
		getOne: (search: object) => Promise<object>;
		get: (search?: object) => Promise<[object]>;
		delete: (search: object) => void;
		getLatest: (action: 'inserted' | 'updated' | 'deleted', search: object) => Promise<object>;
	}

	export let Database: IOverDatabase;
}
