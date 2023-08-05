var usernamePolje,passwordPolje;
var glavni;
var odjava,submit;
var odjava,lista
var predmeti
var tabela


window.onload=function(){
    usernamePolje = document.getElementById("username")
    passwordPolje = document.getElementById("password")
    glavni = document.getElementById("glavni");
    submit=document.getElementById("submit")
    if(submit!=null){
        submit.addEventListener("click",function(){PoziviAjax.postLogin(usernamePolje.value,passwordPolje.value,ispisiPoruku);})
    }
    odjava=document.getElementById("logout")     
    if(odjava!=null){
        odjava.addEventListener("click",function(){PoziviAjax.postLogout(logout)})
    }   
    lista=document.getElementById("meni")
    tabela=document.getElementById("divSadrzaj")
    if(lista!=null){
        PoziviAjax.getPredmeti(dodajPredmete)
        lista.addEventListener("click",function(){klik(event)})
    }
    if(tabela!=null){
        tabela.innerHTML=" ";
    }
}

crvenaKlik=function(element,predmet,indeks,trenutna,predavanja,vjezbe){
    element.classList.remove("crvena");
    element.classList.add("zelena");
    PoziviAjax.postPrisustvo(predmet,indeks,{sedmica:trenutna,predavanja:predavanja,vjezbe:vjezbe},napraviTabelu)
}

zelenaKlik= function(element,predmet,indeks,trenutna,predavanja,vjezbe){
    element.classList.remove("zelena");
    element.classList.add("crvena");
    PoziviAjax.postPrisustvo(predmet,indeks,{sedmica:trenutna,predavanja:predavanja,vjezbe:vjezbe},napraviTabelu)
}

bijelaKlik =  function(element,predmet,indeks,trenutna,predavanja,vjezbe){
    element.classList.add("zelena");
    console.log("predavanja "+predavanja+" vjezbe "+vjezbe)
    PoziviAjax.postPrisustvo(predmet,indeks,{sedmica:trenutna,predavanja:predavanja,vjezbe:vjezbe},napraviTabelu)
}

function klik(event){
    PoziviAjax.getPredmet(event.target.id,napraviTabelu)
}

function ispisiPoruku(error,poruka){
    if(!error){
        var htmlstring = "<h4>"+poruka+"</h4>";
        if(poruka=="Uspješna prijava"){
            window.location.replace("http://localhost:3000/predmeti.html")
        }
        else{
            glavni.innerHTML=htmlstring;
        }
    }
    else{
        glavni.innerHTML="<h4>"+error+"</h4>"
    }
}

function logout(error,poruka){
    if(!error){
        if(poruka=="Uspješna odjava"){
            window.location.replace("http://localhost:3000/prijava.html")
        }
    }
    else{
        glavni.innerHTML="<h4>"+error+"</h4>"
    }
}

function dodajPredmete(error,predmeti){
    if(!error){
        predmeti.forEach(element => {
            lista.innerHTML+="<input type=\"button\"  value=\""+element+"\" id=\""+element+"\"\>";
        });
    }
    else{
        lista.innerHTML+="<p>"+error+"</p>"
    }
}


function napraviTabelu(error,data){
    if(!error){
        let prisustvo = TabelaPrisustvo(tabela,data)
        let prethodniButton = document.getElementById("Nazad");
        let sljedeciButton = document.getElementById("Naprijed");
        prethodniButton.removeAttribute('onclick');
        sljedeciButton.removeAttribute('onclick');
        prethodniButton.addEventListener("click",function(){prisustvo.prethodnaSedmica()})
        sljedeciButton.addEventListener("click",function(){prisustvo.sljedecaSedmica()})
    }
    else{
        tabela.innerHTML+="<p>"+error+"</p>"
    }
}