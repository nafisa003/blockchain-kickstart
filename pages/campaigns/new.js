import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Link,Router } from '../../routes';
const CampaignNew = () => {
    const [minimumContribution,setMinimumContribution]=useState('');
    const [errorMsg,setErrorMsg]=useState('');
    const [spinner,setSpinner]=useState(false);
    const handleSubmit=async (e)=>{ 
        e.preventDefault();             
         //create a new campaign
         setSpinner(true);
         setErrorMsg('');
        try{
           
        const accounts=await web3.eth.getAccounts();
        await factory.methods.createCampaign(minimumContribution)
        .send({
            from:accounts[0]
        });
        Router.pushRoute('/');
        }
        catch(err){
            setErrorMsg(err.message);
        }
        setSpinner(false)
        
    }
    return (
        <Layout>
        <div>
          <h3>Create a Campaign</h3>
          <Form onSubmit={handleSubmit} error={!!errorMsg}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input label="wei" labelPosition="right" value={minimumContribution}
                    onChange={(e)=>setMinimumContribution(e.target.value)}
                    ></Input>
                </Form.Field>
                <Message error header="Oops!" content={errorMsg}></Message>
                <Button loading={spinner} primary content="Create!"></Button>
         </Form>  
        </div>
        </Layout>
    );
};

export default CampaignNew; 