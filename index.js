'use strict'

var express = require('express');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var session = require('express-session');
var logger = require('./logger');
var cors = require('cors');
var i18n = require('i18n');
var url = require('url');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/'});
var aadhar = require('./aadhar');

require('dotenv').config({
    path: __dirname + '/.env'
});


console.log(process.env.APP_ENV+'-'+process.env.NODE_ENV);
var isLocalDev = (process.env.APP_ENV === 'local' && process.env.NODE_ENV === 'local');
console.log(isLocalDev);
var port = process.env.PORT || 9000;

logger.log('debug', 'Starting up');
// dotenv, must be loaded first
logger.log('debug', 'Getting the environment');
var environment = process.argv[2]
    ? process
        .argv[2]
        .toLowerCase()
        .substring(2)
    : 'dev';

logger.log('info', 'Loading dotenv with env = ' + process.env.APP_ENV);

logger.log('verbose', 'App env: ', process.env);

// configure the app
logger.log('debug', 'Loading configuration file app.js');
var config = require('./configure');
logger.log('verbose', 'App configuration: ', config);

// i18n setup
logger.log('debug', 'Configuring i18n');
i18n.configure({
    locales: config.i18n.lang,
    directory: __dirname + '/public/locales',
    defaultLocale: config.i18n.default_lang
});

logger.log('debug', 'Registering custom functions for Handlebars');
var hbs = expressHbs.create({
    extname: 'hbs',
    helpers: {
        i18n: function (text) {
            return i18n.__(text);
        }
    }
});

// view engine setup
logger.log('debug', 'Loading handlebars template engine');

logger.log('debug', 'Loading routes file index.js');

logger.log('debug', 'Creating the app');
var app = express();

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(session({
    secret: 'lynk',
    path: '/api',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 600000
    }
}));

// misc. configuration
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '5mb'}));
app.use(cookieParser());
app.use(cors());
app.enable('trust proxy');

logger.log('debug', 'Mounting routes on /');

//build server for local testing
if (process.env.APP_ENV === 'local' && process.env.NODE_ENV === 'production') {
    let compression = require('compression');
    app.use(compression());

    logger.log('info', 'Running local build server');
}

