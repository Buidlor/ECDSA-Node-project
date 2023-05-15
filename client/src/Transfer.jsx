import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { toHex } from "ethereum-cryptography/utils";
import * as  secp from 'ethereum-cryptography/secp256k1';

function Transfer({ address, setBalance, pk }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState("");
  const [publicKey, setPublicKey] = useState("");
  

  const setValue = (setter) => (evt) => setter(evt.target.value);


  //sign messageHash with privateKey to get signature
  async function sign (){
    const messageHash = "a33321f98e4ff1c283c76998f14f57447545d339b3db534c6d886decb4209f28";
    const publicKey = secp.secp256k1.getPublicKey(pk);
    setPublicKey(publicKey)
    const signature = secp.secp256k1.sign(messageHash, pk);
    setSignature(signature)

    //verify signature on clientside
    const isSigned = secp.secp256k1.verify(signature, messageHash, publicKey);
    console.log("isSigned", isSigned);

    return {signature, publicKey}
  }
  
  async function transfer(evt) {
    evt.preventDefault();
    const {signature, publicKey} = await sign()
    
    // bigInt signature into string to send to server
    let signatureString = {
      r: signature.r.toString(),
      s: signature.s.toString(),
      recovery: signature.recovery.toString()
    };

    // publicKey into string to send to server
    let publicKeyString = toHex(publicKey);
    
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        publicKey: publicKeyString,
        signature: signatureString,
      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
      
    }
  }




  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />

      <pre>
       { `const balances = {
        "a66045604e9dace389b29059570f5be8aa4001a5": 100,
        "1d14f19cfbe7af8c2154d4abeeea14f82f3ba76b": 50,
        "05503dc0c44ed4e2fbd09d513644c98d0c3c7571": 75,
      };`}
      </pre>
    </form>
  );
}

export default Transfer;
