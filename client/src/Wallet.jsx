import server from "./server";
import * as  secp from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';



function Wallet({ address, setAddress, balance, setBalance, pk, setPk}) {

  const privKey1 = import.meta.env.VITE_PRIV_KEY_1;
  const privKey2 = import.meta.env.VITE_PRIV_KEY_2;
  const privKey3 = import.meta.env.VITE_PRIV_KEY_3;

  const keyPairs = {
    "a66045604e9dace389b29059570f5be8aa4001a5":  privKey1,
    "1d14f19cfbe7af8c2154d4abeeea14f82f3ba76b":  privKey2,
    "05503dc0c44ed4e2fbd09d513644c98d0c3c7571":  privKey3
 }


  async function onChange(evt) {
    const pk = evt.target.value;
    setPk(pk);
    
    const publicKey = secp.secp256k1.getPublicKey(pk);
    const address = toHex(keccak256(secp.secp256k1.getPublicKey(pk).slice(1)).slice(-20));
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type an address, for example: 0x1" value={pk} onChange={onChange}></input>
      </label>
      <div>address:{address}</div>
      <div className="balance">Balance: {balance}</div>
      <pre>
      {
       ` 
        PRIV_KEY_1 = "374f132c993b5cb4850348a50d25cb7da6df86b41ccbc7c3d0ecd67e935a2d4d"
        PRIV_KEY_2 = "8c016714f3f8ef90f1d6582b798ced50ba81493a4edbf809c387f949ba9cde2f"
        PRIV_KEY_3 = "c330060d884356d8e511584bd01749bdd181fb3a54870bfdcaa951509798bdbb"
        `
      } 
      </pre>
    </div>
  );
}

export default Wallet;
