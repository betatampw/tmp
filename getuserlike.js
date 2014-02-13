var http = require("http");
var fs = require('fs');
var mongoose = require('mongoose');
var gunziplib = require('zlib');
mongoose.connect('mongodb://admin:pass@troup.mongohq.com:10023/animedb');

var page = 0;
var arUsers = [{
  id: 111,
  likes: {}
}]
var user = {};

var animedb_user_list = mongoose.model('animedb_user_list', {
  id: Number,
  d: Boolean,
  gender: String,
  date: Date,
  acount: Number,
  p: Number,
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
    console.log('GET USER ' + User.id + ' LIKE PAGE ' + page + ' - COMPLETED')
    reg = /<tr[\s\S]*?<\/tr>/ig
    res = html.match(reg)
    tmp = false;
    if (res) {
      console.log('USER ' + User.id + ' HAVE LIKES')
      for (var i = res.length - 1; i >= 0; i--) {
        id = /".*?aid=(.*?)"/.exec(res[i]);

        if (id) {
          ar = /<td class="vote(?! my).*?>([0-9\.]*?)<\/td>/.exec(res[i]);
          if (id[1] && ar[1]) {
            User.likes[id[1]] = Math.round(ar[1]);
          }
        }
      };


      if (!/<ul class="g_list jump">[\s\S]*?next(?= selected)[\s\S]*?<\/ul>/i.test(html)) { // next page?
        console.log('GET USER NEXT PAGE LIKES')
        page = page + 1;
        setTimeout(sendRequest, 1000)
      } else {
        console.log('GET USER ' + User.id + ' LIKES DOWNLOAD')
        sendRequestUser()
      }
    } else {
      console.log('USER ' + User.id + ' HAVE 0 LIKES REMOVE')
      User.remove();
      page = 0;
      User = arUsers.shift();
      if (User) {
        User['likes'] = {};
        console.log("GET NEXT USER");
        console.log("------------- REMAINING " + arUsers.length + " --------------");
        setTimeout(sendRequest, 3000)
      } else {
        console.log("######################   ALL USER DOWNLOAD   ######################")
      }
    };
  });
}

function getHtmlUser(response) {
  var html = '';
  gunzip = gunziplib.createGunzip();
  response.pipe(gunzip);
  gunzip.on('data', function(chunk) {
    html += chunk;
  });
  gunzip.on('end', function() {
    console.log('GET USER ' + User.id + ' INFO - COMPLETED')
    reg = /tr.*?gender[\s\S]*?<td class="value">(.*?)<\/td>[\s\S]*?<\/tr>/i
    res = html.match(reg)
    if (res) {
      console.log('GET USER ' + User.id + ' HAVE GENDER')
      User.gender = res[1]
    }
    reg = /tr.*?birthday[\s\S]*?<td class="value">.*?([0-9]{2})\.([0-9]{2})\.([0-9]{4}).*?<\/td>[\s\S]*?<\/tr>/i
    res = html.match(reg)
    if (res) {
      console.log('GET USER ' + User.id + ' HAVE DATE')
      User.date = new Date(res[3], res[2], res[1])
    }
    User.d = true;
    User.save();
    console.log('GET USER ' + User.id + ' SAVE')
    page = 0;
    User = arUsers.shift();
    if (User) {
      User['likes'] = {};
      console.log("GET NEXT USER");
      console.log("------------- REMAINING " + arUsers.length + " --------------");
      setTimeout(sendRequest, 3000)
    } else {
      console.log("######################   ALL USER DOWNLOAD   ######################")
    }

  });
}

function sendRequest() {
  options = {
    hostname: 'anidb.net',
    path: '/perl-bin/animedb.pl?uid=' + User.id + '&show=myvotes&do=anime&epp=250&page=' + page,
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
  console.log('GET USER ' + User.id + ' LIKE PAGE ' + page)
  http.request(options, getHtml).end();
}

function sendRequestUser() {
  options = {
    hostname: 'anidb.net',
    path: 'http://anidb.net/perl-bin/animedb.pl?show=userpage&uid=' + User.id,
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
  console.log('GET USER ' + User.id + ' INFO')
  http.request(options, getHtmlUser).end();
}

console.log('GET USER LIST ')
animedb_user_list.find({
  d: false
}).sort({
  page: 1
}).exec(function(err, docs) {
  console.log('GET USER LIST - COMPLETED')
  arUsers = docs;
  User = arUsers.shift()
  if (User) {
    User['likes'] = {};
    sendRequest();
  } else {
    console.log("######################   ALL USER DOWNLOAD   ######################")
  }
});
