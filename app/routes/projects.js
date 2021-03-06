'use strict';

var multiparty = require('multiparty');
var traceur = require('traceur');
var Project = traceur.require(__dirname + '/../models/project.js');
var projects = global.nss.db.collection('projects');
// var Mongo = require('mongodb');

exports.index = (req, res)=>{
  Project.findAll(projects=>{
    res.render('projects/index', {projects:projects, title: 'Portfolio: List'});
  });
};

exports.new = (req, res)=>{
  res.render('projects/new', {title: 'Portfolio: New'});
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();

  form.parse(req, (err, fields, files)=>{
    Project.create(res.locals.user._id, fields, files, ()=>{
      res.redirect('/projects');
    });
  });
};

exports.show = (req, res)=>{
  Project.findById(req.params.id, project=>{
    res.render('projects/show', {project:project, title: 'Portfolio: Show'});
  });
};

exports.destroy = (req, res)=>{
  Project.findById(req.params.id, project=>{
    Project.destroy(project);

    res.redirect('/projects');
  });
};

exports.destroyPhoto = (req, res)=>{
  console.log('cccccccccc');
  console.log(req.param.index);
  Project.findById(req.params.id, project=>{
    Project.deletePhoto(project, req.params.index);

    res.redirect('/projects');
  });
};

exports.edit = (req, res)=>{
  Project.findById(req.params.id, project=>{
    Project.modify(project, req.body);
      projects.save(project, ()=>{
        res.redirect('/projects');
    });
  });
};
