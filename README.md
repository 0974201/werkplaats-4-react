# Werkplaats 4

Een 360-graden Feedback Tool gemaakt met ReactJS / Node.js / Express. Met deze tool kunt u enquêtes aanmaken, aanpassen en laten invullen. Antwoorden worden opgeslagen bij elke enquête die ingevuld is. Bestaande vragen kunnen aangepast worden en er is de mogelijkheid om ze te verwijderen of weer te herstellen. Om het gebruiksvriendelijk te maken zijn er knopjes bij de enquêtelijst en vragenlijst die u kunt gebruiken om de soort enquêtes en vragen te sorteren en is er een zoekfunctie.

### Dit project is gemaakt met:
- ReactJS
- Node
- Express.js
- JSX 
- Create-React-App
- React Router

# Functionaliteiten:
- Basic React website met een paar routes.

# Administrator taken:
## Enquêtes aanmaken
- Er kan enquêtes aangemaakt worden met Titel / Begintijd / Eindtijd (optioneel) / Beschrijving en Anonimiteit (optioneel).
- Enquêtes kunnen Open of Multiple Choice vragen aanmaken.
- Bestaande vragen kunnen gekozen worden met een zoekfunctie en er is een keuze tussen Open en  Multiple Choice.
- Preview van hoe de enquête uitziet.
## Enquêtes aanpassen
- Enquêtes kunnen nog aangepast worden als ze nog under review zijn, anders niet.

## Enquetelijst
- Er is een overzicht van de Enquêtelijst.
- Zoekfunctie die door elke enquête heengaat.
- De mogelijkheid om alleen bepaalde soorten enquêtes te zien (Under Review / Open / Closed )
- Er kan gezien worden welke reviews nog gereviewd moeten worden en of ze open of dicht zijn.

## Antwoorden terugzien
- Er is een overzicht van alle antwoorden bij een enquête.
- Per vraag kan je zien welke antwoord gegeven was en op welke datum die antwoord gegeven was. 

## Vragenlijst
- Er is een overzicht van de Vragenlijst
- Zoekfunctie die door elke vraag heengaat.
- De mogelijkheid om alleen bepaalde vragen te zien (Open / Multiple Choice / Deleted)
- Bestaande vragen kunnen verwijderd worden.
- Bestaande vragen kunnen hersteld worden.

## Vragen aanpassen
- Kan bestaande vragen aanpassen.
- Multiple Choice is een beetje wonky..

# Teamleden kunnen:
## Enquêtes beantwoorden
- Enquêtes kan beantwoord worden.
- Kan teruggaan naar vorig gestelde vraag.
- Antwoorden kunnen definitief gemaakt worden (kan alleen inleveren als alle vragen zijn ingevuld)
- Kan zien hoeveel vragen er al zijn beantwoord en hoeveel er nog beantwoorden moeten worden.
- De vragen worden tussentijds opgeslagen.
- De antwoorden en tijd van invullen worden opgeslagen in de database.
- Enquêtes kan niet ingevuld worden als het gesloten is.

## Om deze webapplicatie te starten doe het volgende:
- [Installeer Node.JS van de website.](https://nodejs.org/en)
  Deze applicatie gebruikt 18.16.0 LTS.

-** [Zet de .env file in de root van de map](https://cdn.discordapp.com/attachments/820791682919432202/1116490989230624839/env) (zet hem in de werkplaats 4 map, dus de absolute root) **

- Type in de terminal van de IDE: 
```
npm install
```
- Dit installeert de Package.json file die in de Github staat. Die hebben we nodig om de applicatie te runnen.


- Om de applicatie te runnen open twee terminals en typ in de terminals:
```
npm start
node ./server/server.js
```

- Om het af te sluiten toets in de terminal:
```
CTRL+C
```
## Let op!
De applicatie maakt gebruik van Node.JS 18 en sommige dingen kan je niet meer doen met OpenSSL 3.0.
Vandaar dat we in package.json bij 'scripts' -- openssl-legacy-provider hebben, dit zorgt ervoor dat dit applicatie nog kunnen starten zonder errors.
```
 "scripts": {
        "start": "react-scripts --openssl-legacy-provider start",
        "build": "react-scripts --openssl-legacy-provider build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
 }
 ```

 ## Bronnen
 React Routes aanleggen.
 ```
 https://www.youtube.com/watch?v=Ul3y1LXxzdU&t=1261s 
 ----
 Web Dev Simplified legt uit hoe je de routes moet aanleggen. Ook de error pagina was van hier.
 ```
 Search Filter voor SurveyList en QuestionList.
 ```
 https://www.youtube.com/watch?v=xAqCEBFGdYk
 ----
 Code heb ik overgenomen van Tutorial voor Search filter.
 ```
 Optional Chaining bij React Mapping.
 ```
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
 ----
 Gebruik ik overal just in case zodat het werkt ookal is de waarde null. Het hielp met de search filter laten werken in questionlist (daar moet je door Multiple Choice en Open.. waardoor er null waardes komen in de tables).
 ```
 Video over undefined in react..
 ```
 https://www.youtube.com/watch?v=UZT1V-VJxZE
 ----
 Denk dat ik een error had omdat het mogelijk is dat de data nog niet ingeladen was.. dus gooi je een if statement voor de mapping (variabel && variabel.map)
```
 Laat zien hoe React Mapping en Filter werkt.
 ```
 https://react.dev/learn/updating-arrays-in-state 
 ```
 Alert fade in bij ChangeQuestion.
 ```
 https://stackoverflow.com/questions/42733986/how-to-wait-and-fade-an-element-out 
 ----
 Code bij timer effects in changequestion.jsx om de alert een speciale fade animatie te geven.
 ```

 SqLiteStudio voor uittesten queries.
```
https://sqlitestudio.pl/
```
Stories.MD zijn gemaakt met TrelloExport(Google Chrome Extension).
```
https://chrome.google.com/webstore/detail/trelloexport/kmmnaeamjfdnbhljpedgfchjbkbomahp
```
GetDate functie om de recente datum te krijgen.
```
https://www.freecodecamp.org/news/javascript-get-current-date-todays-date-in-js/
```

Voor de login
```
https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications
```


 CHATGPT voor
 ```
 Timer 5 seconde laat duren in ChangeQuestion.jsx
 Code om de huidige datum te krijgen in YYYY-MM-DD 
 req.params en req.query. // Waren ideeen van ChatGPT waarop ikzelf verder bouw.//
 // Yong Pok //
 
 In server.js komt de runQuery functie van ChatGPT en het basis opzet van de try en catch,
 en het idee om BEGIN, COMMIT en ROLLBACK tegebruiken
```
 
```
Login kan met:
test@test.nl test
(ja de wachtwoorden zijn weer plain-text, sad cat emoji)
``` 
 