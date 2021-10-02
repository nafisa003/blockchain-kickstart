import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

const RequestRow = ({request,id,address,approversCount}) => {
    const {Row,Cell}=Table;
    const {description,value,recipient,approvalCount}=request;
    const readyToFinalize=request.approvalCount>(approversCount/2)
    const handleApprove=async ()=>{
       const campaign=Campaign(address);
       const accounts=await web3.eth.getAccounts();
       await campaign.methods.approveRequest(id).send({
           from:accounts[0]
       })
    };

    const handleFinalize=async ()=>{
        const campaign=Campaign(address);
       const accounts=await web3.eth.getAccounts();
       await campaign.methods.finalizeRequest(id).send({
           from:accounts[0]
       })
    }
    return (
        <Row disabled={request.complete} positive={readyToFinalize 
        && !request.complete}>
             <Cell>{id}</Cell>
             <Cell>{description}</Cell>
             <Cell>{web3.utils.fromWei(value,'ether')}</Cell>
             <Cell>{recipient}</Cell>
             <Cell>{approvalCount}/{approversCount}</Cell>
             <Cell>{
                 request.complete &&
                ( <Button color="green" basic onClick={handleApprove}>
                    Approve</Button>)
             }
                 </Cell>
             <Cell>
                 {request.complete && (
                 <Button color="teal" basic onClick={handleFinalize}>
                     Finalize</Button>)}
             </Cell>
        </Row>
    );
};

export default RequestRow;