import Web3 from "web3";

let web3;

if (typeof window!=='undefined' && typeof window.web3!=='undefined'){ 
     //running in browser and metamask is available
     web3=new Web3(window.ethereum);
}
else{
    //on server or user has no metamask
    //create our own provider
    const provider=new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/827aea8af37a42babdbbc6ddd77dda0f'
    );

    web3=new Web3(provider);
}

export default web3;