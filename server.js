const restify = require('restify');
const errors = require('restify-errors');
const port = process.env.PORT || 8080;
const routing = require('./lib/routing/routing');

//create the server
const server = restify.createServer({
    name: 'restify headstart'    
});

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({mapParams: true}));

routing(server);

server.listen(port, ()=> {
    console.info(`api is running on port ${port}`);
});