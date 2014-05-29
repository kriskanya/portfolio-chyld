/* jshint unused:false */

'use strict';

var projects = global.nss.db.collection('projects');
var fs = require('fs');
var path = require('path');
var Mongo = require('mongodb');
var rimraf = require('rimraf');

class Project{
  static create(userId, fields, files, fn){
    var project = new Project();
    project.title = fields.title[0].trim();
    project.description = fields.description[0].trim();
    project.tags = fields.tags[0].split(',').map(t=>t.toLowerCase()).map(t=>t.trim());
    project.git = fields.git[0].trim();
    project.app = fields.app[0].trim();
    project.date = new Date(fields.date[0]);
    project.userId = userId;
    project.photos = [];
    project.processPhotos(files.photos);
    projects.save(project, (e,p)=>fn(p));
  }

  static modify(original, obj){
    original.title = obj.title;
    original.description = obj.description;
    original.tags = obj.tags;
    original.git = obj.git;
    original.app = obj.app;
    original.date = obj.date;
    // projects.save(project, (e,p)=>fn(p));

  }

  processPhotos(photos){
    photos.forEach((p,i)=>{
      var title = this.title.toLowerCase().replace(/[^\w]/g, '');
      var photo = `/img/${this.userId}/${title}/${i}${path.extname(p.originalFilename)}`;
      this.photos.push(photo);

      var userDir = `${__dirname}/../static/img/${this.userId}`;
      var projDir = `${userDir}/${title}`;
      var fullDir = `${projDir}/${i}${path.extname(p.originalFilename)}`;

      if(!fs.existsSync(userDir)){fs.mkdirSync(userDir);}
      if(!fs.existsSync(projDir)){fs.mkdirSync(projDir);}

      fs.renameSync(p.path, fullDir);
    });
  }

  save(fn){
    projects.save(this, ()=>fn(this));
  }

  static destroy(obj){
    var _id = Mongo.ObjectID(obj._id);
    projects.findAndRemove({_id: _id}, ()=>{});
      rimraf(`${__dirname}/../static/img/${obj.userId}/${obj.title}`, ()=>{});
  }

  static findAll(fn){
    projects.find().toArray((e,r)=>fn(r));
  }

  static findById(projectId, fn){
    projectId = Mongo.ObjectID(projectId);
    projects.findOne({_id:projectId}, (e,p)=>fn(p));
  }
}

module.exports = Project;
