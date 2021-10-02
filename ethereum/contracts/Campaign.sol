pragma solidity ^0.4.17;

//creating a contract to deploy a new instance of Campaign

contract CampaignFactory{
    
   address[] public deployedCampaigns;
   
   function createCampaign(uint minimum) public{
      address newCampaign= new Campaign(minimum, msg.sender); //creating a new instance
      
      deployedCampaigns.push(newCampaign); //storing it in deployed campaigns
   }
   
   //to get list of all campaigns deployed
   function getDeployedCampaigns() public view returns (address[]){
       
       return deployedCampaigns;
   }
    
}


contract Campaign{
    
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount; //count number of yes votes
        mapping (address=>bool) approvals; //keep track of people who voted on the request
    }
    
    //only manager has access to certain functions
    modifier restricted(){
        require(msg.sender==manager);
        _;
    }
    
    
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping (address=>bool) public approvers;
    uint public approversCount; //total people who have contributed
    
    function Campaign(uint minimum, address creator) public{
        manager=creator;
        minimumContribution=minimum; //taking arg in constructor as people might need
                                    //different amount of money for project
    }
    
    //contribuotrs or approvers will send money
    
    function contribute() public payable{
        require(msg.value > minimumContribution);
        
       approvers[msg.sender]=true; //person has donated to campaign
       approversCount++;
    }
    
    //function to take spending request from manager
    
    function createRequest(string description,uint value,address recipient) 
    public restricted{
        
        Request memory newRequest=Request({
           description:description,
           value:value,
           recipient:recipient,
           complete:false,
           approvalCount:0
        });
        
        requests.push(newRequest);
    }
    
    //function so that contributors can approve a request
    
    function approveRequest(uint index) public{
        
        Request storage request=requests[index]; //particular request inside array
        require(approvers[msg.sender]); //checks if person has donated to campaign
        
        require(!request.approvals[msg.sender]); //checks if person has already voted on the request 
        
        request.approvals[msg.sender]=true; //approve the request by the person
        
        request.approvalCount++; //increase yes votes
        
        
        
    }
    
    //function to finalize request and send money to vendor
    
    function finalizeRequest(uint index) public restricted{
        
        Request storage request=requests[index];//particular request
        
        require(request.approvalCount> (approversCount/2)); //more than 50% people should approve
        
        require(!request.complete); //check if request is already completed
        
        request.recipient.transfer(request.value); //transfer money to vendor
        request.complete=true;
        
    }
    
    //returning a summary of contract for front end optimisation
    function getSummary() public view returns(uint,uint,uint,uint,address){
        return(
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    //returns number of requests
    function getRequestCount() public view returns(uint){
        return requests.length;
    }
    
    
    
    
    
    
    
    
    
}