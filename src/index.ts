import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    let text = 'HELLO WORLD1ddddddddddddd11111!';
    res.send(text);
})
app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`)
})
