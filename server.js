const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
	useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// mongoose.connect(MONGODB_URI, {
// 	useNewUrlParser: true,
// 	useFindAndModify: false,
// });

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
	console.log(`App running on port ${PORT}!`);
});
