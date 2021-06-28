// create variable to hold the db connection
let db;

// establish connection to IndexedDB database called "budget-tracker" and set it to version 1
const request = indexedDB.open("budget-tracker", 1);

// event emit if db version changes
request.onupgradeneeded = function (event) {
	// save reference to database
	const db = event.target.result;
	// create object store called "new_transaction", set to be auto-incrementing
	db.createObjectStore("new_transaction", { autoIncrement: true });
};

// upn successful
request.onsuccess = function (event) {
	// when db is successully created with object store or connection is established, save reference to db in global variable
	db = event.target.result;

	// check if app is online
	//  if it is, run uploadTransaction() function to send local db data to api
	if (navigator.onLine) {
		// uploadTransaction()
	}
};

request.onerror = function (event) {
	console.log(event.target.errorCode);
};

// function to be executed when attempting to submit a transaction when there is no connection
function saveRecord(record) {
	// open new transaction with database with read and write permissions
	const transaction = db.transaction(["new_transaction"], "readwrite");

	// access object store for "new_transaction"
	const transactionObjectStore = transaction.objectStore("new_transaction");

	// add record to store with add method
	transactionObjectStore.add(record);
}
