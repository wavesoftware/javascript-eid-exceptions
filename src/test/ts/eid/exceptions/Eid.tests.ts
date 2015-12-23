import Eid from '../../../../main/ts/eid/exceptions/Eid';

describe('eid.exceptions.Eid', () => {
  describe('#setUniqIdGenerator', () => {
    afterEach(() => {
      Eid.setUniqIdGenerator(Eid.DEFAULT_UNIQ_ID_GENERATOR);
    });
    it('throws TypeError when given null', () => {
      expect(() => { Eid.setUniqIdGenerator(null) }).toThrow(new TypeError('Unique ID generator can\'t be null, but given one'));
    });
    it('sets properly new UniqIdGenerator impl, and return previous', () => {
      // given
      var generator = {
          generateUniqId() {
              // fail("Generator should not be executed while validating");
              return "constant";
          }
      };
      // when
      var oldGenerator = Eid.setUniqIdGenerator(generator);
      // then
      expect(oldGenerator).toEqual(Eid.DEFAULT_UNIQ_ID_GENERATOR);
      // when
      var replaced = Eid.setUniqIdGenerator(Eid.DEFAULT_UNIQ_ID_GENERATOR);
      // then
      expect(replaced).toEqual(generator);
      expect(replaced.generateUniqId()).toEqual("constant");
    });
  });
});
