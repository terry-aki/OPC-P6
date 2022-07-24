const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const {INFO, WARN, ERROR, OK} = require("./logger/logger");

const app = express();
const port = 3000;

const auth = require('./routes/auth');
const sauce = require('./routes/sauce');

console.log(INFO(`INFO\t- message`))
console.log(OK(`OK\t- message`))
console.log(WARN(`WARN\t- message`))
console.log(ERROR(`ERROR\t- message\n`))

mongoose.connect("mongodb+srv://Terry:<password>@cluster.c19h7.mongodb.net/OPC-P6?retryWrites=true&w=majority")
    .then(() => console.log(INFO(`Database connected \n`)))
    .catch((err) => console.log(ERROR(err)))

app.use(express.json());

app.use(cors())

app.use('/api/auth', auth)
app.use('/api/sauces', sauce)

app.listen(port, () => {
    console.log(INFO(`API launched on :${port}`));
})