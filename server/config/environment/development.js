/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options
    mongo: {
        useMongoClient: true,
        uri: process.env.MONGODB_URI || 'mongodb://localhost/dspamain-dev'
    },

    // Sequelize connection options
    sequelize: {
        uri: 'sqlite://',
        options: {
            logging: false,
            operatorsAliases: false,
            storage: 'dev.sqlite',
            define: {
                timestamps: false
            }
        }
    },

    // Seed database on startup
    seedDB: true,
};
