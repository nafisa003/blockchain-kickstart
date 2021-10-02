import React,{Component} from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import ContributeForm from '../../components/ContributeForm';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import {Link} from '../../routes';

class CampaignShow extends Component {
    static async getInitialProps(props){
       const campaign=Campaign(props.query.address);
       
       const summary=await campaign.methods.getSummary().call(); 
//summary returns object like this {
//   '0': '100',
//   '1': '0',
//   '2': '0',
//   '3': '0',
//   '4': '0x3F750A47030F1eDE52e88f839Cfc1AD5D0ea2689'
// }
//    console.log(summary);

//labelling the fields in the summary
        return{
            address:props.query.address,
            minimumContribution:summary[0], //0 is property name
            balance:summary[1],
            requestsCount:summary[2],
            approversCount:summary[3],
            manager:summary[4]
        };
    }

    renderCards(){
        const {
            balance,
            manager,
            approversCount,
            minimumContribution,
            requestsCount,
            address
        }=this.props; //destructuring
        const items=[
            {
                header:manager,
                meta: 'Address of manager',
                description:`The manager created this campaign and 
                can create requests to withdraw money`,
                style:{overflowWrap:'break-word'}
            },
            {
                header:minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description:`You have to contribute at least this much wei
                to become an approver`,
                style:{overflowWrap:'break-word'}
            },
            {
                header:requestsCount,
                meta: 'Number of Requests',
                description:`A request tries to withdraw money 
                from the contract. Request must be approved by 
                approvers`,
                style:{overflowWrap:'break-word'}
            },
            {
                header:approversCount,
                meta: 'Number of approvers',
                description:`Number of people who
                have already donated to this campaign`,
                style:{overflowWrap:'break-word'}
            },
            {
                header: web3.utils.fromWei( balance,'ether'),
                meta: 'Balance of campaign (ether)',
                description:`Balance is how much money this
                campaign has left to spend`,
                style:{overflowWrap:'break-word'}
            },
        ];

        return <Card.Group items={items}></Card.Group>
    }

    render(){
        const {address}=this.props;
        return (
            <Layout>
            
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                    <Grid.Column width={10}>
                        {
                        this.renderCards()
                        }
                        
                    </Grid.Column>

                    <Grid.Column width={6}>
                    <ContributeForm address={address}></ContributeForm>
                    </Grid.Column>
                    </Grid.Row>

                    <Grid.Row> 

                         <Grid.Column>
                            <Link route={`/campaigns/${address}/requests`}>
                                <a >
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                         </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
};

export default CampaignShow;