app.use('/assets/img', express.static(path.resolve(__dirname, 'public/assets/img')));
app.use('/assets/data', express.static(path.resolve(__dirname, 'public/assets/data')));
function loadFiles() {
    app.get('/fetch-aadhar-api',(req, res, next) => {
        console.log(req.query);
        const vision = require('node-cloud-vision-api');
        // init with auth
        vision.init({auth: 'AIzaSyDyYWeIdrCNrKWAwhbKN5RtkcOpsq0gpZ0'});
        // construct parameters
        try {
            const request = new vision.Request({
                image: new vision.Image({
                    url: req.query.id
                }),
                features: [
                        new vision.Feature('FACE_DETECTION', 4),
                        new vision.Feature('TEXT_DETECTION', 10),
                    ]
            });
            // send single request
            vision.annotate(request).then((response) => {
                var data = JSON.stringify(aadhar.analyzeText(response.responses));
                console.log(data);
                var fs = require('fs');
                var beautify = require("json-beautify");
                /*fs.readFile(__dirname+'/aadhar.json', (err, respdata) => {
                    respdata = JSON.parse(respdata);
                    respdata.push(data);
                    fs.writeFile(__dirname+'/aadhar.json', beautify(respdata, null, 2, 100));
                    res.set('content-type', 'text/json');
                    res.send(JSON.stringify({
                        success:true,
                        html:data,
                        page:req.query.page
                    }))
                    res.end();
                    var request = require('request');
                    request.post('https://us-central1-lynkhacksmock.cloudfunctions.net/verifyaadhar', {
                        teamname : 'Swat Kats',
                        imageuid : req.body.imageuid,
                        dob : data.dob,
                        fathersname : data.fathersname,
                        sex : data.sex,
                        uid : data.uid,
                        state : data.state,
                        address : data.address,
                        name : data.name,
                    }, (err, data, body) => {
                        if(err)
                            console.log(err);
                        else {
                            console.log(body);
                        }
                    })
                });*/

                var pdata = JSON.parse(data);
                console.log({
                        teamname : 'Swat Kats',
                        imageuid : req.query.imageuid,
                        dob : pdata.dob,
                        fathersname : pdata.fathersname,
                        sex : pdata.sex,
                        uid : pdata.uid,
                        state : pdata.state,
                        address : pdata.address,
                        name : pdata.name,
                    });
                var request_npm = require('request');
                request_npm.post({ url : 'https://us-central1-lynkhacksmock.cloudfunctions.net/verifyaadhar', form: {
                        teamname : 'Swat Kats',
                        imageuid : req.query.imageuid,
                        dob : pdata.dob,
                        fathersname : pdata.fathersname,
                        sex : pdata.sex,
                        uid : pdata.uid,
                        state : pdata.state,
                        address : pdata.address,
                        name : pdata.name,
                    }}, (err, ldata, body) => {
                        if(err)
                            console.log(err);
                        else {
                            body_score += parseFloat(body.replace(/score/, '').trim());
                            console.log('I am the score '+parseFloat(body.replace(/score/, '').trim()));

                        }
                        res.set('content-type', 'text/json');
                        res.send(JSON.stringify({
                            success:true,
                            html:data,
                            page:req.query.page,
                            body_score:body_score
                        }))
                        res.end();
                    })


            }, (e) => {
                res.set('content-type', 'text/json');
                res.send(JSON.stringify({
                    success:false,
                    error : 'google vision issue'
                }))
                res.end();
            });
        }
        catch(e) {
            res.set('content-type', 'text/json');
            res.send(JSON.stringify({
                success:false,
                error : 'internet drop'
            }))
            res.end();
        }

    });
    app.get('/get-lynk-addhar-api',(req, res, next) => {
        const request_npm = require('request');
        request_npm.get('https://us-central1-lynkhacksmock.cloudfunctions.net/aadharimages', (error, results, body) => {
            if(error) {
                res.set('content-type', 'text/json');
                res.send(JSON.stringify({
                    success:true,
                    html : 'Sorry ! something happen in lynk hack api'
                }))
                res.end();
            }
            var url = [];
            for(let i in body = JSON.parse(body)) {
                url.push(body[i]);
            }
            var fs = require('fs');
            fs.writeFile(__dirname+'/aadhar.json', JSON.stringify([]));
            res.set('content-type', 'text/json');
            res.send(JSON.stringify({
                success:true,
                html : JSON.stringify(url)
            }))
            res.end();
        });
    });
    app.post('/file',upload.single('files'), (req, res, next) => {
        var files = req.file;
        console.log(files);
        const vision = require('node-cloud-vision-api');
        // init with auth
        vision.init({auth: 'AIzaSyDyYWeIdrCNrKWAwhbKN5RtkcOpsq0gpZ0'});
        // construct parameters
        const request = new vision.Request({
            image: new vision.Image(__dirname+'/uploads/'+files.filename),
            features: [
                    new vision.Feature('FACE_DETECTION', 4),
                    new vision.Feature('TEXT_DETECTION', 10),
                ]
        });
        // send single request
        vision.annotate(request).then((response) => {
        // handling response
            console.log(JSON.stringify(response.responses));
            res.set('content-type', 'text/json');
            res.send(JSON.stringify({
                success:true
            }))
            res.end();
        }, (e) => {
            res.send(JSON.stringify({
                success:false
            }))
            res.end();
        });
    });
}
console.log(isLocalDev);
var body_score = 0;
if (isLocalDev) { //webpack for local development
    const webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpack_config = require('./webpack.config.js'),
        compiler = webpack(webpack_config),
        indexFile = path.resolve(webpack_config.output.path, 'index.hbs');

        logger.log(webpack_config.output.path);
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpack_config.output.publicPath,
        inline: true,
        stats: 'minimal'
    }));
    app.use(webpackHotMiddleware(compiler));
    loadFiles();
    app.get('*', (req, res, next) => {
        compiler
            .outputFileSystem
            .readFile(indexFile, (error, result) => {
                if (error) {
                    return next(error);
                }
                console.log(result);
                res.set('content-type', 'text/html');
                res.send(result);
                res.end();
            })
    });
} else {
    //other envs
    let BUILD_DIR = path.resolve(__dirname, 'public/build');
    app.use(express.static(BUILD_DIR));
    loadFiles();
    app.get('/', (req, res, next) => {
        app.set('views', __dirname + '/public/build');

        var host = req.headers.host;
        var context = {};

        context.fbAppId = config.app_id;

        res.render('index', context);
    });
}


// launch the server
logger.log('debug', 'Getting server port and ip address information');

app.listen(port, (error) => {
    if (error)
        logger.log('error', error);

    logger.log('info', 'Starting express server with port ' + port);
})
