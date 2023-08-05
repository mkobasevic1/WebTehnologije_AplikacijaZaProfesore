const Sequelize=require('sequelize');
const sequelize=require("../db/database")

const Predmet=sequelize.define("predmet",{
    id:{
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    naziv:{
        type: Sequelize.STRING,
        allowNull:false
    },
    broj_predavanja_sedmicno:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    broj_vjezbi_sedmicno:{
        type: Sequelize.INTEGER,
        allowNull:false
    }
})

module.exports=Predmet;