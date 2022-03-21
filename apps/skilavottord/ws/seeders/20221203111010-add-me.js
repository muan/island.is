'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'access_control',
      [
        {
          national_id: '0301665909',
          name: 'Sigurgeir Gudmundsson',
          role: 'developer',
          partner_id: '9999999999',
          email: 'essgje@island.is'
        },
      ],
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('access_control', null, {})
  },
}
