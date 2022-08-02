# Znamenitosti





## Opis
Prikaz tablice podataka, pretraživanje po atributima, te login/signup putem OpenID Connect pružatelja identiteta.

## Autor
Lorena Martinović

## Verzija
4.0

## Jezik podataka
Engleski

## Licenca
Creative Commons Attribution-ShareAlike 3.0 Unported License
S obzirom da su svi podaci o znamenitostima preuzeti sa Wikipedije, napisani su engleskim jezikom te imaju licencu Creative Commons Attribution-ShareAlike 3.0 Unported License.

## Opis podataka
Skup otvorenih podataka se sastoji od atributa:

- identifikator znamenitosti
- naziv znamenitosti
- stoljeće u kojem je izgrađena znamenitost
- tip znamenitosti
- visina znamenitosti
- umjetnički stil znamenitosti
- grad u kojem se nalazi
- država u kojem se nalazi 
- ime arhitekta
- prezime arhitekta

## Ciljevi projekta
### Verzija 1.0
Podaci su sirovi materijali iz kojih se mogu dobiti informacije i znanje. Kada se podacima pridruži kontekst, oni postaju informacije iz kojih se kroz spoznaje stvara određeno znanje. Otvoreni podaci su podaci kojima bilo tko može slobodno pristupiti, koristiti ih i dijeliti ih. Otvaranjem podataka stvaramo mogućnost kreiranja novog znanja koje originalni kreator podataka još nije spoznao.

Cilj je ove verzije bio upoznavanje s procesom kreiranja otvorenog skupa podataka te njegovog dijeljenja u obliku javnog git repozitorija

### Verzija 2.0
Za pristupačnost podataka i vidljivost podataka, korisno je kreirati web grafičko sučelje u kojemu će biti moguće pristupiti različitim verzijama skupova podataka te njihovim metapodacima u formatima čitljivim ljudima i strojevima.

Cilj ove verzije je proširenje znanja u procesu izrade otvorenog skupa podataka s naglaskom na povećanje pristupačnosti i vidljivosti kroz izradu tabličnog HTML web sučelja uz obrazac za filtriranje zapisa, te strukturiranog strojno čitljivog oblika metapodataka u obliku JSON Schema.

### Verzija 3.0
API (Application Programming Interface) je posrednička komponenta programske podrške koja omogućuje interakciju s drugim (udaljenim) komponentama programske podrške. API-ji pojedinih aplikacija apstrahiraju implementaciju i komponente izlažući klijentskoj aplikaciji sučelje za upravljanje podacima. Danas API-ji obično slijede arhitekturalni stil REST (Representational State Transfer) za izgradnju raspodijeljenih sustava.

U sklopu ove verzije, skup otvorenih podataka iz prijašnjih verzija potrebno je izložiti kroz RESTful API. 

### Verzija 4.0
Cilj izlaganja API-ja kao posredničke komponente programske podrške, interakcija je s drugim udaljenim komponentama. Te komponente mogu biti klijentske aplikacije koje se izvršavaju u web preglednicima, na mobilnim uređajima korisnika, ali i druge udaljene komponente koje su sakrivene od krajnjih korisnika te koje izlažu vlastite API-je. Neke od tih komponenti mogu biti i usluge za autentifikaciju korisnika te autorizaciju pristupa uslugama, poznatije kao Single sign-on usluge. Takve usluge omogućavaju korisnicima koji na njima već imaju korisničke račune, da delegiraju vlastite osobne podatke te podatke o pravima pristupa drugim aplikacijama. Na taj se način korisnicima omogućava pristup aplikacijama bez potrebe za otvaranjem korisničkih računa na tim aplikacijama. Prednosti Single sign-on paradigme su jednostavnost korištenja za korisnika koji može jednostavno ponovno iskoristiti neki od postojećih računa za prijavu te povećana razina sigurnosti jer korisnik ne ostavlja svoju lozinku još jednoj usluzi za koju nije siguran čuva li je na ispravan način. S negativne strane, na ovaj način stvara se jedna kritična točka kvara sustava. Ako u nekom vremenskom trenutku usluga koja pruža autentifikaciju i autorizaciju padne, korisnici pojedinih aplikacija privremeno se neće moći prijaviti u te aplikacije. Primjeri pružatelja Single sign-on usluga su npr. Google, Facebook, Apple, Microsoft i dr. 

U sklopu ove verzije, cilj je integrirati vanjsku uslugu autentifikacije u vašu web-aplikaciju korištenjem sloja OpenID Connect nad protokolom OAuth 2.0 (RFC6749). Uz integraciju s vanjskom uslugom za autentifikaciju, cilj je i dopuna vlastitog skupa podataka semantičkim povezivanjem s drugim vrstama podataka korištenjem specifikacije JSON-LD.

