var http = require("http");
var fs = require('fs');
var mongoose = require('mongoose');
var gunziplib = require('zlib');
mongoose.connect('mongodb://admin:pass@troup.mongohq.com:10023/animedb');

var page = 0;
var User = {};

var animedb_user_list = mongoose.model('animedb_user_list', {
  id: Number,
  d: Boolean,
  gender: Number,
  date: Date,
  acount: Number,
  p: Number.
  likes: {}
});

function getHtml(response) {
  var html = '';
  gunzip = gunziplib.createGunzip();
  response.pipe(gunzip);
  gunzip.on('data', function(chunk) {
    html += chunk;
  });
  gunzip.on('end', function() {

    reg = /<tr[\s\S]*?<\/tr>/ig
    res = html.match(reg)
    tmp = false;
    if (res) {
      for (var i = res.length - 1; i >= 0; i--) {
        id = /".*?aid=(.*?)"/.exec(res[i]);
        if (id) {
          ar = /<td class="vote(?! my).*?>([0-9\.]*?)<\/td>/.exec(res[i]);
          User.likes[id[1]] = Math.round(ar[1]);
        }
      };
      if (true) { // next page?
        page = page + 1;
        setTimeout(sendRequest, 1000)
      } else {
        sendRequestUser()
      }
    } else {
      //DEL HIM
      console.log("user has no likes DEL HIM")
    };
  });
}

function getHtml(response) {
  var html = '';
  gunzip = gunziplib.createGunzip();
  response.pipe(gunzip);
  gunzip.on('data', function(chunk) {
    html += chunk;
  });
  gunzip.on('end', function() {
    // get gender
    // get date
    // set d
    // save user
    // next user 
    page = 0;
    User = arUsers.shift();
    setTimeout(sendRequest, 3000)
  });
}

function sendRequest() {
  options = {
    hostname: 'test.net-brand.ru',
    path: '/voit.html?uid=' + User.id + '&show=myvotes&do=anime&epp=250&page=' + page,
    //hostname: 'anidb.net',
    //path: '/perl-bin/animedb.pl?show=userlist&orderby.user=1.1&orderby.acnt=0.2&page=' + page,
    headers: {
      'User-Agent': 'Opera/9.80 (Windows NT 6.2; WOW64) Presto/2.12.388 Version/12.16',
      'Accept': 'text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1',
      'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Referer': 'http://anidb.net/perl-bin/animedb.pl',
      'Cookie': 'default_tabs=anime%3Atab_main_1; adbuin=1391335061-tMcM; anidbsettings=%7B%22USEAJAX%22%3A1%7D; adbsess=fYNfFXhwhTOISpFY; adbss=618704-fYNfFXhw; adbsessuser=batatampa; adbautouser=batatampa; adbautopass=CtzOSjRgEuGHTwgi',
      'Cache-Control': 'no-cache',
      'Connection': 'Keep-Alive',
    }
  }
  http.request(options, getHtml).end();
}

function sendRequestUser() {
  options = {
    hostname: 'test.net-brand.ru',
    path: '/voit.html?uid=' + User.id + '&show=myvotes&do=anime&epp=250&page=' + page, // TODO
    //hostname: 'anidb.net',
    //path: '/perl-bin/animedb.pl?show=userlist&orderby.user=1.1&orderby.acnt=0.2&page=' + page,
    headers: {
      'User-Agent': 'Opera/9.80 (Windows NT 6.2; WOW64) Presto/2.12.388 Version/12.16',
      'Accept': 'text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1',
      'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Referer': 'http://anidb.net/perl-bin/animedb.pl',
      'Cookie': 'default_tabs=anime%3Atab_main_1; adbuin=1391335061-tMcM; anidbsettings=%7B%22USEAJAX%22%3A1%7D; adbsess=fYNfFXhwhTOISpFY; adbss=618704-fYNfFXhw; adbsessuser=batatampa; adbautouser=batatampa; adbautopass=CtzOSjRgEuGHTwgi',
      'Cache-Control': 'no-cache',
      'Connection': 'Keep-Alive',
    }
  }
  http.request(options, getHtmlUser).end();
}


animedb_user_list.find({
  d: false
}).exec(function(err, docs) {
  console.log('list q - ok')
  arUsers = docs;
  User = arUsers.shift()
  sendRequest();
});
