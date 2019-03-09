
// 'use strict';

// const chai = require('chai');
// const expect = require('chai').expect;

// chai.use(require('chai-http'));

// const app = require('../colors/colors-api.js'); // Our app

// describe('API endpoint /colors', function() {
//   this.timeout(5000); // How long to wait for a response (ms)

//   before(function() {

//   });

//   after(function() {

//   });

//   // GET - List all colors
//   it('should return all colors', function() {
//     return chai.request(app)
//       .get('/colors')
//       .then(function(res) {
//         expect(res).to.have.status(200);
//         expect(res).to.be.json;
//         expect(res.body).to.be.an('object');
//         expect(res.body.results).to.be.an('array');
//       });
//   });


const assert= require("chai").assert;
const app=require("./quiz-wait.controller")


describe('app',function(){

    it('app should return hello',function(){

        assert.equal(app(),'hello'); 
    });  

});