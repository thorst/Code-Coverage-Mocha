var expect = chai.expect;

describe("Simple", function() {
  describe("Add", function() {
    it("should be a number", function() {
      expect(typeof $.simpleAdd(1,2)).to.equal("number");
    });
 
    it("should add number", function() {
      expect($.simpleAdd(1,2)).to.equal(3);
    });
  });
});