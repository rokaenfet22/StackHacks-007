//Extract Modules
const express = require("express")
const body_parser = require("body-parser")
const { JSDOM } = require( "jsdom" );
const request = require("request");

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

app.get('/', function (req, resp) {
    try {
        resp.sendFile('./client/index.html');
    } catch {
        resp.sendStatus(400);
    }
});

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
            res.json({"origin":origin_formatted_address,"destination":destination_formatted_address})
        })
        .catch((e) => {
            console.log(e.response.data.error_message);
        });
    })
    .catch((e) => {
        console.log(e.response.data.error_message);
    });
})

app.post("/getDistance", (originalResponse, response) => {
    try{
    request(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originalResponse.body.origin}&destinations=${originalResponse.body.destination}&units=metric&key=AIzaSyCXLSnpeBg1BtMCIFBgD35F8sPIINUqW68`, 
    (err, res, body) => {
        body = JSON.parse(body)
        response.json({"distance":body.rows[0].elements[0].distance.value})
    }) } catch{
        response.sendStatus(500);
    }
})

app.post('/getEmissions', function (req, resp) {
    try {
        const distance = req.body.distance;
        const modesOfTravel = ['car', 'train', 'plane', 'helicopter', 'submarine', 'carPlane', 'blimp', 'hotAirBalloon'];
        var emissions = [];
        for (const mode of modesOfTravel) {
            emissions.push(carbonEmission(mode, distance));
        }
        resp.json({emissions});
    } catch {
        resp.sendStatus(400);
    }
});

function carbonEmission (mode, distance) {
    distance = distance/1000;
    switch (mode) {
        case 'car':
            var carbonFootprintPerUnit = 0.45; //Aston Martin DB5 kg/km carbon emissions
            break;
        case 'train':
            var carbonFootprintPerUnit = 0.041; //Train (Spectre)
            break;
        case 'plane':
            var carbonFootprintPerUnit = 0.133; //Boeing 747-236B 'Skyfleet S570' (Casino Royale)
            break;
        case 'helicopter':
            var carbonFootprintPerUnit = 0.627; //Bell 206 JetRanger (The Spy Who Loved Me)
            break;
        case 'submarine':
            var carbonFootprintPerUnit = 0.415; //Lotus Esprint Wet Nellie Submarine-car (The Spy Who Loved Me)
            break;
        case 'carPlane':
            var carbonFootprintPerUnit = 0.463; //Carplane based on 1974 AMC Matador (The Man with the Golden Gun)
            break;
        case 'blimp':
            var carbonFootprintPerUnit = 0.027; //Zorin's Blimp (A View To A Kill)
            break;
        case 'hotAirBalloon':
            var carbonFootprintPerUnit = 9.32; //Hot Air Balloon (Octopussy)
    }
    var carbonEmission = (distance*(carbonFootprintPerUnit)); // kg
    return carbonEmission;
}

app.listen(process.env.PORT);