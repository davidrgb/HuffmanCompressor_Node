const express = require('express');
const path = require("path");

const app = express();
app.use(express.static('../public'));

app.get('*', function(req, res) {
    res.sendFile(path.resolve('../public/index.html'));
});

app.listen(3000, () =>
  console.log('Huffman Compressor listening on port 3000!'),
);