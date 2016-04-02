var assert = require('chai').assert
var fn     = require('./../src/functions');


describe('functions', function() {
    describe('getNthWord()', function () {
        it('should return nth word', function () {
            assert.equal(fn.getNthWord('Hello World', 2), 'World');
        });
    });

    describe('getRandomInt()', function () {
        it('should return a random int between x and y', function () {
            var randInt = fn.getRandomInt(1, 10);
            assert.equal(typeof randInt, typeof 5);
            assert.isAbove(randInt, 0);
            assert.isBelow(randInt, 11);
        });
    });










});
