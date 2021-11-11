process.env.NODE_ENV = 'test';

// let mongoose = require("mongoose");
// let post = require('../app/models/postMessage.js');

// //Require the dev-dependencies
// let chai = require('chai');
// let chaiHttp = require('chai-http');
// let server = require('../server');
// let should = chai.should();
import mongoose from 'mongoose';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import PostMessage from '../models/postMessage.js';

chai.use(chaiHttp);
chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Posts', () => {
    beforeEach((done) => { //Before each test we empty the database
        PostMessage.remove({}, (err) => {
           done();
        });
    });
/*
  * Test the /GET route
  */
  describe('/GET posts', () => {
      it('should GET all the posts', (done) => {
        chai.request(app)
            .get('/posts')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });
  });
  // Test the /POST route
  describe('/POST posts', () => {
      it('should POST a post', (done) => {
        let post = {
            title: "Test Title",
            message: "Test Message",
            creator: "Test Creator",
            tags: ["TestTag1", "TestTag2"],
            selectedFile: "TestFile"
        }
        chai.request(app)
            .post('/posts')
            .send(post)
            .end((err, res) => {
                  res.should.have.status(201);
                  res.body.should.be.a('object');
                  res.body.should.have.property('title');
                  res.body.should.have.property('message');
                  res.body.should.have.property('tags');
                  res.body.should.have.property('selectedFile');
                  res.body.should.have.property('creator');
                  res.body.should.have.property('likeCount').eql(0);
              done();
            });
        });
    });

    // Test the /PUT/:id route
    describe('/PUT/:id posts', () => {
        it('should UPDATE a post given the id', (done) => {
            let post = new PostMessage({
                title: "Old Title",
                message: "Old Message",
                creator: "Same Creator",
                tags: ["OldTag1", "OldTag2"],
                selectedFile: "OldFile"
            });
            post.save((err, post) => {
                chai.request(app)
                    .put('/posts/' + post.id)
                    .send({
                        title: "New Title",
                        message: "New Message",
                        creator: "Same Creator",
                        tags: ["NewTag1", "NewTag2"],
                        selectedFile: "NewFile"
                    })
                    .end((err, res) => {
                          res.body.should.be.a('object');
                          res.body.should.have.property('title').eql('New Title');
                          res.body.should.have.property('message').eql('New Message');
                          res.body.should.have.property('tags').eql(['NewTag1', 'NewTag2']);
                          res.body.should.have.property('selectedFile').eql('NewFile');
                          res.body.should.have.property('creator').eql('Same Creator');
                      done();
                    });
            });
        });
    });

    // Test the /DELETE/:id route
    describe('/DELETE/:id posts', () => {
        it('should DELETE a post given the id', (done) => {
            let post = new PostMessage({
                title: "Another Title",
                message: "Another Message",
                creator: "Different Creator",
                tags: ["DIffTag1", "DIffTag2"],
                selectedFile: "DiffFile"
            });
            post.save((err, post) => {
                chai.request(app)
                    .delete('/posts/' + post.id)
                    .end((err, res) => {
                          res.should.have.status(200);
                          res.body.should.be.a('object');
                          res.body.should.have.property('message').eql('Post deleted successfully');
                      done();
                  });
            });
        });
    });
});