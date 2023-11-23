require('dotenv').config();
const Sequelize = require('sequelize');

let sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
});

const Set = sequelize.define('Set', {
    set_num: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING,
});

const Theme = sequelize.define('Theme', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: Sequelize.STRING,
});

Set.belongsTo(Theme, {foreignKey: 'theme_id'});

function initialize() {
    return new Promise(async(resolve, reject) => {
        try {
            await sequelize.sync();
            resolve(); 
        } catch (error) {
            reject(error); 
        }
    });
}

function getAllSets() {
    return new Promise(async(resolve, reject) => {
        try {
            let allSets = await Set.findAll({
                include: [Theme],
            });
            resolve(allSets); 
        } catch (error) {
            reject(error);
        }
    });
}

function getSetByNum(setNum) {
    return new Promise(async(resolve, reject) => {
        try {
            let sets = await Set.findAll({
                include: [Theme],
                where: {
                    set_num: setNum
                }
            });
            resolve(sets[0]);
        } catch (error) {
            reject("Unable to find requested set"); 
        }
    });
}

function getSetsByTheme(theme) {
    return new Promise(async(resolve, reject) => {
        try {
            let sets = await Set.findAll({include: [Theme], where: {
                '$Theme.name$': {
                [Sequelize.Op.iLike]: `%${theme}%`
                }
                }});
            resolve(sets);
        } catch (error) {
            reject("Unable to find requested set"); 
        }
    });
}

function getAllThemes() {
    return new Promise(async(resolve, reject) => {
        try {
            let allThemes = await Theme.findAll();
            resolve(allThemes); 
        } catch (error) {
            reject(error);
        }
    });
}

function addSet(setData) {
    return new Promise(async (resolve, reject) => {
        try {
            await Set.create(setData);
            resolve();
        } catch (error) {
            reject(error.errors[0].message);
        }
    });
}

function editSet(set_num, setData) {
    return new Promise(async (resolve, reject) => {
        try {
            const existingSet = await Set.findOne({
                where: { set_num: set_num }
            });
            if (existingSet) {
                await existingSet.update(setData);
                resolve();
            } else {
                reject("Set not found");
            }
        } catch (error) {
            reject(error.errors[0].message);
        }
    });
}

function deleteSet(set_num) {
    return new Promise(async (resolve, reject) => {
        try {
            const existingSet = await Set.findOne({
                where: { set_num: set_num }
            });
            if (existingSet) {
                await existingSet.destroy();
                resolve();
            } else {
                reject("Set not found");
            }
        } catch (error) {
            reject(error.errors[0].message);
        }
    });
}


module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, getAllThemes, addSet, editSet, deleteSet };

