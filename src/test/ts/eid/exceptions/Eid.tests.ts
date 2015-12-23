import Eid from '../../../../main/ts/eid/exceptions/Eid';

describe('eid.exceptions.Eid', () => {
  describe('#setUniqIdGenerator', () => {
    it('throws TypeError when given null', () => {
      expect(() => { Eid.setUniqIdGenerator(null) }).toThrow(new TypeError('Unique ID generator can\'t be null, but given one'));
    });
  });
});
