async function retrieveDetails () {
    const start = 
    const destination = 
    const paras = { start: start, destination: destination };
    const response = await fetch('http://127.0.0.1:8080/getDetails', {
        method: 'GET',
        headers: {'content-type':'application/json'},
        body: JSON.stringify(paras)
    });
    const details = await response.json();
    for (const emissions in details) {

    }
    filler(distance);
}

function filler (distance) {
    modesOfTravel = ['car', 'train', 'plane', 'helicopter', 'submarine', 'carPlane', 'blimp', 'hotAirBalloon'];
    for (const mode in modesOfTravel) {
        document.getElementById(mode).innerHTML = carbonEmission(mode, distance);
    }
}

