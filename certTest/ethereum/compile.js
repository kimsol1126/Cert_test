const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');
 
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);
 
const certAuthPath = path.resolve(__dirname, 'contracts', 'Certificate.sol');
const source = fs.readFileSync(certAuthPath, 'utf8');
 
const input = JSON.stringify({
    language: 'Solidity',
    sources: {
        'Certificate.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
});

const abiString = solc.compile(input);
const contracts = JSON.parse(abiString).contracts['Certificate.sol'];
 
fs.ensureDirSync(buildPath);
for (let contract in contracts) {
    fs.outputJSONSync(
        path.resolve(buildPath, contract + ".json"),
        contracts[contract]
    );
}
