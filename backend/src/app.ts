import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs'
import cors from 'cors';
const tasks = require('./routes/routes');
const app = express();

const PORT = 5000;


app.use(cors({
    origin:'http://localhost:3000',
    credentials: true,
}))

app.use(express.json())

app.use('/list', tasks)


const start = () => {
    try {
        app.listen(PORT, () => console.log(`Running on port ${PORT}`))
    }
    catch (err) {
        console.log(err)
    }
}

start()