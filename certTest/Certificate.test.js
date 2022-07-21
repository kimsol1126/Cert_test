require('dotenv').config({ path: '../.env' });

const assert = require('assert');
const ganache = require('ganache-cli');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const compileCert = require('../ethereum/build/certificate.json');

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://192.168.35.33:8545");
const web3 = new Web3(provider);

/* current time */
const moment = require('moment');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

let accounts = [];
let certAddress = null;
let cert = null;
let aMoment;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showtime(issuending){
    let date =  new Date(issuending * 1000);
    aMoment = moment(date);

    console.log("Issue Ending Time", aMoment.format('YYYY-MM-DD HH:mm:ss'));
    console.log("Current Time", moment().format('YYYY-MM-DD HH:mm:ss'));

}

let myaccount_1, myaccount_2, gasValue;
beforeEach(async () => {

    console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
    accounts = await web3.eth.getAccounts();
    console.log(accounts);
    myaccount_1 = accounts[1];
    myaccount_2 = accounts[2];
    gasValue = '5000000';

    const cert = new web3.eth.Contract(
        compiledCert.abi,
        '0x431f0210938D75DDcb51fce7f2bDFFCe0121Abe2' //attach abi hash
    );
    console.log("Gas Price: ")
    web3.eth.getGasPrice().then(console.log);

    console.log(myaccount_1);

    console.log("Here is the line 56");
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
});
//please fix
describe('Issue is success in HODU-Net', () => {

    it('Deposit for the bid in HODU-Net', async () => {
        let result;
        try {
            result = await auction.methods.receiveDeposit().send({
                from: myaccount_1,
                value: web3.utils.toWei('0.5', 'ether'),
                gas: gasValue
            });
        }
        catch (err) {
            console.log(err.message);
        }
        console.log("Here is the line 93", result);

        let auctionending = await auction.methods.auctionEnd().call();

        showtime(auctionending);

        let receiveDeposit = await auction.methods.deposit(myaccount_1).call();
        console.log("deposit received", receiveDeposit);
        assert.equal(receiveDeposit,web3.utils.toWei('0.5', 'ether'));

        console.log("Here is the line 102");

        try {
            result = await auction.methods.receiveDeposit().send({
                from: myaccount_2,
                value: web3.utils.toWei('0.6', 'ether'),
                gas: gasValue
            });
        }
        catch (err) {
            console.log(err.message);
        }

        console.log("Here is the line 115", result);
        auctionending = await auction.methods.auctionEnd().call();
        showtime(auctionending);

        let receiveDeposit2 = await auction.methods.deposit(myaccount_2).call();
        console.log("deposit received", receiveDeposit2);
        assert.equal(receiveDeposit2,web3.utils.toWei('0.6', 'ether'));

// start bidding 
        await auction.methods.bid(web3.utils.toWei('0.1', 'ether')).send({
            gas: gasValue,
            from: myaccount_1
        });

        bidNum = await auction.methods.bids(myaccount_1).call();
        console.log(bidNum);
        assert.ok(bidNum);
        console.log("here is 133 line--->First Bid is ended");
        showtime(auctionending);

        await auction.methods.bid(web3.utils.toWei('0.2', 'ether')).send({
            gas: gasValue,
            from: myaccount_2
        });

        bidNum = await auction.methods.bids(myaccount_2).call();
        console.log(bidNum);
        assert.ok(bidNum);

// finish bidding 
        await sleep(110000);
        console.log("here is 149 line--->Finishing Bid is ended");
        showtime(auctionending);

        await auction.methods.successfulBid().send({
            from: myaccount_2,
            value: web3.utils.toWei('0.2', 'ether'),
            gas: gasValue
        });

        const auctionInstance = await auction.methods.a().call({from: myaccount_2});
        console.log("bidding result");
        console.log(auctionInstance[3]);

        assert.equal(auctionInstance[3], web3.utils.toWei('0.2', 'ether'));
 

        console.log(myaccount_1);
        
        console.log("Here is the line 160", result);
        auctionending = await auction.methods.auctionEnd().call();
        showtime(auctionending);

        await auction.methods.refundDeposit().send({
            from: myaccount_1,
//            value: web3.utils.toWei('0.5', 'ether'),
            gas: gasValue
        });

        let remainingDeposit = await auction.methods.deposit(myaccount_1).call();
        console.log("remaining deposit", remainingDeposit);     
        assert.ok(remainingDeposit);

        console.log(myaccount_1);

        await auction.methods.refundDeposit().send({
            from: myaccount_2,
//            value: web3.utils.toWei('0.6', 'ether'),
            gas: gasValue
        });

        remainingDeposit = await auction.methods.deposit(myaccount_2).call();
        console.log("remaining deposit", remainingDeposit);
        assert.ok(remainingDeposit);
    });


});