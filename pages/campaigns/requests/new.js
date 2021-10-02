import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link,Router } from '../../../routes';
const NewRequest = () => {
    const router=useRouter();
    const {address}=router.query;
    const [value,setValue]=useState('');
    const [recipient,setRecipient]=useState('');
    const [description,setDescription]=useState('');
    const [spinner,setSpinner]=useState(false);
    const [errorMsg,setErrorMsg]=useState('');
    const handleSubmit=async (e)=>{
        e.preventDefault();

        const campaign=Campaign(address);
        
        setErrorMsg('');
        setSpinner(true);
        try{
            const accounts=await web3.eth.getAccounts();
            await campaign.methods.createRequest(description,
                web3.utils.toWei(value,'ether'),recipient).send({
                    from:accounts[0]
                });
            Router.pushRoute(`/campaigns/${address}/requests`);
        }
        catch(err){
            setErrorMsg(err.message);
        }
        setSpinner(false);

    }
    return (
        <Layout>
            <Link route={`/campaigns/${address}/requests`}>
                <a href="">
                    
                        Back
                   
                 </a>
            </Link>
            <h3>Create a Request</h3>
            <Form onSubmit={handleSubmit} error={!!errorMsg}>
                <Form.Field>
                    <label htmlFor="">Description</label>
                    <Input
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}>
                    </Input>
                </Form.Field>
                <Form.Field>
                    <label htmlFor="">Value in Ether</label>
                    <Input 
                    value={value}
                    onChange={(e)=>setValue(e.target.value)}>
                    </Input>
                </Form.Field>
                <Form.Field>
                    <label htmlFor="">Recipient</label>
                    <Input
                    value={recipient}
                    onChange={(e)=>setRecipient(e.target.value)}>
                    </Input>
                </Form.Field>
                <Message error header="Oops!" content={errorMsg}></Message>
                <Button primary loading={spinner}>Create Request!</Button>
            </Form>
        </Layout>
    );
};

export default NewRequest;