const {
  getGenericPartyLetterRegistry,
} = require('../../../../../../test/seedHelpers')

module.exports = {
  partyLetterRegistry: [
    {
      ...getGenericPartyLetterRegistry(),
      owner: '0101302989',
      party_letter: 'W',
    },
  ],
}
