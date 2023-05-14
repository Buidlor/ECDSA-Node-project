import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import * as  secp from 'ethereum-cryptography/secp256k1';

function Transfer({ address, setBalance, pk }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [hash, setHash] = useState(""); 
  const [signature, setSignature] = useState("");
  const message = "hello world"

  const setValue = (setter) => (evt) => setter(evt.target.value);
  
  async function transfer(evt) {
    evt.preventDefault();
    console.log("private key (transfer) = ", pk)
    //hash the message and then sign it
    hashMessage()
    sign()

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

    async function hashMessage() {
      const hash = keccak256(utf8ToBytes(message))
      setHash(hash) 
      console.log("the message hash is ", hash)
    }
    

  async function sign (){
     const signature =  secp.secp256k1.sign(hash, pk);
    
      setSignature(signature)
      console.log("the signature is ", signature)
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
