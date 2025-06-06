const express = require('express');
const ejs = require('ejs');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', ejs);

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
