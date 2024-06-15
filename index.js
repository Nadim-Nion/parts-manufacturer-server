const express = require('express');
const app = express();
const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
    res.send('CompParts Hub is running successfully');
})


app.listen(port, () => {
    console.log(`CompParts Hub is running on the PORT: ${port}`);
})