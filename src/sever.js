import express from 'express'
import morgan from 'morgan';
import { urlencoded, json } from 'body-parser';
const app = express();
// app configuration
app.set('port', (process.env.PORT || 3000));
// setup our express application
app.use(morgan('dev')); // log every request to the console.
app.use(urlencoded({ extended: false }));
app.use(json());
// app routes
require('./routes/webhook_verify')(app);
// warming up the engines !! setta !! go !!!.
app.listen(app.get('port'), function() {
    const url = 'http://localhost:' + app.set('port');
    console.log('Application running on port: ', app.get('port'));
});