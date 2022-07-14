const path = require('path');
const express = require('express');
const userRouter = require('./routers/user')
const sessionRouter = require('./routers/session')

require('./db/mongoose')

const app = express();
const port = process.env.PORT || 3000;

// paths for express config
const publicPath = path.join(__dirname, '../public/build');

// setup static dir to serve
app.use(express.json());
app.use(express.static(publicPath));

app.use((req, res, next) => {
	const allowedOrigins = ['https://arnav.guneta.com','http://localhost:3004','http://localhost:3000'];
	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin)) {
		 res.setHeader('Access-Control-Allow-Origin', origin);
	}
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.header('Access-Control-Allow-Credentials', true);
	return next();
});


// REST API
app.use(userRouter)
app.use(sessionRouter)

// React
app.get("*", (req, res) => {
	res.writeHead(302, {
		'Location': '/projects/golf/'
		//add other headers here...
	  });
	  res.end();
});

app.listen(port, () => {
	console.log('[golf-stats] Server is up on port ' + port);
});

