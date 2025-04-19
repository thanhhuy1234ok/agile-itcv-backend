const mongoose = require('mongoose');
const { dbUriDev, dbUriProd, env } = require('./env.config.js');

class Database {
    constructor() {
        if (!Database.instance) {
            Database.instance = this;
            this.connect();
        }
        return Database.instance;
    }

    async connect() {
        try {
            const dbUri = env === 'dev' ? dbUriDev : dbUriProd;
            await mongoose.connect(dbUri);
            console.log('✅ Database connection successful');
        } catch (error) {
            console.error('❌ Database connection error:', error);
        }
    }
}

const instance = new Database();
Object.freeze(instance);
module.exports = instance;
