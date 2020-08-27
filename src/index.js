const express = require('express');

// Routers
const ApiRouter = require('./routes/ApiRouter');

const app = express();

// Enviroment
const port = process.env.PORT || 3000;

app.use('/api', ApiRouter.router);

app.listen(port, () => {
    ApiRouter.getData();

    console.log(`Now listining on port ${port}.`);
});