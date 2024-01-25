import express from 'express'
import bodyParser from 'body-parser'
import mongoDB from './mongodbconnection'

import Api from './router'
const port =  8000;
 mongoDB();

const app =  express()
app.use(express.json());
app.use(bodyParser.json());

app.use('/user', Api);



const server = app.listen(port, () => {
    console.log(`Server is listing on port :- ${port}`);
  });
 server.on('error', e => console.error("Error", e));