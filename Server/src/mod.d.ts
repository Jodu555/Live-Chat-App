declare module '@jodu555/mysqlapi' {
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
		get: <X>(thing: string) => thingDatabase<X>;
		getSchema: (name: string) => Schema;
	}

	interface thingDatabase<X> {
		create: (thing: object) => Promise<X>;
		update: (search: object, thing: object) => void;
		getOne: (search: object) => Promise<X>;
		get: (search?: object) => Promise<[X]>;
		delete: (search: object) => void;
		getLatest: (action: 'inserted' | 'updated' | 'deleted', search: object) => Promise<X>;
	}

	type ValidationReturn = {
		success: Boolean;
		object: object;
		errors: Object[];
	};

	interface Schema {
		validate: (obj: object, thro: Boolean) => ValidationReturn;
	}

	export let Database: IOverDatabase;
}
