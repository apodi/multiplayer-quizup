var chai = require("chai");
chai.should();
var expect = chai.expect;
var helper = require("../../lib/helper");

describe("helper functions unit tests", function() {
    it("should add two numbers", function() {
        var result = helper.add(2,3);
        result.should.equal(5);
    });

});