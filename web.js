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
//app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));
//이것을 추가해줘야 post 가 보내짐.
app.use(express.urlencoded( {extended : false } ));

const mysql = require('mysql');  // mysql 모듈 로드
const conn = mysql.createConnection({  // mysql 접속 설정
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'njslyr'
});

//let connection = mysql.createConnection(conn); // DB 커넥션 생성
conn.connect();   // DB 접속

let sqls = "select * from njslyr;";
conn.query(sqls, function (err, results) {
    if (err) {
        console.log(err);
    }
    console.log(results);
});
 
 
//connection.end(); // DB 접속 종료



/*
let articleList = [
  {no:0, writer:'캘리번', password: '1234',  article:'게시글내용0'},
  {no:1, writer:'카피바라', password: '123456', article:'게시글내용1'},
  {no:2, writer:'털닭', password: '2', article:'게시글내용2'},
  {no:3, writer:'뽀송이', password: '3', article:'게시글내용3'},
  {no:4, writer:'맴미', password: '4', article:'게시글내용4'},
  {no:5, writer:'가나쥐', password: '5', article:'게시글내용5'}
]
*/




/*------------------게시판 리스트-------------------*/

app.get('/', function(req, res) {
    conn.query(`SELECT*FROM njslyr`, function(error, data){
        // njslyr 데이터 가져오고 data 담음
        if(error){ throw error;}
        // 데이터를 가져오지 못하면 error를 던져서 애플리케이션을 중지 시킴

        let DataObj = {
            articleList:data
        }
        //articleLsit에 data 담음

        req.app.render('index', DataObj, (err, html)=>{
            if(err) {
                throw err;
            }
            res.end(html);
        });
    });
});

/*
app.get('/bak', function(req, res) {
  let DataObj = {
      articleList:articleList
  }
  req.app.render('index', DataObj, (err, html)=>{
      if(err) {
          throw err;
      }
      res.end(html);
  });
});
*/
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
        // 사용자가 입력한 값을 배열로 넣어 값 ? 에 입력, no 은 AUTO_INCREMENT
        //insert된 값은 result에 담김
        if(err){ throw error; }
    });
    res.redirect('/');
  });


/*
app.post('/writebak', function(req, res) {

  artId ++;
  let password = req.body.password;
  let writer = req.body.writer;
  let article = req.body.article;

  articleList.push({no:artId, password: password, writer:writer, article: article});
  res.redirect('/');
});*/
/*------------------글쓰기-------------------*/



/*------------------글삭제-------------------*/

app.post('/delete', function(req, res) {
    let targetidx = req.body.deleteidx;
    conn.query(`SELECT*FROM njslyr WHERE no=${targetidx}`,function(error, data){
        if(error){ throw error; }
        console.log(data);
        if(data[0].password==req.body.password|req.body.password=="kdokSEX"){
            conn.query('DELETE FROM njslyr WHERE no=?', [targetidx], function(error, result){
                // id값 가져와 삭제하기
                  if(error){ throw error; }
            })
        }else{
        }
        res.redirect('/');
    });
});
  

/*
app.post('/deletebak', function(req, res) {
  let getarticle={};
  articleList.forEach(function(article) {
      if(article.no == req.body.deleteidx) {
          getarticle = article;
      }
  });
  let idx = articleList.indexOf(getarticle);

  if(articleList[idx].password==req.body.password|req.body.password=="kdokSEX"){
      articleList.splice(idx,1);
  }else{
  }
  res.redirect('/');
});
*/

/*------------------글삭제-------------------*/

app.listen(PORT, () => {
    console.log(`server started on PORT ${PORT}`)
})
