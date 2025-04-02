module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      type: Sequelize.INTEGER,
      field: 'id',
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      field: 'name',
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      field: 'email',
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING,
      field: 'phone',
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      field: 'address',
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      field: 'password',
      allowNull: false
    },
    roleId: {
      type: Sequelize.INTEGER,
      field: 'roleId',
      allowNull: true
    },
    forgetPasswordToken: {
      type: Sequelize.STRING,
      field: 'forgetPasswordToken',
      allowNull: true
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'createdAt',
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updatedAt',
      allowNull: false
    },
    deletedAt: {
      type: Sequelize.DATE,
      field: 'deletedAt',
      allowNull: true
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('users')
};
