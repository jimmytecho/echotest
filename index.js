var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var translate = require('node-google-translate-skidz');
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'Jimmytecho_first_chatbot') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'))
})


// API End Point - added by Stefan

var input
var final
var start


/*
mission impossible: personalize settings. 
curl -X GET "https://graph.facebook.com/v2.6/<USER_ID>?fields=first_name,last_name&access_token=PAGE_ACCESS_TOKEN"  
·|¦^À³Json ¦r¦ê 
"first_name" : "Peter"
"last_name" : "Chang"

*/

/*
possible solution
use json!
if (text === 'xxchangexx')
record_setting(){
    request person name?
    write file: firstname last name, source, target
}

readID() = request id

source = 'en'
target = 'fr'
if (name_recognized(first name last name)){
    getIDbyname(first name last name)
    source = ID.source
    target = ID.target
}
translat
source: source
target: target...
}

*/

app.post('/webhook/', function (req, res) {
    
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            input = text
            translate({
                text: input,
                source: 'en',
                target: 'fr'
            }, function (result) {
                console.log(result);
                final = String(result);
            });
            startprocess()
            setTimeout(function () {
                clearTimeout(start);
            }, 4000)
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: " + text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = "EAAaVxKEKRM4BAA0Sco3v9D8gYghtzqRehtYJ3zE0SYnOEVOtXbjDJzRqs4EbmLIRXnAxT8KRZA4vRZAI2cBE0joKkOOjiOZBwKu28XWTrWcRkulGWkzH5g4e5PUphZBddZBzeaKBZCGm9wpxrIfV8BZBWfX6cHwYZAvV7Ml42O0rCAZDZD"

function startprocess() {
    start = setTimeout(function () {
        sendTranslation(sender, text.substring(0, 200));
    }, 3000);
}

//all messages

function sendTranslation(sender, input) {
    messageData = {
        text: final
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

