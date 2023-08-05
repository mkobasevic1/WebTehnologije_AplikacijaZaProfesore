let div = document.getElementById("divSadrzaj");
//instanciranje
let prisustvo = TabelaPrisustvo(div,
    {
        "studenti": [{
                "ime": "Neko Nekic",
                "index": 12345
            },
            {
                "ime": "Drugi Neko",
                "index": 12346
            }
        ],
        "prisustva": [{
            "sedmica": 1,
            "predavanja": 2,
            "vjezbe": 1,
            "index": 12345
        },
        {
            "sedmica": 1,
            "predavanja": 2,
            "vjezbe": 2,
            "index": 12346
        },
        {
            "sedmica": 2,
            "predavanja": 2,
            "vjezbe": 1,
            "index": 12345
        },
        {
            "sedmica": 2,
            "predavanja": 2,
            "vjezbe": 2,
            "index": 12346
        },
        
        {
                "sedmica": 3,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12345
            },
            {
                "sedmica": 3,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12346
            }
            ,
            
            {
                "sedmica": 4,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12346
            }
            ,
            
            {
                "sedmica": 5,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12346
            }
            ,
            
            {
                "sedmica": 6,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12346
            }
            ,
            {
                "sedmica": 7,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12345
            },
            {
                "sedmica": 7,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12346
            }
            ,
            {
                "sedmica": 8,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12345
            },
            
            {
                "sedmica": 9,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12345
            },
            {
                "sedmica": 9,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12346
            }
            ,
            {
                "sedmica": 10,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12345
            },
            {
                "sedmica": 10,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12346
            }
            ,
            {
                "sedmica": 11,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12345
            },
        
            {
                "sedmica": 11,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12346
            }
            ,
            {
                "sedmica": 12,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12345
            },
            {
                "sedmica": 12,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12346
            }
            ,
            {
                "sedmica": 13,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12345
            },
            {
                "sedmica": 13,
                "predavanja": 2,
                "vjezbe": 0,
                "index": 12346
            }
            
            
            
        ],
        "predmet": "Razvoj mobilnih aplikacija",
        "brojPredavanjaSedmicno": 2,
        "brojVjezbiSedmicno": 2
    });
//pozivanje metoda
let prethodniButton = document.getElementById("Nazad");
let sljedeciButton = document.getElementById("Naprijed");
prethodniButton.setAttribute('onclick','prisustvo.prethodnaSedmica()');
sljedeciButton.setAttribute('onclick','prisustvo.sljedecaSedmica()');

