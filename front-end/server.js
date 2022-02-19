const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000

app.use((req, res, next) => {
  res.header("Cache-Control", "public, max-age=86400")
  next();
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`server is listening on ${port} port.`);
})

