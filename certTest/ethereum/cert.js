import web3 from "./web3";
import Certificate from "./build/certificate.json";

const certAuth = new web3.eth.Contract(
    JSON.parse(Certificate.interface),
    'contract abi'
);

export default certAuth;