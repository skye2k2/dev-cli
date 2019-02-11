// Only run these tests in Node 8, remove once Node 6 no longer supported
const mocha = require('mocha');
const expect = require('chai').expect;
const debtAudit = require('../bin/debt_audit.js');

describe('debtAudit', () => {
  it('should exist and have certain methods', () => {
    expect(debtAudit).to.exist;
    expect(debtAudit).to.be.a('object');
    expect(debtAudit.uncoverDebt).to.be.a('function');
  });
});
