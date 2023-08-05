let TabelaPrisustvo = function (divRef, podaci) {
    //privatni atributi modula
    //
    if(divRef==null || podaci==null){
        return null;
    }
    divRef.innerHTML="";

    if(podaci.prisustva.find(x=> x.predavanja > podaci.brojPredavanjaSedmicno || x.vjezbe > podaci.brojVjezbiSedmicno)!=null){
        divRef.innerHTML="<h2>Podaci o prisustvu nisu validni</h2>";
        return false;
    }
    if(podaci.prisustva.find(x=>x.predavanja<0 || podaci.vjezbe<0)!=null){
        divRef.innerHTML="<h2>Podaci o prisustvu nisu validni</h2>";
        return false;
    }
    for(let i=0;i<podaci.studenti.length;i++){
        var rez = podaci.prisustva.filter(x=>x.index==podaci.studenti[i].index);
        rez = rez.map(x=>x.sedmica);
        for(let j=0;j<rez.length;j++){
            for(let k=j+1;k<rez.length;k++){
                if(rez[j]==rez[k]){
                    divRef.innerHTML="<h2>Podaci o prisustvu nisu validni</h2>";
                    return false;
                }
            }
        }        
    }
    var indeksi = podaci.studenti.map(x=>x.index);
    for(let i=0;i<indeksi.length;i++){
        for(let j=i+1;j<indeksi.length;j++){
            if(indeksi[i]==indeksi[j]){
                divRef.innerHTML="<h2>Podaci o prisustvu nisu validni</h2>";
                return false;
            }
        }
    }
    var prisustvoIndeksi = podaci.prisustva.map(x=>x.index);
    for(let i=0;i<prisustvoIndeksi.length;i++){
        if(indeksi.includes(prisustvoIndeksi[i])==false){
            divRef.innerHTML="<h2>Podaci o prisustvu nisu validni</h2>";
            return false;
        }
    }
    var sedmicePrisustvo = podaci.prisustva.map(x=>x.sedmica);
    sedmicePrisustvo=sedmicePrisustvo.sort(function(a, b){return a - b});
    for(let i=0;i<sedmicePrisustvo.length-2;i++){
        var razlika = sedmicePrisustvo[i+1]-sedmicePrisustvo[i];
        if(sedmicePrisustvo[i+1]-sedmicePrisustvo[i]>1){
            divRef.innerHTML="<h2>Podaci o prisustvu nisu validni</h2>";
            return false;
        }
        
    }
    trenutna = podaci.prisustva.map(x=>x.sedmica);
    trenutna = Math.max(...trenutna);
    
    divRef.innerHTML="<h2>"+podaci.predmet+"</h2>";
    const rimski=["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"];
    var tabela = "<table id=\"tabela\">";
    let brStudenata = parseInt(podaci.studenti.length)*2+1;
    for(let i=0; i<brStudenata; i++){
        var red = "<tr>";
        var ostaloPredavanja = parseInt(podaci.brojPredavanjaSedmicno);
        var upisanoPredavanja=0;
        var upisanoVjezbi=0;
        for(var j=0;j<15+1+podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno;j++){
            if(i==0){
                if(j==0){
                    var celija = "<th>Ime</th>";
                    red+=celija;
                }
                else if(j==1){
                    var celija = "<th>Index</th>";
                    red+=celija;
                }
                else if(j>1 && j<trenutna+1){
                    var celija = "<th>";
                    celija+=rimski[j-2];
                    celija+="</th>";
                    red+=celija;
                }
                else if(j==trenutna+1){
                    var celija = "<th colspan=\""+(podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno)+"\">";
                    celija+=rimski[j-2];
                    celija+="</th>";
                    red+=celija;
                }
                else if(j==trenutna+2 && trenutna!=15){
                    var celija = "<th colspan=\""+(15-trenutna)+"\">";
                    celija+=rimski[j-2];
                    if(trenutna!=14){
                        celija+="-"+rimski[14];
                    }
                    celija+="</th>";
                    red+=celija;
                }
            }
            else{
                if(i%2==0 && j<podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno){
                    var prisustvaStudent = podaci.prisustva.find(x => x.index == podaci.studenti[i/2-1].index && x.sedmica==trenutna)
                    if(prisustvaStudent==null){
                        if(j<podaci.brojPredavanjaSedmicno){
                            var celija = "<td onclick=\"bijelaKlik(this,'"+podaci.predmet+"',"+podaci.studenti[i/2-1].index+","+trenutna+",1,0)\"></td>";
                        }
                        else{
                            var celija = "<td onclick=\"bijelaKlik(this,'"+podaci.predmet+"',"+podaci.studenti[i/2-1].index+","+trenutna+",0,1)\"></td>";
                        }
                    }
                    else if(j<podaci.brojPredavanjaSedmicno && upisanoPredavanja<prisustvaStudent.predavanja){
                        upisanoPredavanja++;
                        var celija = "<td class=\"zelena\" onclick=\"zelenaKlik(this,'"+podaci.predmet+"',"+podaci.studenti[i/2-1].index+","+trenutna+","+(prisustvaStudent.predavanja-1)+","+prisustvaStudent.vjezbe+")\"></td>";
                    }
                    else if(j<podaci.brojPredavanjaSedmicno && upisanoPredavanja>=prisustvaStudent.predavanja){
                        var celija = "<td class=\"crvena\" onclick=\"crvenaKlik(this,'"+podaci.predmet+"',"+podaci.studenti[i/2-1].index+","+trenutna+","+(prisustvaStudent.predavanja+1)+","+prisustvaStudent.vjezbe+")\"></td>";
                    }
                    else if(j-podaci.brojPredavanjaSedmicno<podaci.brojVjezbiSedmicno && upisanoVjezbi<prisustvaStudent.vjezbe){
                        upisanoVjezbi++;
                        var celija = "<td class=\"zelena\" onclick=\"zelenaKlik(this,'"+podaci.predmet+"',"+podaci.studenti[i/2-1].index+","+trenutna+","+prisustvaStudent.predavanja+","+(prisustvaStudent.vjezbe-1)+")\"></td>";
                    }
                    else if(j-podaci.brojPredavanjaSedmicno<podaci.brojVjezbiSedmicno && upisanoVjezbi>=prisustvaStudent.vjezbe){
                        var celija = "<td class=\"crvena\" onclick=\"crvenaKlik(this,'"+podaci.predmet+"',"+podaci.studenti[i/2-1].index+","+trenutna+","+prisustvaStudent.predavanja+","+(prisustvaStudent.vjezbe+1)+")\"></td>";
                    }
                    
                    red+=celija;
                }
                else if(i%2==1){
                    var prisustvaStudent = podaci.prisustva.find(x => x.index == podaci.studenti[(i-1)/2].index && x.sedmica==j-1); 
                    if(j==0){
                    var celija = "<td rowspan=\"2\">";
                    celija+=podaci.studenti[(i-1)/2].ime;
                    celija+="</td>";
                    red+=celija;
                    }
                    else if(j==1){
                        var celija = "<td rowspan=\"2\">";
                    celija+=podaci.studenti[(i-1)/2].index;
                    celija+="</td>";
                    red+=celija;
                    }
                    else if(j>1 && j<trenutna+1 && prisustvaStudent==null){
                        var celija = "<td rowspan=\"2\"></td>";
                        red+=celija;
                    }
                    else if(j>1 && j<trenutna+1){
                    var celija = "<td rowspan=\"2\">";
                    celija+=(prisustvaStudent.predavanja+prisustvaStudent.vjezbe)/(podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno)*100 + "%";
                    celija+="</td>";
                    red+=celija;
                    }
                    else if(j>=trenutna+1 && j<=podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno+trenutna){
                    var celija = "<td>";
                        if(ostaloPredavanja>0){
                            celija+="P</td>";
                            ostaloPredavanja--;
                        }
                        else{
                            celija+="V</td>";
                        }
                    red+=celija;
                    }
                }
                
                if(j>podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno+trenutna && i%2!=0){
                    var celija = "<td class=\"bez_rubova\" rowspan=\"2\"></td>";
                    red+=celija;
                }
                
            }            
        }
        red+="</tr>";
        tabela+=red;
    }
    tabela+="</table>";
    divRef.innerHTML+=tabela;
    divRef.innerHTML+="<br> <button  id=\"Nazad\"><svg height = \"40px\" width=\"40px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d=\"M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z\"/></svg></button>";
    divRef.innerHTML+="<button id=\"Naprijed\"><svg height=\"40px\" width=\"40px\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d=\"M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z\"/></svg></button>";
    divRef.innerHTML+="<script src=\"script.js\"></script>";
    //implementacija metoda
    let sljedecaSedmica = function () {
        if(trenutna==Math.max(...podaci.prisustva.map(x=>x.sedmica))){
            return false;
        }
        trenutna++;
        var t = document.getElementById("tabela");
        t.innerHTML="";
        var tabela="";
        let brStudenata = parseInt(podaci.studenti.length)*2+1;
    for(let i=0; i<brStudenata; i++){
        var red = "<tr>";
        var ostaloPredavanja = parseInt(podaci.brojPredavanjaSedmicno);
        var upisanoPredavanja=0;
        var upisanoVjezbi=0;
        for(var j=0;j<15+1+podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno;j++){
            if(i==0){
                if(j==0){
                    var celija = "<th>Ime</th>";
                    red+=celija;
                }
                else if(j==1){
                    var celija = "<th>Index</th>";
                    red+=celija;
                }
                else if(j>1 && j<trenutna+1){
                    var celija = "<th>";
                    celija+=rimski[j-2];
                    celija+="</th>";
                    red+=celija;
                }
                else if(j==trenutna+1){
                    var celija = "<th colspan=\""+(podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno)+"\">";
                    celija+=rimski[j-2];
                    celija+="</th>";
                    red+=celija;
                }
                else if(j==trenutna+2 && trenutna!=15){
                    var celija = "<th colspan=\""+(15-trenutna)+"\">";
                    celija+=rimski[j-2];
                    if(trenutna!=14){
                        celija+="-"+rimski[14];
                    }
                    celija+="</th>";
                    red+=celija;
                }
            }
            else{
                if(i%2==0 && j<podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno){
                    var prisustvaStudent = podaci.prisustva.find(x => x.index == podaci.studenti[i/2-1].index && x.sedmica==trenutna)
                    if(prisustvaStudent==null){
                        if(j<podaci.brojPredavanjaSedmicno){
                            var celija = "<td onclick=\"bijelaKlik(this,'"+podaci.predmet+"',"+podaci.studenti[i/2-1].index+","+trenutna+",1,0)\"></td>";
                        }
                        else{
                            var celija = "<td onclick=\"bijelaKlik(this,'"+podaci.predmet+"',"+podaci.studenti[i/2-1].index+","+trenutna+",0,1)\"></td>";
                        }
                    }
                    else if(j<podaci.brojPredavanjaSedmicno && upisanoPredavanja<prisustvaStudent.predavanja){
                        upisanoPredavanja++;
                        var celija = "<td class=\"zelena\" onclick=\"zelenaKlik(this,"+podaci.predmet+","+podaci.studenti[i/2-1].index+","+trenutna+","+(prisustvaStudent.predavanja-1)+","+prisustvaStudent.vjezbe+")\"></td>";
                    }
                    else if(j<podaci.brojPredavanjaSedmicno && upisanoPredavanja>=prisustvaStudent.predavanja){
                        var celija = "<td class=\"crvena\" onclick=\"crvenaKlik(this,'"+podaci.predmet+"',"+podaci.studenti[i/2-1].index+","+trenutna+","+(prisustvaStudent.predavanja+1)+","+prisustvaStudent.vjezbe+")\"></td>";
                    }
                    else if(j-podaci.brojPredavanjaSedmicno<podaci.brojVjezbiSedmicno && upisanoVjezbi<prisustvaStudent.vjezbe){
                        upisanoVjezbi++;
                        var celija = "<td class=\"zelena\" onclick=\"zelenaKlik(this,'"+podaci.predmet+"',"+podaci.studenti[i/2-1].index+","+trenutna+","+prisustvaStudent.predavanja+","+(prisustvaStudent.vjezbe-1)+")\"></td>";
                    }
                    else if(j-podaci.brojPredavanjaSedmicno<podaci.brojVjezbiSedmicno && upisanoVjezbi>=prisustvaStudent.vjezbe){
                        var celija = "<td class=\"crvena\" onclick=\"crvenaKlik(this,'"+podaci.predmet+"',"+podaci.studenti[i/2-1].index+","+trenutna+","+prisustvaStudent.predavanja+","+(prisustvaStudent.vjezbe+1)+")\"></td>";
                    }
                    
                    red+=celija;
                }
                else if(i%2==1){
                    var prisustvaStudent = podaci.prisustva.find(x => x.index == podaci.studenti[(i-1)/2].index && x.sedmica==j-1); 
                    if(j==0){
                    var celija = "<td rowspan=\"2\">";
                    celija+=podaci.studenti[(i-1)/2].ime;
                    celija+="</td>";
                    red+=celija;
                    }
                    else if(j==1){
                        var celija = "<td rowspan=\"2\">";
                    celija+=podaci.studenti[(i-1)/2].index;
                    celija+="</td>";
                    red+=celija;
                    }
                    else if(j>1 && j<trenutna+1 && prisustvaStudent==null){
                        var celija = "<td rowspan=\"2\"></td>";
                        red+=celija;
                    }
                    else if(j>1 && j<trenutna+1){
                    var celija = "<td rowspan=\"2\">";
                    celija+=(prisustvaStudent.predavanja+prisustvaStudent.vjezbe)/(podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno)*100 + "%";
                    celija+="</td>";
                    red+=celija;
                    }
                    else if(j>=trenutna+1 && j<=podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno+trenutna){
                    var celija = "<td>";
                        if(ostaloPredavanja>0){
                            celija+="P</td>";
                            ostaloPredavanja--;
                        }
                        else{
                            celija+="V</td>";
                        }
                    red+=celija;
                    }
                }
                
                if(j>podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno+trenutna && i%2!=0){
                    var celija = "<td class=\"bez_rubova\" rowspan=\"2\"></td>";
                    red+=celija;
                }
                
            }            
        }
        red+="</tr>";
        tabela+=red;
    }
    t.innerHTML+=tabela;
        return true;
    }

    let prethodnaSedmica = function () {
        if(trenutna==1){
            return false;
        }
        trenutna--;
        var t = document.getElementById("tabela");
        t.innerHTML="";
        var tabela="";
        let brStudenata = parseInt(podaci.studenti.length)*2+1;
    for(let i=0; i<brStudenata; i++){
        var red = "<tr>";
        var ostaloPredavanja = parseInt(podaci.brojPredavanjaSedmicno);
        var upisanoPredavanja=0;
        var upisanoVjezbi=0;
        for(var j=0;j<15+1+podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno;j++){
            if(i==0){
                if(j==0){
                    var celija = "<th>Ime</th>";
                    red+=celija;
                }
                else if(j==1){
                    var celija = "<th>Index</th>";
                    red+=celija;
                }
                else if(j>1 && j<trenutna+1){
                    var celija = "<th>";
                    celija+=rimski[j-2];
                    celija+="</th>";
                    red+=celija;
                }
                else if(j==trenutna+1){
                    var celija = "<th colspan=\""+(podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno)+"\">";
                    celija+=rimski[j-2];
                    celija+="</th>";
                    red+=celija;
                }
                else if(j==trenutna+2 && trenutna!=15){
                    var celija = "<th colspan=\""+(15-trenutna)+"\">";
                    celija+=rimski[j-2];
                    if(trenutna!=14){
                        celija+="-"+rimski[14];
                    }
                    celija+="</th>";
                    red+=celija;
                }
            }
            else{
                if(i%2==0 && j<podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno){
                    var prisustvaStudent = podaci.prisustva.find(x => x.index == podaci.studenti[i/2-1].index && x.sedmica==trenutna)
                    if(prisustvaStudent==null){
                        if(j<podaci.brojPredavanjaSedmicno){
                            var celija = "<td onclick=\"bijelaKlik(this,'"+podaci.predmet+"',"+podaci.studenti[i/2-1].index+","+trenutna+",1,0)\"></td>";
                        }
                        else{
                            var celija = "<td onclick=\"bijelaKlik(this,'"+podaci.predmet+"',"+podaci.studenti[i/2-1].index+","+trenutna+",0,1)\"></td>";
                        }
                    }
                    else if(j<podaci.brojPredavanjaSedmicno && upisanoPredavanja<prisustvaStudent.predavanja){
                        upisanoPredavanja++;
                        var celija = "<td class=\"zelena\" onclick=\"zelenaKlik(this,'"+podaci.predmet+"',"+podaci.studenti[i/2-1].index+","+trenutna+","+(prisustvaStudent.predavanja-1)+","+prisustvaStudent.vjezbe+")\"></td>";
                    }
                    else if(j<podaci.brojPredavanjaSedmicno && upisanoPredavanja>=prisustvaStudent.predavanja){
                        var celija = "<td class=\"crvena\" onclick=\"crvenaKlik(this,'"+podaci.predmet+"',"+podaci.studenti[i/2-1].index+","+trenutna+","+(prisustvaStudent.predavanja+1)+","+prisustvaStudent.vjezbe+")\"></td>";
                    }
                    else if(j-podaci.brojPredavanjaSedmicno<podaci.brojVjezbiSedmicno && upisanoVjezbi<prisustvaStudent.vjezbe){
                        upisanoVjezbi++;
                        var celija = "<td class=\"zelena\" onclick=\"zelenaKlik(this,'"+podaci.predmet+"',"+podaci.studenti[i/2-1].index+","+trenutna+","+prisustvaStudent.predavanja+","+(prisustvaStudent.vjezbe-1)+")\"></td>";
                    }
                    else if(j-podaci.brojPredavanjaSedmicno<podaci.brojVjezbiSedmicno && upisanoVjezbi>=prisustvaStudent.vjezbe){
                        var celija = "<td class=\"crvena\" onclick=\"crvenaKlik(this,'"+podaci.predmet+"',"+podaci.studenti[i/2-1].index+","+trenutna+","+prisustvaStudent.predavanja+","+(prisustvaStudent.vjezbe+1)+")\"></td>";
                    }
                    
                    red+=celija;
                }
                else if(i%2==1){
                    var prisustvaStudent = podaci.prisustva.find(x => x.index == podaci.studenti[(i-1)/2].index && x.sedmica==j-1); 
                    if(j==0){
                    var celija = "<td rowspan=\"2\">";
                    celija+=podaci.studenti[(i-1)/2].ime;
                    celija+="</td>";
                    red+=celija;
                    }
                    else if(j==1){
                        var celija = "<td rowspan=\"2\">";
                    celija+=podaci.studenti[(i-1)/2].index;
                    celija+="</td>";
                    red+=celija;
                    }
                    else if(j>1 && j<trenutna+1 && prisustvaStudent==null){
                        var celija = "<td rowspan=\"2\"></td>";
                        red+=celija;
                    }
                    else if(j>1 && j<trenutna+1){
                    var celija = "<td rowspan=\"2\">";
                    celija+=(prisustvaStudent.predavanja+prisustvaStudent.vjezbe)/(podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno)*100 + "%";
                    celija+="</td>";
                    red+=celija;
                    }
                    else if(j>=trenutna+1 && j<=podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno+trenutna){
                    var celija = "<td>";
                        if(ostaloPredavanja>0){
                            celija+="P</td>";
                            ostaloPredavanja--;
                        }
                        else{
                            celija+="V</td>";
                        }
                    red+=celija;
                    }
                }
                
                if(j>podaci.brojPredavanjaSedmicno+podaci.brojVjezbiSedmicno+trenutna && i%2!=0){
                    var celija = "<td class=\"bez_rubova\" rowspan=\"2\"></td>";
                    red+=celija;
                }
                
            }            
        }
        red+="</tr>";
        tabela+=red;
    }
    t.innerHTML+=tabela;
        return true;
    }

    
    
    return {
    sljedecaSedmica: sljedecaSedmica,
    prethodnaSedmica: prethodnaSedmica
    }
};