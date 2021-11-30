'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
    BEGIN;
        CREATE TABLE personal_representative (
          id VARCHAR NOT NULL,
          national_id_personal_representative VARCHAR NOT NULL,
          national_id_represented_person VARCHAR NOT NULL,
          valid_to TIMESTAMP WITH TIME ZONE NULL,
          created TIMESTAMP WITH TIME ZONE DEFAULT now(),
          PRIMARY KEY (id)
        );

        CREATE TABLE personal_representative_right (
          id VARCHAR NOT NULL,
          personal_representative_id VARCHAR NOT NULL,
          right_type_code VARCHAR NOT NULL,
          PRIMARY KEY (id)
        );

        ALTER TABLE personal_representative_right 
        ADD CONSTRAINT FK_personal_representative_right_type FOREIGN KEY (right_type_code)
        REFERENCES personal_representative_right_type (code);

        ALTER TABLE personal_representative_right 
        ADD CONSTRAINT FK_personal_representative FOREIGN KEY (personal_representative_id)
        REFERENCES personal_representative (id);

        COMMIT;
    `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      BEGIN;
        DROP TABLE personal_representative_right;
        DROP TABLE personal_representative;
      COMMIT;
    `)
  }
};
