"use strict"

const bccontroller = require('../API/blockchaincontroller');
const errors = require('restify-errors');

module.exports = function(server) {

//get the current list of grantees from the registry --> NEEDS MORE TESTING
server.get('/api/getgrantees', (req, res, next) =>{
    console.log("server get - get the full list of grantees");
    try{
        var granteelist = bccontroller.getGrantees();
        res.send(200, granteelist);
        return next();
    }catch(error){
        return next(new errors.NotFoundError('Could not find the grantee registry.'));
    }
});

//create a grantee
server.post('/api/creategrantee', (req, res, next) =>{
    console.log("server post - create and issue grantee");
    if(!req.body || !req.body.id || !req.body.name || !req.body.email){
        return next(new errors.BadRequestError());
    }
    try{
        bccontroller.createGrantee(req.body.id, req.body.name, req.body.email);
        res.send(200, 'New participant created with ID: ' + req.body.id);
        return next();
    }catch(error){
        return next(new errors.NotFoundError('Resource not found'));
    }
});

//this will issue and identity card to a given participant
server.post('/api/issueidentity', (req, res, next) =>{
    console.log('server post - issue identity card to a grantee');
    if(!req.body || !req.body.id || !req.body.role){
        return next(new errors.BadRequestError());
    }
    try{
        bccontroller.issueIdentity(req.body.id, req.body.role);
        res.send(200, 'Identity issued for participant with ID ' + req.body.id);
        return next();
    }catch(error){
        return next(new errors.NotFoundError());
    }
});

}