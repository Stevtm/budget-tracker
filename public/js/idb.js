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
		uploadTransaction();
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

// function that uploads transaction from IndexedDB
function uploadTransaction() {
	// open transaction on your db
	const transaction = db.transaction(["new_transaction"], "readwrite");

	// access your object store
	const transactionObjectStore = transaction.objectStore("new_transaction");

	// get all records from store and set to a variable
	const getAll = transactionObjectStore.getAll();

	// after successful .getAll() :
	getAll.onsuccess = function () {
		if (getAll.result.length > 0) {
			fetch("/api/transaction", {
				method: "POST",
				body: JSON.stringify(getAll.result),
				headers: {
					Accept: "application/json, test/plain, */*",
					"Content-Type": "application/json",
				},
			})
				.then((response) => response.json())
				.then((serverResponse) => {
					if (serverResponse.message) {
						throw new Error(serverResponse);
					}

					// open one more transaction
					const transaction = db.transaction(["new_transaction"], "readwrite");
					// access new_transaction object store
					const transactionObjectStore =
						transaction.objectStore("new_transaction");
					// clear items in store
					transactionObjectStore.clear();

					alert("All saved transactions have been submitted");
					document.location.reload;
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};
}

// listen for app coming back online
window.addEventListener("online", uploadTransaction);
