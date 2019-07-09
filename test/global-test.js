// Only run these tests in Node 8, remove once Node 6 no longer supported
const mocha = require('mocha');
const expect = require('chai').expect;
const command = require('../src/global');

describe('command', function () {
  it('should exist and have certain methods', function () {
    expect(command).to.exist;
    expect(command).to.be.a('function');
  });
});
