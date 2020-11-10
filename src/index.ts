import express from 'express';

// Routers
import ApiRouter from './routes/ApiRouter';

const app = express();

// Enviroment
const port = process.env.PORT || 3000;

app.use('/api', ApiRouter);

app.listen(port, () => {
    console.log(`Now listining on port ${port}.`);
});