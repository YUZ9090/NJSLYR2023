const http = require('http');
const express = require('express');
const { error } = require('console');
const { response } = require('express');
const { writer } = require('repl');
const app = express();
const PORT = 8001;
//app.set('port', process.env.PORT || 3003);
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');

// 리소스 폴더 추가 (serve-static)
app.use(express.static('public'));
//이것을 추가해줘야 post 가 보내짐.
app.use(express.urlencoded( {extended : false } ));


let articleList = [
    {no:0, writer:'캘리번', password: '1234',  article:'게시글내용0'},
    {no:1, writer:'카피바라', password: '123456', article:'게시글내용1'},
    {no:2, writer:'털닭', password: '2', article:'게시글내용2'},
    {no:3, writer:'뽀송이', password: '3', article:'게시글내용3'},
    {no:4, writer:'맴미', password: '4', article:'게시글내용4'},
    {no:5, writer:'가나쥐', password: '5', article:'게시글내용5'}
]

let deleteindex = 0 ;


/*------------------메인화면-------------------
app.get('/', function(req, res) {
    let DataObj={
        homeList:homeList
    }
    req.app.render('index', DataObj, (err, html)=>{
        if(err) {
            throw err;
        }
        res.end(html);
    });
});
*/


let artId =5;

app.get('/test', function(req, res) {
    req.app.render('test', (err, html)=>{
        if(err) {
            throw err;
        }
        res.end(html);
    });
});



/*------------------게시판 리스트-------------------*/
app.get('/', function(req, res) {
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
/*------------------게시판 리스트-------------------*/



/*------------------게시물 디테일-------------------*/
///detail/:id이렇게 콜론(:)뒤에 오는 변수를 파라미터로 받게된다.
//그 파라미터는 req.params.id로 접근할 수 있다.
app.get('/detail/:id', function(req, res) {
    let getarticle={};
    articleList.forEach(function(article) {
        if(article.no == req.params.id) {
            getarticle = article;
        }
    });

    let DataObj = {
        articleId : req.params.id,
        article : getarticle
    }
    req.app.render('detail', DataObj, (err, html)=>{
        if(err) {
            throw err;
        }
        res.end(html);
    });
});
/*------------------게시물 디테일-------------------*/
  

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

    artId ++;
    let password = req.body.password;
    let writer = req.body.writer;
    let article = req.body.article;

    articleList.push({no:artId, password: password, writer:writer, article: article});
    res.redirect('/');
});
/*------------------글쓰기-------------------*/




/*------------------글수정-------------------*/
app.get('/edit/:id', function(req, res) {
    let DataObj = {
        articleId : req.params.id,
        articleList:articleList
    }
    req.app.render('edit', DataObj, (err, html)=>{
        if(err) {
            throw err;
        }
        res.end(html);
    });
});


app.post('/edit/:id', function(req, res) {
    let getarticle={};
    articleList.forEach(function(article) {
        if(article.no == req.params.id) {
            getarticle = article;
        }
    });
    let idx = articleList.indexOf(getarticle);

    let id = req.params.id;
    let password = req.body.password;
    let writer = req.body.writer;
    let article = req.body.article;

    articleList.splice(idx,1,{no:id, password: password, writer:writer, article: article});
    
    res.redirect('/');
});
/*------------------글수정-------------------*/
 

/*------------------글삭제-------------------*/

/*app.post('/delete/:id', function(req, res) {
    let getarticle={};
    articleList.forEach(function(article) {
        if(article.no == req.params.id) {
            getarticle = article;
        }
    });
    let idx = articleList.indexOf(getarticle);

    if(articleList[idx].password==req.body.password|req.body.password=="kdokSEX"){
        articleList.splice(idx,1);
    }else{
    }
    res.redirect('/');
});*/

app.post('/delete', function(req, res) {
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


/*
app.get('/delete/:id', function(req, res) {
    let getarticle={};
    articleList.forEach(function(article) {
        if(article.no == req.params.id) {
            getarticle = article;
        }
    });
    let idx = articleList.indexOf(getarticle);
    
    articleList.splice(idx,1);

    res.send(idx);
    //res.redirect('/');
});
*/


const mysql = require('mysql');  // mysql 모듈 로드
const conn = {  // mysql 접속 설정
    host: 'localhost',
    port: '3306',
    user: 'user',
    password: 'pw',
    database: 'monolithic'
};
 
app.listen(PORT, () => {
    console.log(`server started on PORT ${PORT}`)
})

/*
const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log('Listening on port: ' + app.get('port'));
});*/