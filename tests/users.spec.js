var userCompService = require('../services/userCompService.js');
var chai = require('chai');

var expect = chai.expect;

describe('Test alphabetical order on "nom" field', function(){
        beforeEach(function() {
        });
        describe('alphabeticalCompareOnNom method' , function() {
            it('should sort user by name(nom) field', function() {
                var compare = userCompService.alphabeticalCompareOnNom;
                var users = [
                    {id:0, nom:'aa'},
                    {id:1, nom:'ab'},
                    {id:2, nom:'bb'}
                ]
                expect(compare(users[0],users[1]) < 0).to.equal(true);
                expect(compare(users[1],users[0]) > 0).to.equal(true);
                expect(compare(users[1],users[1]) === 0).to.equal(true);
            });
        });
});