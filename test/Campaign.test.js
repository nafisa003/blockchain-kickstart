const assert=require('assert');
const ganache=require('ganache-cli');
const Web3=require('web3');
const web3=new Web3(ganache.provider());

const compiledFactory=require('../ethereum/build/CampaignFactory.json');
const compiledCampaign=require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async()=>{
    accounts=await web3.eth.getAccounts();

    //create a new factory and deploy it   
    factory=await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data:compiledFactory.bytecode})
    .send({from:accounts[0],
          gas:'1000000'
        });

    await factory.methods.createCampaign('100').send({             //returns nothing but trx receipt
        from:accounts[0],
        gas:'1000000'
    });

    const addresses=await factory.methods.getDeployedCampaigns().call(); //returns array
    campaignAddress=addresses[0]; //get address of campaign
     
    //get the campaign deployed at that address
    campaign=await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    ) //no need to execute deploy and send
});

describe('Campaigns',()=>{

    it('deploys a factory and a campaign',()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as campaign manager',async ()=>{
        const manager=await campaign.methods.manager().call(); //not modifying data so call
        assert.equal(accounts[0],manager);
    });

    it('allows people to contribute money and marks them as approvers',async ()=>{
        await campaign.methods.contribute().send({
            value:'110',
            from:accounts[1]
        });
        const isContributor=await campaign.methods.approvers(accounts[1]).call();//returns value from mapping
        assert(isContributor); //isContributor should return true;

    });

    it('requires a minimum contribution',async ()=>{
        try{

            await campaign.methods.contribute().send({
                value:'90',
                from:accounts[1] //by default ganache generates 10 accounts
            })
            assert(false); //test fails
        }
        catch(err){
            assert(err); //test ok as error is thrown
        }
    });

    it('allows a manager to make a spending request',async ()=>{
        await campaign.methods.createRequest(
            'Buy battery','100',accounts[1]
        ).send({
            from:accounts[0],
            gas:'1000000'
        });
     const request=await campaign.methods.requests(0).call(); //auto getter so need to specify index
     assert.equal('Buy battery',request.description); //check one property
    });

    it('processes request',async ()=>{
        await campaign.methods.contribute().send({ //contribute to campaign
            from:accounts[0],
            value: web3.utils.toWei('10','ether')
        })

        await campaign.methods.createRequest(
            'a camel', web3.utils.toWei('5','ether'),accounts[1] //create spending request
        ).send({
            from:accounts[0],
            gas:'1000000'
        })

        //vote on request
        await campaign.methods.approveRequest(0).send({
            from:accounts[0],           //accounts[0] is a contributor hence can vote
            gas:'1000000'               //only one request so arg index is 0
        })

        //finalize approved request
        await campaign.methods.finalizeRequest(0).send({
            from:accounts[0], //only manager can call this
            gas:'1000000'
        })

        let balance=await web3.eth.getBalance(accounts[1]) //returns string in wei
        balance=web3.utils.fromWei(balance,'ether') //returns string in ether
        balance=parseFloat(balance); //converts to float number
        console.log(balance);
        assert(balance>103); //some amount needed for gas so not exactly 105,
                            // initially all accounts have 100 ether
    });
});

