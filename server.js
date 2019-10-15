"use strict";
/* 引入express框架 */
const express = require('express');
const app = express();

/* 引入cors */
const cors = require('cors');
app.use(cors());

/* 引入body-parser */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* 引入mysql */
const mysql = require('mysql');
const conn = mysql.createConnection({
    host     : '47.101.130.10',
    user     : 'root',
    password : '1998WEI.',
    database : 'library',
    multipleStatements: true
})
conn.connect();

/* 监听端口 */
app.listen(4444, () => {
  console.log('——————————服务已启动——————————');
})

app.get('/', (req, res) => {
  res.send('<p style="color:red">服务已启动</p>');
})

// 书本列表
app.get('/api/getBooks', (req, res) => {
  const sqlStr = 'SELECT * FROM book'
  conn.query(sqlStr, (error, results) => {
      if (error) return res.json({ code: -1, message: error})
      res.json({ code: 10000, data: results})
  })
})

// 更新书本列表
app.post('/api/updateBook',(req,res) => {
  // console.log(req.body)
  let str = ''
  for(var key in req.body) {
    str += key + ' = "' + req.body[key] + '",'
  }
  str = str.substr(0, str.length-1);

  // console.log(str)

  const sqlStr = 'UPDATE book SET ' + str + ' WHERE id = ' + req.body.id
  // console.log(sqlStr)

  conn.query(sqlStr, (err,results) => {
      if(err) return res.json({ code: -1, message: err })
      res.json({ code: 10000, data: results })
  })
})

// 添加书本
app.post('/api/addBook',(req,res) => {
  let str1 = '', str2 = ''
  for(var key in req.body) {
      str1 += key + ','
      str2 += req.body[key] + '","'
  }
  console.log(str2)
  str1 = str1.substr(0, str1.length-1);
  str2 = '"' + str2.substr(0, str2.length-2);

  // console.log(str1, str2)

  const sqlStr = 'INSERT INTO book (' + str1 + ')' + ' VALUES (' + str2 + ')'
  console.log(sqlStr)

  conn.query(sqlStr, (err,results) => {
      if(err) return res.json({ code: -1, message: err })
      res.json({ code: 10000, data: results })
  })
})

// 删除书本
app.post('/api/delectBook',(req,res) => {
  console.log(req.body)
  const sqlStr = 'DELETE FROM book WHERE id = ' + req.body.id
  console.log(sqlStr)

  conn.query(sqlStr, (err,results) => {
      if(err) return res.json({ code: -1, message: err })
      res.json({ code: 10000, data: results })
  })
})

// 显示用户列表
app.get('/api/getUsers', (req, res) => {
  const sqlStr = 'SELECT * FROM reader'
  conn.query(sqlStr, (error, results) => {
      if (error) return res.json({ code: -1, message: error})
      res.json({ code: 10000, data: results})
  })
})

// 更新用户列表
app.post('/api/updateUser',(req,res) => {
  let str = ''
  for(var key in req.body) {
      str += key + ' = "' + req.body[key] + '",'
  }
  str = str.substr(0, str.length-1);

  const sqlStr = 'UPDATE reader SET ' + str + ' WHERE id = ' + req.body.id

  conn.query(sqlStr, (err,results) => {
      if(err) return res.json({ code: -1, message: err })
      res.json({ code: 10000, data: results })
  })
})

// 添加用户
app.post('/api/addUser',(req,res) => {
  let str1 = '', str2 = ''
  for(var key in req.body) {
      console.log(key)
      str1 += key + ','
      str2 += req.body[key] + '","'
  }
  str1 = str1.substr(0, str1.length-1);
  str2 = '"' + str2.substr(0, str2.length-2);

  const sqlStr = 'INSERT INTO reader (' + str1 + ')' + ' VALUES (' + str2 + ')'

  conn.query(sqlStr, (err,results) => {
      if(err) return res.json({ code: -1, message: err })
      res.json({ code: 10000, data: results })
  })
})

// 删除用户
app.post('/api/delectUser',(req,res) => {
  const sqlStr = 'DELETE FROM reader WHERE id = ' + req.body.id

  conn.query(sqlStr, (err,results) => {
      if(err) return res.json({ code: -1, message: err })
      res.json({ code: 10000, data: results })
  })
})

//显示管理员列表
app.get('/api/getAdmin', (req, res) => {
  const sqlStr = 'SELECT * FROM administrators'
  conn.query(sqlStr, (error, results) => {
      if (error) return res.json({ code: -1, message: error})
      res.json({ code: 10000, data: results})
  })
})

