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

var default_source = 'en'
var default_target = 'fr'

var The_List = new Array()

var temp
var temp1
var temp2


class Note {
    constructor(senderID, source, target) {
        this.senderID = senderID
        this.source = source
        this.target = target
    }
    reverse() {
        temp = this.source
        this.source = this.target
        this.taget = temp
    }
    change_to(new_source, new_target) {
        this.source = new_source;
        this.target = new_target;
    }

}
function Exist_Note(senderID) {
    var isfound = false
    var index
    for (i = 0; i < The_List.length; i++) {
        if (The_List[i].senderID === senderID) {
            isfound = true
        }
        if (isfound) return true
        else return false
    }
}
function Index_for_ID(senderID) {
    var isfound = false
    var index
    for (i = 0; i < The_List.length; i++) {
        if (The_List[i].senderID === senderID) {
            index = i
            isfound = true
        }
        if (isfound) return index
        else return -2
    }
}
function Create_New(senderID, source, target) {
    var Object = new Note(senderID, source, target);
    The_List.push(Object);
}



app.post('/webhook/', function (req, res) {
    
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        text = event.message.text
        if (text === "xx") {
            print(sender, "reversing")
            if (Exist_Note(sender)) {
                The_List[Index_for_ID(sender)].reverse();
                print(sender, "reversed")
            } else {
                temp1 = default_target
                temp2 = default_source
                Create_New(sender, temp1, temp2)
                print(sender, "recorded")
            }
            break;
        }
        else if (text.substring(0, 2) === "!@") { //syntext: !@ch,en
            temp1 = text.substring(2, 4);
            temp2 = text.substring(5, 7);
            print(sender, "changing to: " + temp1 + " " + temp2);
            if (Exist_Note(sender)) {
                The_List[Index_for_ID(sender)].change_to(temp1, temp2);
            } else {
                Create_New(sender, tem1, temp2);
            }
            break;
        }
        else if (event.message && event.message.text) {
            text = event.message.text
            if (text === "*LIST*" && sender === '1285599384864027') {
                for (i = 0; i < The_List.length; i++) {
                    print(sender, The_List[i].senderID);
                    print(sender, "source: " + The_List[i].source.substring(0, 4));
                    print(sender, "target: " + The_List[i].target.substring(0, 4));
                }
                if (The_List.length === 0) {
                    print(sender, "nothing on list");

                }
            }
            else if (Exist_Note(sender)) {
                temp1 = The_List[Index_for_ID(sender)].source;
                temp2 = The_List[Index_for_ID(sender)].target;
            } else {
                temp1 = default_source;
                temp2 = default_target;
            }
            input = text.substring(0, 200);
            translate({
                text: input,
                source: temp1,
                target: temp2
            }, function (result) {
                console.log(result);
                final = String(result);
            });
            startprocess()
            setTimeout(function () {
                clearTimeout(start);
            }, 4000)
        }
        else if (event.postback) {
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

function print(sender, input) {
    messageData = {
        text: input
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
