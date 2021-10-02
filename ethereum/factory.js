import web3 from "./web3";

import CampaignFactory from './build/CampaignFactory.json';

//creating a factory instance
const instance=new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x3CA44B7DAB621E0692C2434b687aC80A8c45B801'
);
export default instance; //if we need to get a hold of factory instance from
//any other file we can easily get it