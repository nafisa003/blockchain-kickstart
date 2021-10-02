import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {Router} from '../routes';

const ContributeForm = ({address}) => {
      const [value,setValue]=useState('');
      const [spinner,setSpinner]=useState(false);
      const [errorMsg,setErrorMsg]=useState('');
      const handleSubmit=async (e)=>{
          e.preventDefault();

          const campaign=Campaign(address);
          setSpinner(true);
          setErrorMsg('');
          try{
            const accounts=await new web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from:accounts[0],
                value: web3.utils.toWei(value,'ether')
            });

            Router.replaceRoute(`/campaigns/${address}`);//refreshing current page for data update
          }
         
          catch(err){
                setErrorMsg(err.message);
          }
          setSpinner(false);
          setValue('');
        
      }
    return (
       <Form onSubmit={handleSubmit} error={!!errorMsg}>
           <Form.Field>
               <label>Amount to contribute</label>
               <Input
               label="ether"
               labelPosition="right"
               value={value}
               onChange={(e)=>setValue(e.target.value)}
               ></Input>
           </Form.Field>
           <Message error header="Oops!" content={errorMsg}></Message>
           <Button primary loading={spinner}>Contribute!</Button>
       </Form>
    );
};

export default ContributeForm;