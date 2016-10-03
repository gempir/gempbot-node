var assert = require('chai').assert
var lib     = require('./../src/lib');


describe('lib', function() {


    describe('countProperties()', function () {
        it('counts propereties of object', function () {
            var obj = {
                test1: 1,
                test2: 2,
                test3: 3
            }
            var count = lib.countProperties(obj);
            assert.equal(count, 3);
        });
    });

    describe('removeFromArray()', function () {
        it('counts propereties of object', function () {
            var arr  = [1,2,3];
            var arr2 = [1,2,3];
            lib.removeFromArray(arr2, arr[0]);
            assert.equal(arr[1], arr2[0]);
        });
    });

    describe('numberFormatted()', function() {
        it('pretty formats numbers', function() {
            var number = 10000;
            var result = lib.numberFormatted(number);
            assert.equal('10,000', result);
        });
    });

    describe('secsToTime()', function() {
        it('converts seconds to pretty timestamp', function() {
            var number = 10000;
            var result = lib.secsToTime(number);
            assert.equal('02:46:40', result);
        });
    });


});
