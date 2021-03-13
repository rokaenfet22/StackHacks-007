//Extract Modules
const express = require("express")
const body_parser = require("body-parser")
const { JSDOM } = require( "jsdom" );

//Using Jsdom to create blank window to be able to use jquery in node
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

//Immediate use of modules
const app = express()
app.use(express.static("./app/client")) //serving static files from /client dir
app.use(express.json()) //Parsing json-encoded bodies

//Initializing npm installed google apis
const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});

//Returning English Formatted Address from Address ID's
app.post("/sendPlaceId", function (req, res){
    const originId = req.body.origin
    const destinationId = req.body.destination
    client
    .geocode({
        params: {
        place_id: originId,
        key: "AIzaSyA7v1SCQ8iEDAj5gZzQvbGs_Yr8tPe2Wmc" //API key for Geocode
        },
        timeout: 1000, // milliseconds
    })
    .then((r) => {
        let origin_formatted_address = r.data.results[0].formatted_address
        client
        .geocode({
            params: {
            place_id: destinationId,
            key: "AIzaSyA7v1SCQ8iEDAj5gZzQvbGs_Yr8tPe2Wmc" //API key for Geocode
            },
            timeout: 1000, // milliseconds
        })
        .then((r) => {
            let destination_formatted_address = r.data.results[0].formatted_address
            res.json([origin_formatted_address,destination_formatted_address])
        })
        .catch((e) => {
            console.log(e.response.data.error_message);
        });
    })
    .catch((e) => {
        console.log(e.response.data.error_message);
    });
})

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

app.listen("8090")
console.log("Server running at http://127.0.0.1:8090/")