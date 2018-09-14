
const GrantblockRegistry = require('./grantblockRegistry');
//This is where the blockchain logic for each call will go <--LIES. The blockchain logic will go in the registry.  This will just call everything in a nice package.

class BlockchainController  {
    
    async createGrantee(var1, var2, var3){
        //init connection
        await GrantblockRegistry._init();
        const createParams = {"id": var1, "name": var2, "email": var3}
        console.log(createParams);
        //initialize a grantee on the grantee participant registry
        await GrantblockRegistry._createGrantee(createParams);

        //disconnect
        await GrantblockRegistry._disconnect();
        //clean everything up
        //eh, if you're getting an error here the actual problem should be in grantblockRegistry
    }

    async issueIdentity(id, role){
        //connect to blockchain network
        await GrantblockRegistry._init();
        
        //issue the identity
        var idParams = {
            "id": id,
            "role": role
        }
        await GrantblockRegistry._identityIssue(idParams);

        await GrantblockRegistry._testConnection();
        //disconnect from blockchain network
        await GrantblockRegistry._disconnect();
    }

    async getGrantees(){
        //connect to the business network
        console.log('Logging point 1 before init');
        // await GrantblockRegistry._initParticipant('admin');
        await GrantblockRegistry._init();
        console.log('point 2 after init');
        //get the grantees
        await GrantblockRegistry._getGrantees();
        //disconnect from the business network
        await GrantblockRegistry._disconnect();
    }
}

module.exports = new BlockchainController();