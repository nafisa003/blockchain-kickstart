import { useRouter } from 'next/router';
import React, { useEffect, useState,Component } from 'react';
import { Button,Table } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import {Link} from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';
// import { render } from 'react-dom';
// import { loadGetInitialProps } from 'next/dist/next-server/lib/utils';
class RequestIndex extends Component {
//    const router=useRouter();
static async getInitialProps(props){
   const {address}=props.query;
//    console.log(address)
   
//    const [requestsCount,setRequestsCount]=useState(0);
//    const [requests,setRequests]=useState([]);

   

       
            const campaign=Campaign(address);
            const requestsCount=await campaign.methods.getRequestCount().call();
           //requestsCount is string of number
        //    setRequestsCount(parseInt(countData));

            const approversCount=await campaign.methods.approversCount().call();
            const requests=await Promise.all(
               //Array[1].fill() returns arr of size 1 with 1 undefined el
               //then map it to fill the array with data
              Array(parseInt(requestsCount)).fill().map((el,index)=>{
                  //fetching one request at a time
                  return campaign.methods.requests(index).call()
              })
          );
          return {address,requests,requestsCount,approversCount};

          
        //   setRequests(requestsData);
        
        }
     
 
   
// 
renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }
   

render(){
   const {Header,Row,HeaderCell,Body}=Table;
  
    return (
        <Layout>
            <h3>Requests</h3>
            <Link route={`/campaigns/${this.props.address}/requests/new`}>
            <a>
                <Button primary floated="right" 
               style={{marginBottom:10}} >Add Request</Button>
            </a>
            </Link>

            <Table>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    { 
                        // requests.map((req,index)=>{
                        //     (<RequestRow request={req} 
                        //     key={index}
                        //     id={index}
                        //     address={address}>
                        //     </RequestRow>
                        //     )
                        // })
                        this.renderRows()
                    }
                </Body>
            </Table>
            <div>Found {this.props.requestsCount} requests</div>
        </Layout>
    );
};
}
export default RequestIndex;