const { Keypair, TransactionBuilder, Server, Account, Networks, Operation } = require('stellar-sdk')

// The hashes the fee payment can apply to
// Note - this can be empty. Then, this key can be used to run any txFunction.
const singleuse = true //change for if you want single use or not.0
const txFunctionHashes = [
];

const privateKeypair = Keypair.fromSecret('addasecret');
const pk = privateKeypair.publicKey();

const testnet = new Server('https://horizon-testnet.stellar.org');
(async () => {
    try {
        // setup a fake account with a -1 seq number.
        // This ensures a zero seq number when the transaction is built (TransactionBuilder increments once).
        const tempAcct = new Account(pk, '-1');
        const fee = await testnet.fetchBaseFee();
        const txBuilder = new TransactionBuilder(tempAcct, {fee, networkPassphrase: Networks.TESTNET});
        // add the manage data operations to specify the allowed txHashes to be run for this user
        for (const hash of txFunctionHashes) {
            txBuilder.addOperation(Operation.manageData({
                name: "txFunctionHash",
                value: hash
            }));
        }
        let tx
        // check for single use
        if (singleuse === true){
            //add single use managedata
            txBuilder.addOperation(Operation.manageData({
                name: "singleUse",
                value: 'true'
            }));
            // set TTL on the token for less than 1 hour
            tx = txBuilder.setTimeout(59*60).build();
            
        }else{
            // set ttl for 1 day
            tx = txBuilder.setTimeout(24*60*60).build();
    }
        
        
        
        // sign the TX with the source account of the Transaction. This token is now valid for this public key!
        tx.sign(privateKeypair);
        
        // this is the XDR Token
        const token = tx.toEnvelope().toXDR('base64')
        console.log(token);
    } catch (e) {
        console.error(e);
    }
})();