const Sequelize=require('sequelize');

const sequelize = new Sequelize("wt22","root","password",{
    dialect:"mysql",
    host:"localhost"
});

module.exports=sequelize;