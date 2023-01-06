const http = require('http');
const ejs = require('ejs');
const express = require('express')
const { error } = require('console');
const { response } = require('express');
const { writer } = require('repl');
const app = express()
const PORT = 8001
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')


// 리소스 폴더 추가 (serve-static)
app.use(express.static(__dirname + '/public'));
//이것을 추가해줘야 post 가 보내짐.
app.use(express.urlencoded( {extended : false } ));

const mysql = require('mysql');  // mysql 모듈 로드
const conn = mysql.createConnection({  // mysql 접속 설정
    host: 'njslyr2023.cafe24app.com',
    port: '3306',
    user: 'cpa9090',
    password: 'cjell119201',
    database: 'cpa9090'
});

conn.connect();   // DB 접속


/*------------------게시판 리스트-------------------*/

app.get('/', function(req, res) {
    conn.query(`SELECT*FROM njslyr`, function(error, data){
        if(error){ throw error;}

        let DataObj = {
            articleList:data
        }

        req.app.render('index', DataObj, (err, html)=>{
            if(err) {
                throw err;
            }
            res.end(html);
        });
    });
});


/*------------------게시판 리스트-------------------*/



/*------------------글쓰기-------------------*/
app.get('/write', function(req, res) {
  req.app.render('write', (err, html)=>{
      if(err) {
          throw err;
      }
      res.end(html);
  });
});

app.post('/write', function(req, res) {

    let writer = req.body.writer;
    let password = req.body.password;
    let article = req.body.article;
  
    conn.query(`INSERT INTO njslyr (writer, password, article) VALUES (?, ?, ?)`, [writer, password,article], function(err, result){
        if(err){ throw error; }
    });
    res.redirect('/');
  });

/*------------------글쓰기-------------------*/



/*------------------글삭제-------------------*/

app.post('/delete', function(req, res) {
    let targetidx = req.body.deleteidx;
    conn.query(`SELECT*FROM njslyr WHERE no=?`,[targetidx],function(error, data){
        if(error){ throw error; }
        console.log(data);
        if(data[0].password==req.body.password|req.body.password=="kdokSEX"){
            conn.query('DELETE FROM njslyr WHERE no=?', [targetidx], function(error, result){
                  if(error){ throw error; }
            })
        }else{
        }
        res.redirect('/');
    });
});
  

/*------------------글삭제-------------------*/

app.listen(PORT, () => {
    console.log(`server started on PORT ${PORT}`)
})
