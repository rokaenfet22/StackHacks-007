//Extract Modules
const express = require("express")
const body_parser = require("body-parser")

//Immediate use of modules
const app = express()
app.use(express.static("./app/client")) //serving static files from /client dir
app.use(express.json()) //Parsing json-encoded bodies

app.get('/getDetails', function (req, resp) {
    try {
        const distance = req.body.distance;
        const modesOfTravel = ['car', 'train', 'plane', 'helicopter', 'submarine', 'carPlane', 'blimp', 'hotAirBalloon'];
        var emissions = [];
        for (const mode in modesOfTravel) {
            emissions.push(mode + ':' + carbonEmission(mode, distance));
        }
        resp.status(400).json(emissions);
    } catch {
        resp.sendStatus(400);
    }
});

function carbonEmission (mode, distance) {
    switch (mode) {
        case 'car':
            var speed = 48.28; //This is 30mph but in kmh
            var carbonFootprintPerUnit = 640; //Aston Martin DB5 g/km carbon emissions
            break;
        case 'train':
            var speed = 200; //kmh
            var carbonFootprintPerUnit = 41; //Train (Spectre)
            break;
        case 'plane':
            var speed = 900; //kmh
            var carbonFootprintPerUnit = 255; //Boeing 747-236B 'Skyfleet S570' (Casino Royale)
            break;
        case 'helicopter':
            var speed = 260; //kmh
            var carbonFootprintPerUnit = 240; //Bell 206 JetRanger (The Spy Who Loved Me)
            break;
        case 'submarine':
            var speed = 37; //kmh
            var carbonFootprintPerUnit = 600; //Lotus Esprint Wet Nellie Submarine-car (The Spy Who Loved Me)
            break;
        case 'carPlane':
            var speed = 100; //kmh
            var carbonFootprintPerUnit = 740; //Carplane based on 1974 AMC Matador (The Man with the Golden Gun)
            break;
        case 'blimp':
            var speed = 80; //kmh
            var carbonFootprintPerUnit = 51; //Zorin's Blimp (A View To A Kill)
            break;
        case 'hotAirBalloon':
            var speed = 7;
            var carbonFootprintPerUnit = 180; //Hot Air Balloon (Octopussy)
    }
    var carbonEmission = ((distance/speed)*carbonFootprintPerUnit)/1000; //g
    return carbonEmission;
}

app.listen("8080")
console.log("Server running at http://127.0.0.1:8080/")