# Werkplaats 4

Een 360-graden Feedback Tool gemaakt in React / Node.

### Dit project is gemaakt met:
- ReactJS
- Node
- Express.js
- JSX 
- Create-React-App

### Functionaliteiten:
- Basic React website met een paar routes.


## Om deze webapplicatie te starten doe het volgende:
- Installeer Node.JS van de website. https://nodejs.org/en 
  Deze applicatie gebruikt 18.16.0 LTS.
- Type in de terminal van de IDE: 
```
npm install
```
- Dit installeert de Package.json file die in de Github staat. Die hebben we nodig om de applicatie te runnen.


- Om de applicatie te runnen type in de terminal
```
npm start
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