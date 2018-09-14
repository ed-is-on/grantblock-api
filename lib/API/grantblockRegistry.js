"use strict"

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const Table = require('cli-table');
const Winston = require('winston');
const NS = 'com.usgov.grantblock';
let cardname = require('config').get('IdCard').cardname;
const LOG = Winston.loggers.get('application');

class GrantblockRegistry {

    constructor() {
        this.bizNetworkConnection = new BusinessNetworkConnection();
        // this.bizNetworkDefinition;
      }
    
    /** 
    * @description Initalizes the LandRegsitry by making a connection to the Composer runtime
    * @return {Promise} A promise whose fullfillment means the initialization has completed
    */
    async _init() {
        try{
            // const METHOD = 'grantblockRegistry<_init>';
            // LOG.info(METHOD, 'connecting with card named:', cardname);
            this.businessNetworkDefinition = await this.bizNetworkConnection.connect(cardname);
            LOG.info('grantblockRegistry:<init>', 'businessNetworkDefinition obtained', this.businessNetworkDefinition.getIdentifier());
    
        }catch(error){
            throw new Error('Could not connect to the business network.');
        }
    }
    
    /**
     * @description I need a way to do login and logout, so I'm testing this
     * @return {Promise} A promise that means the network has initialized using the given card
     */
    async _initParticipant(id){
        var idcard = id + '@grantblock';
        this.businessNetworkDefinition = await this.bizNetworkConnection.connect(idcard);
        LOG.info('grantblockRegistry:<initParticipant>', 'businessNetworkDefinition obtained', this.businessNetworkDefinition.getIdentifier());
    }

    /**
     * @description something witty here about the transaction
     * @param {Object} createParams information passed from the model file
     * @return {Promise} probably?
     */
    async _createGrantee(createParams){
            if(!createParams.id || !createParams.name || !createParams.email){
                    console.log(createParams);
                    throw new Error('The parameters have not been successfully passed in to the function.');
            }
            var id = createParams.id;
            var name = createParams.name;
            var email = createParams.email;
            let factory = this.businessNetworkDefinition.getFactory();
            let grantee = factory.newResource('com.usgov.grantblock', 'Grantee', id);
            grantee.grantBalance = 0;
            grantee.pocName = name;
            grantee.pocEmail = email;
            var granteeRegistry = await this.bizNetworkConnection.getParticipantRegistry('com.usgov.grantblock.Grantee');
            await granteeRegistry.add(grantee);
    }

    /**
     * @description This transaction issues an identity to a given grantee
     * @param {Object} idParams this will be the id for a given participant
     * @return {Promise} 
     */
    async _identityIssue(idParams) {
        try {
            var identityType = idParams.role;
            var id = idParams.id;
            this.bizNetworkConnection.issueIdentity('resource:com.usgov.grantblock.Grantee#' + id, id, { issuer: false })
            // let result = await this.bizNetworkConnection.issueIdentity('com.usgov.grantblock.Grantee#' + id, id)
            // console.log(`userID = ${result.userID}`);
            // console.log(`userSecret = ${result.userSecret}`);
        } catch(error) {
            console.log(error);
            process.exit(1);
        }
    }

    /**
     *@description This will test the connection to the network 
     * 
     */

    async _testConnection() {
        let businessNetworkConnection = new BusinessNetworkConnection();
        try {
            await businessNetworkConnection.connect('admin@grantblock');
            let result = await businessNetworkConnection.ping();
            console.log(`participant = ${result.participant ? result.participant : '<no participant found>'}`);
            await businessNetworkConnection.disconnect();
        } catch(error) {
            console.error(error);
            process.exit(1);
        }
    }
    
    /**
     * @description This transaction gets all the grantees from the registry
     * @return {Table}
     */
    async _getGrantees(){
        try{
            let registry = await this.bizNetworkConnection.getParticipantRegistry(NS + '.Grantee');
            let gResources = await registry.getAll();
            let table = new table({
                head: ['granteeId', 'grantBalance', 'pocName', 'pocEmail']
            });
            let arrayLength = gResources.length;
            for(let i=0; i< arrayLength; i++){
                let tableLine = [];
                tableLine.push(gResources[i].granteeId);
                tableLine.push(gResources[i].grantBalance);
                tableLine.push(gResources[i].pocName);
                tableLine.push(gResources[i].pocEmail);
                table.push(tableLine);
            }
            return table;
        }catch(error){
            console.log(error);
            process.exit(1);
        }
    }

    //new version of the disconnect that ends your connection to the blockchain
    async _disconnect(){
        LOG.info('[grantblockRegistry] businessNetworkDefinition disconnected');
        await this.bizNetworkConnection.disconnect(this.bizNetworkDefinition);
    }

}

module.exports = new GrantblockRegistry();