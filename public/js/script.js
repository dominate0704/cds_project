async function main(){
    //Pull questionnaire here
    let request = new Request(window.serviceUri + '/Questionnaire?_id=' + window.patient_id, {
        method: 'get',
        headers: {'Authorization': 'Bearer ' + window.access_token}
    });
    let response = await fetch(request);
    //Parse bundle to get the questionnaire
    let bundle = await response.json();
    createUI(bundle)
    console.log(bundle);
    d3.select('#main').text(JSON.stringify(bundle, null, 2))
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
        window.patient_id = res.patient;
        main();
    });
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
