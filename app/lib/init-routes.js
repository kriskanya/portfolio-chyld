'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  var projects = traceur.require(__dirname + '/../routes/projects.js');

  app.all('*', users.lookup);

  app.get('/', dbg, home.index);
  app.get('/about', dbg, home.about);
  app.get('/faq', dbg, home.faq);
  app.get('/contact', dbg, home.contact);
  app.get('/resume', dbg, home.resume);

  app.get('/login', dbg, users.login);
  app.post('/login', dbg, users.authenticate);
  app.get('/logout', dbg, users.logout);

  app.all('*', users.bounce);  //when it gets to this route, if you're not logged in it kicks you out

  app.get('/projects', dbg, projects.index);
  app.post('/projects', dbg, projects.create);
  app.get('/projects/new', dbg, projects.new);
  app.get('/projects/:id', dbg, projects.show);
  app.post('/projects/:id', dbg, projects.edit);
  app.post('/projects/:id/delete', dbg, projects.destroy);
  app.post('/projects/:id/:index', dbg, projects.destroyPhoto);

  console.log('Routes Loaded');
  fn();
}
