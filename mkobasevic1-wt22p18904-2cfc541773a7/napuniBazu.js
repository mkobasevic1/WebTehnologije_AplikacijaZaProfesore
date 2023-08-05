const bodyParser = require("body-parser");
const sequelize=require("./public/db/database")

const Nastavnik = require("./public/models/nastavnik")
const Student = require("./public/models/student")
const Predmet = require("./public/models/predmet")
const Prisustvo = require("./public/models/prisustva")

Nastavnik.hasMany(Predmet);
Predmet.belongsTo(Nastavnik);
Predmet.hasMany(Prisustvo);
Prisustvo.belongsTo(Predmet);
Student.hasMany(Prisustvo);
Prisustvo.belongsTo(Student);

var nastavnik,predmet,student;

sequelize.sync({force:true}).then(()=>{
    Nastavnik.bulkCreate([
        {
            username : "nastavnik1",
            password_hash : "$2a$10$24Wk//ATPQio1APPSZIAceIzXO/OzIuIV2358.WX6uF2C8mjLAQ26"
        },
        {
            username : "nastavnik2",
            password_hash : "$2a$10$QormPHXZBZ7u91B1GQNFkOmyDNCh729dNvfI559/GcgHezq5/c8QK"
        }
    ])
}).then(()=>{
     return Predmet.bulkCreate([
        {
            naziv : "RMA",
            broj_predavanja_sedmicno : 2,
            broj_vjezbi_sedmicno : 2,
            nastavnikId : 1
        },
        {
            naziv : "WT",
            broj_predavanja_sedmicno : 2,
            broj_vjezbi_sedmicno : 2,
            nastavnikId : 1
        }
    ])
}).then(()=>{
    return Predmet.create(
        {
            naziv : "OBP",
            broj_predavanja_sedmicno : 2,
            broj_vjezbi_sedmicno : 2
        }
    )
}).then((data)=>{
    predmet=data;
    return Nastavnik.findOne({where : {username:"nastavnik2"}})
}).then((data)=>{
    nastavnik=data;
    predmet.setNastavnik(nastavnik)
}).then(()=>{
    Student.bulkCreate([
        {ime:"RMA ime",index:12345},
        {ime:"Drugi neko",index:12346},
        {ime:"WT Neko Nekic",index:23456},
        {ime:"WT Drugi neko",index:23457}
    ])
}).then(()=>{
    return Student.findOne({where : {ime:"RMA ime"}});
}).then((data)=>{
    student=data;
    return Predmet.findOne({where : {naziv:"RMA"}})
}).then((data)=>{
    predmet=data
    return Prisustvo.bulkCreate([
        {sedmica:1,predavanja:2,vjezbe:1,predmetId:1,studentId:1},
        {sedmica:2,predavanja:2,vjezbe:1,predmetId:1,studentId:1},
        {sedmica:3,predavanja:2,vjezbe:0,predmetId:1,studentId:1},
        {sedmica:4,predavanja:2,vjezbe:0,predmetId:1,studentId:1},
        {sedmica:5,predavanja:1,vjezbe:1,predmetId:1,studentId:1},
        {sedmica:7,predavanja:2,vjezbe:2,predmetId:1,studentId:1},
        {sedmica:8,predavanja:2,vjezbe:1,predmetId:1,studentId:1}
    ])
}).then(()=>{
    return Student.findOne({where : {ime:"Drugi Neko"}})
}).then((data)=>{
    student=data
    return Prisustvo.bulkCreate([
        {sedmica:1,predavanja:2,vjezbe:2,predmetId:1,studentId:student.id},
        {sedmica:2,predavanja:1,vjezbe:1,predmetId:1,studentId:student.id},
        {sedmica:3,predavanja:2,vjezbe:0,predmetId:1,studentId:student.id},
        {sedmica:5,predavanja:2,vjezbe:1,predmetId:1,studentId:student.id},
        {sedmica:6,predavanja:2,vjezbe:2,predmetId:1,studentId:student.id},
        {sedmica:7,predavanja:2,vjezbe:2,predmetId:1,studentId:student.id},
        {sedmica:8,predavanja:2,vjezbe:1,predmetId:1,studentId:student.id}
    ])
}).then(()=>{
    return Student.findOne({where : {ime:"WT Neko Nekic"}});
}).then((data)=>{
    student=data;
    return Predmet.findOne({where : {naziv:"WT"}});
}).then((data)=>{
    predmet=data;
    return Prisustvo.bulkCreate([
        {sedmica:1,predavanja:2,vjezbe:2,predmetId:predmet.id,studentId:student.id},
        {sedmica:2,predavanja:2,vjezbe:2,predmetId:predmet.id,studentId:student.id},
        {sedmica:3,predavanja:2,vjezbe:0,predmetId:predmet.id,studentId:student.id},
        {sedmica:5,predavanja:2,vjezbe:1,predmetId:predmet.id,studentId:student.id},
        {sedmica:6,predavanja:2,vjezbe:2,predmetId:predmet.id,studentId:student.id},
        {sedmica:7,predavanja:2,vjezbe:2,predmetId:predmet.id,studentId:student.id},
        {sedmica:8,predavanja:2,vjezbe:1,predmetId:predmet.id,studentId:student.id},
        {sedmica:9,predavanja:2,vjezbe:1,predmetId:predmet.id,studentId:student.id},
        {sedmica:10,predavanja:2,vjezbe:2,predmetId:predmet.id,studentId:student.id}
    ])
}).then(()=>{
    return Student.findOne({where : {ime:"WT Drugi Neko"}})
}).then((data)=>{
    student=data;
    return Prisustvo.bulkCreate([
        {sedmica:1,predavanja:2,vjezbe:2,predmetId:predmet.id,studentId:student.id},
        {sedmica:2,predavanja:2,vjezbe:2,predmetId:predmet.id,studentId:student.id},
        {sedmica:3,predavanja:1,vjezbe:0,predmetId:predmet.id,studentId:student.id},
        {sedmica:4,predavanja:1,vjezbe:0,predmetId:predmet.id,studentId:student.id},
        {sedmica:5,predavanja:2,vjezbe:2,predmetId:predmet.id,studentId:student.id},
        {sedmica:6,predavanja:2,vjezbe:0,predmetId:predmet.id,studentId:student.id},
        {sedmica:7,predavanja:2,vjezbe:1,predmetId:predmet.id,studentId:student.id},
        {sedmica:8,predavanja:1,vjezbe:1,predmetId:predmet.id,studentId:student.id},
        {sedmica:9,predavanja:2,vjezbe:2,predmetId:predmet.id,studentId:student.id},
        {sedmica:10,predavanja:2,vjezbe:2,predmetId:predmet.id,studentId:student.id}
    ])
}).then(()=>{
    return Predmet.findOne({where : {naziv:"OBP"}})
}).then((data)=>{
    predmet=data;
    return Prisustvo.bulkCreate([
        {sedmica:1,predavanja:2,vjezbe:2,predmetId:predmet.id,studentId:student.id},
        {sedmica:2,predavanja:2,vjezbe:2,predmetId:predmet.id,studentId:student.id},
        {sedmica:3,predavanja:1,vjezbe:0,predmetId:predmet.id,studentId:student.id},
        {sedmica:5,predavanja:2,vjezbe:2,predmetId:predmet.id,studentId:student.id},
        {sedmica:6,predavanja:2,vjezbe:0,predmetId:predmet.id,studentId:student.id},
        {sedmica:7,predavanja:2,vjezbe:1,predmetId:predmet.id,studentId:student.id},
        {sedmica:8,predavanja:1,vjezbe:1,predmetId:predmet.id,studentId:student.id},
        {sedmica:10,predavanja:2,vjezbe:2,predmetId:predmet.id,studentId:student.id}
    ])
}).then(()=>{
    return Student.findOne({where : {ime:"Drugi Neko"}})
}).then((data)=>{
    student=data;
    return Prisustvo.bulkCreate([
        {sedmica:1,predavanja:2,vjezbe:2,predmetId:predmet.id,studentId:student.id},
        {sedmica:2,predavanja:2,vjezbe:2,predmetId:predmet.id,studentId:student.id},
        {sedmica:3,predavanja:1,vjezbe:2,predmetId:predmet.id,studentId:student.id},
        {sedmica:4,predavanja:1,vjezbe:2,predmetId:predmet.id,studentId:student.id},
        {sedmica:5,predavanja:2,vjezbe:1,predmetId:predmet.id,studentId:student.id},
        {sedmica:6,predavanja:2,vjezbe:0,predmetId:predmet.id,studentId:student.id},
        {sedmica:7,predavanja:1,vjezbe:1,predmetId:predmet.id,studentId:student.id},
        {sedmica:8,predavanja:1,vjezbe:1,predmetId:predmet.id,studentId:student.id},
        {sedmica:9,predavanja:1,vjezbe:1,predmetId:predmet.id,studentId:student.id},
        {sedmica:10,predavanja:2,vjezbe:2,predmetId:predmet.id,studentId:student.id}
    ])
}).then((data)=>{
    process.exit(0)
})
.catch((error)=>{
    console.log(error);
})