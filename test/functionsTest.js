var assert = require('chai').assert
var fn     = require('./../src/controllers/functions');


describe('functions', function() {
    describe('getNthWord()', function () {
        it('should return nth word', function () {
            assert.equal(fn.getNthWord('Hello World', 2), 'World');
        });
    });

    describe('containsASCII()', function () {
        it('should return true when given string contains ASCII spam', function () {
            var message = 'ASCII ▓▓▓▓▓▓▓▓';
            assert.equal(fn.containsASCII(message), true);
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

    describe('countWords()', function () {
        it('should return the number of words in given string', function () {
            assert.equal(fn.countWords('Hello World'), 2);
        });
    });










});
