



async function main(){
    //Pull questionnaire here
    let request = new Request(window.serviceUri + '/Patient?_id=' + window.patient_id, {
        method: 'get',
        headers: {'Authorization': 'Bearer ' + window.access_token}
    });

    let response = await fetch(request);
    //Parse bundle to get the questionnaire
    let bundle = await response.json();
    createUI(bundle)

    console.log(window.patient_id);
    console.log(bundle["resourceType"]);
    console.log(bundle["resourceType"]);
    console.log(bundle["entry"]);
    console.log(bundle["entry"][0]);
    console.log(bundle["entry"][0]["resource"]["name"]);
    console.log(bundle["entry"][0]["resource"]["name"][0]);
    console.log(bundle["entry"][0]["resource"]["name"][0]["family"]);
    console.log(bundle["entry"][0]["resource"]["name"][0]["given"][0]);
    console.log(JSON.stringify(bundle));
    window.familyname = bundle["entry"][0]["resource"]["name"][0]["family"];
    window.givename = bundle["entry"][0]["resource"]["name"][0]["given"][0];
    window.birthdate = bundle["entry"][0]["resource"]["birthDate"]
    var today = new Date();
    var array = birthdate.split("-")
    var yyyy = today.getFullYear();
    window.age = yyyy - array[0]
    d3.select('#name').text("Patient: " + bundle["entry"][0]["resource"]["name"][0]["family"]+" "
    +bundle["entry"][0]["resource"]["name"][0]["given"][0]);
    d3.select('#age').text("Age: " + window.age );
    window.weight = weight_cal(age).toFixed(2);;
    d3.select('#weight').text("Weight: " + window.weight+ " Kg" );
}

async function createUI(bundle){
    //Code here
}

function loadPatient(){
    // get the URL parameters received from the authorization server
    let state = getUrlParameter("state");  // session key
    let code = getUrlParameter("code");// authorization code

// load the app parameters stored in the session
    let params = JSON.parse(sessionStorage[state]);  // load app session
    let tokenUri = params.tokenUri;
    let clientId = params.clientId;
    let secret = params.secret;
    window.serviceUri = params.serviceUri;
    let redirectUri = params.redirectUri;

// Prep the token exchange call parameters
    let data = {
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
    };
    let options;
    if (!secret) {
        data['client_id'] = clientId;
    }
    options = {
        url: tokenUri,
        type: 'POST',
        data: data
    };
    if (secret) {
        options['headers'] = {'Authorization': 'Basic ' + btoa(clientId + ':' + secret)};
    }

// obtain authorization token from the authorization service using the authorization code
    $.ajax(options).done(function(res){
        // should get back the access token and the patient ID
        window.access_token = res.access_token;
        print(res.patient)
        window.patient_id = res.patient;
        main();
    });
}
function weight_cal (age) {
    var array = [3.8 ,9.6, 12.0, 14.2, 15.4, 17.9, 19.9, 22.4, 25.8, 28.1, 31.9, 36.9, 41.5,45.8,47.6, 52.1, 53.5, 54.4, 56.7, 57.1, 58.0]
    if (age <= 20){
        return array[age];
    }
    else{
        return 55.0 + (Math.floor(Math.random() * 30) - 5)* 2.1;
    }
}
// Convenience function for parsing of URL parameters
// based on http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
function getUrlParameter(sParam) {
    let sPageURL = window.location.search.substring(1);
    let sURLVariables = sPageURL.split('&');
    for (let i = 0; i < sURLVariables.length; i++)
    {
        let sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            let res = sParameterName[1].replace(/\+/g, '%20');
            return decodeURIComponent(res);
        }
    }
}

function displayObservation (observation) {
    var table = document.getElementById("obs_table");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = observation.code.coding[0].code;
    cell2.innerHTML = observation.valueQuantity.value;
}



