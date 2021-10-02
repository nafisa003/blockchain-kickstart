const path=require('path');
const solc=require('solc');
const fs=require('fs-extra');


let buildPath=path.resolve(__dirname,'build'); //storing path of build folder
fs.removeSync(buildPath);//removing previous build folder

const campaignPath=path.resolve(__dirname,'contracts','Campaign.sol');
const source=fs.readFileSync(campaignPath,'utf8');
const output=solc.compile(source,1).contracts; //compiling raw code

//console.log(output);
fs.ensureDirSync(buildPath); //creating new build folder

for(let contract in output){ //contract is like i/iterator in for loop
    fs.outputJSONSync(
        path.resolve(buildPath,contract.replace(':','')+'.json'), //creating files with objects of output
        output[contract]
    );
}
