const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const fs = require('fs');
const bcrypt = require('bcryptjs')
const sequelize=require("./public/db/database")
const {Op} = require('sequelize')

const Nastavnik = require("./public/models/nastavnik")
const Student = require("./public/models/student")
const Predmet = require("./public/models/predmet")
const Prisustvo = require("./public/models/prisustva")

const app = express();

Nastavnik.hasMany(Predmet);
Predmet.belongsTo(Nastavnik);
Predmet.hasMany(Prisustvo);
Prisustvo.belongsTo(Predmet);
Student.hasMany(Prisustvo);
Prisustvo.belongsTo(Student);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}))

app.use(session({
    secret: 'sifra',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(__dirname +"/public"));

app.get('/prijava.html',function(req,res){
    res.sendFile(__dirname+"/public/prijava.html");
});


app.post('/login',async (req,res)=>{    //podaci za ispravan login username:nastavnik1 password:sifra1, username:nastavnik2 password:sifra2
    let Username = req.body['username']
    let Password = req.body['password']  

    const nastavnik =await Nastavnik.findOne({where : {username:Username}})

    if(nastavnik==null){
        res.json({poruka:"Neuspješna prijava"})
    }
    else{
        const predmeti = await Predmet.findAll({where : {nastavnikId:nastavnik.id}})

        var predmetijson = "["
        predmeti.forEach(p => {
            predmetijson+="\""+p.naziv+"\","  
        });
        predmetijson=predmetijson.substring(0,predmetijson.length-1)
        predmetijson+="]"

        bcrypt.compare(Password, nastavnik.password_hash, function(err, result) {
            if (result) {
                req.session.username = Username;
                req.session.predmeti = JSON.parse(predmetijson);
                res.json({poruka:"Uspješna prijava"})
            }
            else{
                res.json({poruka:"Neuspješna prijava"})
            }
        });
    }
    

    /*fs.readFile("public/data/nastavnici.json","utf-8", function(err,data){
        if(!err){
            var podaci = JSON.parse(data);
            var imaime = false
            podaci.forEach(element => {
                if(element.nastavnik.username==Username) 
                    imaime=true;
            });
            if(!imaime){
                res.json({poruka:"Neuspješna prijava"})
            }
            podaci.forEach(a => {
                bcrypt.compare(Password, a.nastavnik.password_hash, function(err, result) {
                    if (result && a.nastavnik.username==Username) {
                        req.session.username = Username;
                        req.session.predmeti = a.predmeti;
                        res.json({poruka:"Uspješna prijava"})
                    }
                    else if(!result && a.nastavnik.username==Username){
                        res.json({poruka:"Neuspješna prijava"})
                    }
                });
                
            });
        }
        else{
            console.log("error citanja")
        }
    })*/
});

app.post('/logout',function(req,res){
    if(req.session.username == null){
        res.json({poruka:"Niste prijavljeni"})
    }
    req.session.username=null
    req.session.predmeti=null
    res.json({poruka:"Uspješna odjava"})
});
    
app.get('/predmet/:naziv',async function(req,res){
    var naziv = req.params.naziv
    const predmet = await Predmet.findOne({where : {naziv:naziv}})
    const idStudenata = await Prisustvo.findAll({where: {predmetId:predmet.id}, attributes: [[sequelize.fn('DISTINCT', sequelize.col('studentId')), 'studentId']]})
    console.log(1);
    var prisustvojson="{ \"studenti\":[";
    for(const element of idStudenata){
        const student = await Student.findOne({where : {id:element.studentId}})
        prisustvojson+="{\"ime\":\""+student.ime+"\",\"index\":"+student.index+"},"
    };
    console.log(2);
    prisustvojson=prisustvojson.substring(0,prisustvojson.length-1)
    prisustvojson+="],\"prisustva\":["

    const prisustva = await Prisustvo.findAll({where : {predmetId:predmet.id}})

    for(const element of prisustva) {
        prisustvojson+="{ \"sedmica\":"+element.sedmica+", \"predavanja\":"+element.predavanja+", \"vjezbe\":"+element.vjezbe+", \"index\":"
        const pomocnistudent = await Student.findOne({where : {id:element.studentId}})
        prisustvojson+=pomocnistudent.index+"},"
        
    };
    console.log(3);
    prisustvojson=prisustvojson.substring(0,prisustvojson.length-1)
    prisustvojson+="], \"predmet\": \""+predmet.naziv+"\", \"brojPredavanjaSedmicno\": "+predmet.broj_predavanja_sedmicno+",\"brojVjezbiSedmicno\":"+predmet.broj_vjezbi_sedmicno+"}"
    console.log(4);
    res.json(JSON.parse(prisustvojson))

    /*fs.readFile("public/data/prisustvo.json","utf-8",function(err,data){
        if(!err){
            var podaci = JSON.parse(data)
            podaci.forEach(element => {
                if(element.predmet==naziv){
                    res.json(element)
                }
            });
        }
    })*/
})

app.get('/predmeti',function(req,res){
    if(req.session.username==null){
        res.json({greska:"Nastavnik nije loginovan"})
    }
    res.json(req.session.predmeti)
})

app.post('/prisustvo/predmet/:naziv/student/:index',async function(req,res){
    let index = req.params.index
    let predmet = req.params.naziv
    let sedmica = req.body['sedmica']
    let predavanja = req.body['predavanja']
    let vjezbe = req.body['vjezbe']

    const student = await Student.findOne({where : {index:index}})
    const predmetobj = await Predmet.findOne({where : {naziv:predmet}})

    const prisustvo = await Prisustvo.findOne({ where: {
        [Op.and] : [
            {predmetId:predmetobj.id},
            {studentId:student.id},
            {sedmica:sedmica}
        ]
    }})

    if(prisustvo==null){
        await Prisustvo.create({
            sedmica:sedmica,
            predavanja:predavanja,
            vjezbe:vjezbe,
            predmetId:predmetobj.id,
            studentId:student.id})
    }
    else{
        prisustvo.predavanja=predavanja
        prisustvo.vjezbe=vjezbe
        await prisustvo.save()
    }
    
    const idStudenata = await Prisustvo.findAll({where: {predmetId:predmetobj.id}, attributes: [[sequelize.fn('DISTINCT', sequelize.col('studentId')), 'studentId']]})
    var prisustvojson="{ \"studenti\":[";
    for(const element of idStudenata) {
        const student = await Student.findOne({where : {id:element.studentId}})
        prisustvojson+="{\"ime\":\""+student.ime+"\",\"index\":"+student.index+"},"
        
    };

    prisustvojson=prisustvojson.substring(0,prisustvojson.length-1)
    prisustvojson+="],\"prisustva\":["

    const prisustva = await Prisustvo.findAll({where : {predmetId:predmetobj.id}})
    for(const element of prisustva) {
        prisustvojson+="{ \"sedmica\":"+element.sedmica+", \"predavanja\":"+element.predavanja+", \"vjezbe\":"+element.vjezbe+", \"index\":"
        const pomocnistudent = await Student.findOne({where : {id:element.studentId}})
        prisustvojson+=pomocnistudent.index+"},"
        
    };
    prisustvojson=prisustvojson.substring(0,prisustvojson.length-1)
    prisustvojson+="], \"predmet\": \""+predmet+"\", \"brojPredavanjaSedmicno\": "+predmetobj.broj_predavanja_sedmicno+",\"brojVjezbiSedmicno\":"+predmetobj.broj_vjezbi_sedmicno+"}"

    res.json(JSON.parse(prisustvojson))
    

    /*var podaci = fs.readFileSync("public/data/prisustvo.json")
    podaci=JSON.parse(podaci)
    podaci.forEach(element => {
        if(element.predmet==predmet){
            element.prisustva.forEach(element2 => {
                if(element2.index==index && element2.sedmica==sedmica){
                    element2.predavanja=predavanja
                    element2.vjezbe=vjezbe
                    bijela=false
                }
            });
        }
    });
    if(bijela){
        podaci.forEach(element => {
            if(element.predmet==predmet){
                element.prisustva.push({"sedmica":sedmica,"predavanja":predavanja,"vjezbe":vjezbe,"index":parseInt(index)})
            }
        });
    }
    fs.writeFileSync("public/data/prisustvo.json",JSON.stringify(podaci))
    podaci.forEach(element => {
        if(element.predmet==predmet){
            res.json(element)
        }
    });*/
})

app.listen(3000);