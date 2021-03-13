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