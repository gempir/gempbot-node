var assert = require('chai').assert
var lib     = require('./../src/lib');


describe('lib', () => {


    describe('countProperties()', () => {
        it('counts propereties of object', ()=> {
            var obj = {
                test1: 1,
                test2: 2,
                test3: 3
            }
            var count = lib.countProperties(obj);
            assert.equal(count, 3);
        });
    });

    describe('removeFromArray()',  () => {
        it('counts propereties of object',  () => {
            var arr  = [1,2,3];
            var arr2 = [1,2,3];
            lib.removeFromArray(arr2, arr[0]);
            assert.equal(arr[1], arr2[0]);
        });
    });

    describe('numberFormatted()', () => {
        it('pretty formats numbers', () => {
            var number = 10000;
            var result = lib.numberFormatted(number);
            assert.equal('10,000', result);
        });
    });

    describe('secsToTime()', () => {
        it('converts seconds to pretty timestamp', () => {
            var number = 10000;
            var result = lib.secsToTime(number);
            assert.equal('02:46:40', result);
        });
    });


});
