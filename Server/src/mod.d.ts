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
	}

	export let Database: IOverDatabase;
}
