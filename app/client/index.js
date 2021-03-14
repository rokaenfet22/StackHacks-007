function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      mapTypeControl: false,
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 13,
    });
    new AutocompleteDirectionsHandler(map);
  }
  
  class AutocompleteDirectionsHandler {
    constructor(map) {
      this.map = map;
      this.originPlaceId = "-a4viXKO0";
      this.destinationPlaceId = "";
      this.travelMode = google.maps.TravelMode.WALKING;
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(map);
      const originInput = document.getElementById("origin-input");
      const destinationInput = document.getElementById("destination-input");
      const modeSelector = document.getElementById("mode-selector");
      const originAutocomplete = new google.maps.places.Autocomplete(originInput);
      // Specify just the place data fields that you need.
      originAutocomplete.setFields(["place_id"]);
      const destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput
      );
      // Specify just the place data fields that you need.
      destinationAutocomplete.setFields(["place_id"]);
      this.setupClickListener(
        "changemode-walking",
        google.maps.TravelMode.WALKING
      );
      /*this.setupClickListener(
        "changemode-transit",
        google.maps.TravelMode.TRANSIT
      );
      */
      this.setupClickListener(
        "changemode-driving",
        google.maps.TravelMode.DRIVING
      );
      this.setupPlaceChangedListener(originAutocomplete, "ORIG");
      this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
        destinationInput
      );
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
    }
    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    setupClickListener(id, mode) {
        this.travelMode = google.maps.TravelMode.DRIVING;
        this.route();
      };
    
    setupPlaceChangedListener(autocomplete, mode) {
      autocomplete.bindTo("bounds", this.map);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
  
        if (!place.place_id) {
          window.alert("Please select an option from the dropdown list.");
          return;
        }
  
        if (mode === "ORIG") {
          this.originPlaceId = place.place_id;
        } else {
          this.destinationPlaceId = place.place_id;
        }

        this.route();
      });
    }
    async route() {
      if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
      }

      let a = await sendId(this.originPlaceId,this.destinationPlaceId);
      //a is in format of [origin_address,destination_address] where both addresses are a formatted string e.g. Newcastle, UK (i.e. what is chosen in the drop down)
      console.log(a)

      const me = this;
      this.directionsService.route(
        {
          origin: { placeId: this.originPlaceId },
          destination: { placeId: this.destinationPlaceId },
          travelMode: this.travelMode,
        },
        (response, status) => {
          if (status === "OK") {
            me.directionsRenderer.setDirections(response);
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
    }
}

async function retrieveDetails (distance) {
  const paras = { distance: distance };
  console.log(paras)
  const response = await fetch('/getEmissions', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(paras)
  });
  const details = await response.json();
  console.log(details.emissions);
  const emissions = details.emissions;
  modesOfTravel = ['car', 'train', 'plane', 'helicopter', 'submarine', 'carPlane', 'blimp', 'hotAirBalloon'];
  for (let mode = 0; mode < modesOfTravel.length; mode++) {
      let value = emissions[mode];
      document.getElementById(modesOfTravel[mode]).innerHTML = Math.round(value) + 'kg';
      document.getElementById('g' + mode).innerHTML = Math.round(value/0.9) + 'm<sup>2</sup>';
      document.getElementById('m' + mode).innerHTML = '£' + Math.round(value*0.0077 * 100)/100;
  }
};

//Sends ID of original and destination location when both are available, and gets response as their formatted address [origin,destination] respectively
async function sendId(originId,destinationId){
  const paras = {origin: originId, destination:destinationId};
  const res = await fetch('/sendPlaceId', {
      method: 'POST',
      headers: {'content-type':'application/json'},
      body: JSON.stringify(paras)
  })
    const names = await res.json()
    console.log(names)

  const response = await fetch("/getDistance", {
    method: "POST",
    headers: {"content-type": "application/json"},
    body: JSON.stringify(names)
  })
  const distance = await response.json();
  console.log(distance);
  retrieveDetails(distance["distance"])
  return response.body["distance"];
}