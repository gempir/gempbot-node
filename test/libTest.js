var assert = require('chai').assert
var lib     = require('./../build/src/lib');


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


});
