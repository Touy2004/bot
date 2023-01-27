import express from 'express';
import bodyParser from 'body-parser';
import request from 'request';
import { verify_token, page_token } from './config.js';

const app = express();

app.use(bodyParser.json({ extended: false, limit: '500mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send("Server is running!");

});

app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === verify_token) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid token');
    }
});

app.post('/webhook', (req, res) => {
    const data = req.body;

    if (data.object === 'page') {
        data.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message) {
                    handleMessage(event);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });
    }

    res.sendStatus(200);
});

function handleMessage(event) {
    const senderId = event.sender.id;
    const message = event.message.text;

    // Your chatbot logic here
    if (message === 'hi') {
        sendTextMessage(senderId, 'Hello, how can I help you?');
    } else {
        sendTextMessage(senderId, 'I am sorry, I did not understand your message.');
    }
}

function sendTextMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v9.0/me/messages',
        qs: { access_token: page_token },
        method: 'POST',
        json: {
            recipient: { id: recipientId },
            message: { text: message }
        }
    }, function(error, response) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});