// 更新管理员列表
app.post('/api/updateAdmin',(req,res) => {
  let str = ''
  for(var key in req.body) {
      str += key + ' = "' + req.body[key] + '",'
  }
  str = str.substr(0, str.length-1);

  const sqlStr = 'UPDATE administrators SET ' + str + ' WHERE id = ' + req.body.id

  conn.query(sqlStr, (err,results) => {
      if(err) return res.json({ code: -1, message: err })
      res.json({ code: 10000, data: results })
  })
})

// 添加管理员
app.post('/api/addAdmin',(req,res) => {
  let str1 = '', str2 = ''
  for(var key in req.body) {
      console.log(key)
      str1 += key + ','
      str2 += req.body[key] + '","'
  }
  str1 = str1.substr(0, str1.length-1);
  str2 = '"' + str2.substr(0, str2.length-2);

  const sqlStr = 'INSERT INTO administrators (' + str1 + ')' + ' VALUES (' + str2 + ')'

  conn.query(sqlStr, (err,results) => {
      if(err) return res.json({ code: -1, message: err })
      res.json({ code: 10000, data: results })
  })
})

// 删除管理员
app.post('/api/delectAdmin',(req,res) => {
  const sqlStr = 'DELETE FROM administrators WHERE id = ' + req.body.id
  conn.query(sqlStr, (err,results) => {
      if(err) return res.json({ code: -1, message: err })
      res.json({ code: 10000, data: results })
  })
})

// 显示借书列表
app.get('/api/getBorrow', (req, res) => {
  const sqlStr = 'SELECT * FROM reader_borrow'
  conn.query(sqlStr, (error, results) => {
      if (error) return res.json({ code: -1, message: error})
      res.json({ code: 10000, data: results})
  })
})

// 获取 借书证号 列表
app.get('/api/getUserId', (req, res) => {
  const sqlStr = 'SELECT id,name FROM reader'
  conn.query(sqlStr, (error, results) => {
      if (error) return res.json({ code: -1, message: error})
      res.json({ code: 10000, data: results})
  })
})

// 获取 编号 列表
app.get('/api/getBookId', (req, res) => {
  const sqlStr = 'SELECT id,name FROM book'
  conn.query(sqlStr, (error, results) => {
      if (error) return res.json({ code: -1, message: error})
      res.json({ code: 10000, data: results})
  })
})

// 借书
app.post('/api/borrowBook',(req,res) => {
  const sqlStr = 'call proc_borrow("' + req.body.reader_id + '","' + req.body.book_id + '","' + req.body.borrow_date + '","' + req.body.expect_return_date + '")'
  console.log(sqlStr)
  conn.query(sqlStr, (err,results) => {
      // console.log(results)
      if(err) return res.json({ code: -1, message: err })
      res.json({ code: 10000, data: results })
  })
})

// 还书
app.post('/api/returnBook',(req,res) => {
  const sqlStr = 'call proc_return("' + req.body.readerId + '","' + req.body.bookId + '","' + req.body.curDate + '")'
  // console.log(sqlStr)
  conn.query(sqlStr, (err,results) => {
      // console.log(results)
      if(err) return res.json({ code: -1, message: err })
      res.json({ code: 10000, data: results })
  })
})

// 显示欠费列表
app.get('/api/getTicket', (req, res) => {
  const sqlStr = 'SELECT * FROM reader_ticket'
  conn.query(sqlStr, (error, results) => {
      if (error) return res.json({ code: -1, message: error})
      res.json({ code: 10000, data: results})
  })
})

// 缴费
app.post('/api/payTicket',(req,res) => {
  const sqlStr = 'call proc_payoff("' + req.body.readerId + '","' + req.body.bookId + '")'
  conn.query(sqlStr, (err,results) => {
      if(err) return res.json({ code: -1, message: err })
      res.json({ code: 10000, data: results })
  })
})

// 删除已缴的欠费单
app.post('/api/delectTicket',(req,res) => {
  const sqlStr = 'DELETE FROM ticket WHERE readerId = ' + req.body.readerId + ' AND bookId = ' + req.body.bookId
  conn.query(sqlStr, (err,results) => {
      if(err) return res.json({ code: -1, message: err })
      res.json({ code: 10000, data: results })
  })
})

// 显示还书列表
app.get('/api/getReturn', (req, res) => {
  const sqlStr = 'SELECT * FROM reader_borrow_return'
  conn.query(sqlStr, (error, results) => {
      if (error) return res.json({ code: -1, message: error})
      res.json({ code: 10000, data: results})
  })
})
