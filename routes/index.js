var express = require('express');
var router = express.Router();
var fsPromises = require("fs").promises;
var universe = 'jeroen' //which universe to test with

router.get('/error', function(req, res, next) {
  throw new Error('BROKEN')
});


router.get('/:package', async function(req, res, next) {
  var package = req.params.package || 'index';
  var ismeta = await has_view(package);
  if(ismeta){
    var data = await api_data();
    res.render(package, data);
  } else {
    var data = await api_data(package);
    if(data){
      res.render('one', data);    
    } else {
      res.status(404).send(`No package ${package}`);
    }
  }
});

function has_view(x){
  return fsPromises.stat(`./views/${x}.pug`).catch(e => false);
}

function api_data(package = ""){
  const url = `https://${universe}.r-universe.dev/api/packages/${package}?all=true`;
  console.log(`calling ${url}`)
  return fetch(url).then(x => x.ok && x.json());
}

module.exports = router;
