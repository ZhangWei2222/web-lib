const express = require('express');
const app = express();
app.listen(8081, () => {
  console.log('服务启动');
})

app.get('/', (req, res) => {
  res.send('<div>helloWord</div>')
})