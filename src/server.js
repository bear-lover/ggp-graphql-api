/*


*/

import express from 'express';
import path from 'path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import PrettyError from 'pretty-error';
import moment from 'moment';


// configurations
import { auth, port, host, environment } from './config';
import logger from './config/logger';

// GraphQL
import models from './data/models';
import schema from './data/schema';
import pushNotificationRoutes from './libs/pushNotificationRoutes';

// JWT Auth Middleware
import { verifyJWT_MW } from './libs/middleware';
import paypalRoutes from './libs/payment/paypal/paypal';

const app = express();

app.use(compression());

// Middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Authentication
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
});

app.use(expressJwt({
    secret: auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.headers.authToken,
}));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.send({
            status: 400,
            errorMessage: 'Invalid auth token provided.'
        });
        next();
    }
});

app.use(verifyJWT_MW);

if (environment == 'DEV') {
    app.enable('trust proxy');
}

pushNotificationRoutes(app);
paypalRoutes(app);

// Express GraphQL 
const graphqlMiddleware = ( environment === "PROD" ) 
    ? expressGraphQL((req, res) => ({
        schema,
        graphiql: false,
        rootValue: {
            request: req,
            response: res
        },
        pretty: false,
    })) : expressGraphQL((req, res) => ({
        schema,
        graphiql: true,
        rootValue: {
            request: req,
            response: res
        },
        pretty: true,
    }));

app.use('/graphql', graphqlMiddleware);

//
app.post('/check', function (req, res) {
    console.log('Watch asd asd', req.headers);
    res.sendStatus(200);
});

app.get('/user/payout/:status', async function (req, res) {
    res.send('  ');
})


// Error Handling
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// Server launch
models.sync().catch(err => console.log(err.stack)).then(() => {
    app.listen({ port: 4000 }, () => {
        console.log('\x1b[36m', "Server ready at http://localhost:4000", "\x1b[0m");
        console.log('\x1b[36m', "GraphQL Server started on port " + host + ":" + port + " Env:" + environment + " with time zone " + new Date(), "\x1b[0m");
        console.log('\x1b[36m', "GraphQL Server TimeZone : " + moment.tz.guess(), "\x1b[0m");
    }
    )
});


process.on("beforeExit", (code) => {
    console.log("Process beforeExit event with code: ", code);
});

process.on("exit", (code) => {
    console.log("Process exit event with code: ", code);
});

process.on("uncaughtException", function (err) {
    console.error("An uncaught error occurred!");
    logger.logDebug(err);
    console.error(err);
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled rejection at ", promise, `reason: ${reason.message}`);
    console.log("Stack", reason.stack);
    logger.logDebug(reason.message);
    process.exit(1);
});
