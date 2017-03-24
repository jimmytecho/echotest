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
    if (req.query['hub.verify_token'] === 'Jimmytecho_echotest_chatbot') {
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
�|�^��Json �r�� 
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

source = 'en'
target = 'fr'

app.post('/webhook/', function (req, res) {
    
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            justsaysomething(sender)
            text = event.message.text
            translate({
                text: text,
                source: source,
                target: target
            }, function (result) {
                console.log(result);
                final = String(result);
            });
            if (text = "xx") {
                temporary = source
                source = target
                target = temporary
                reply_reversed(sender)
            }
            else{
                startprocess()
                setTimeout(function () {
                    clearTimeout(start);
                }, 4000)
            }   
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: " + text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = "EAAalYrs1VC8BACEbr72Tj5G8GKMZBfeZAr4iSZCtVZCSVrEZCoKoEOaqZBEPKVF8ekzqmd79Nwp5TdZC8Ud0VaLRfPmWCQlnVvcG9IjUy0AVBh0eAGpxr96Ewq2ON3rB84OTYuaOKGa0saHHflIZC0pnO7g9pSbEvdJ3zLJPvBx7GUabcVn8oxxR"
function startprocess() {
    start = setTimeout(function () {
        sendTranslation(sender);
    }, 3000);
}


function sendTranslation(sender) {
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

reply_reversed(sender){
    messageData = {
        text: "language has reversed!"
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

justsaysomething(sender){
    messageData = {
        text: "I'm just saying something"
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