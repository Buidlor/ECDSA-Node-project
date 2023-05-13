import server from "./server";
import * as  secp from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';

function Wallet({ address, setAddress, balance, setBalance, pk, setPk }) {
  async function onChange(evt) {
    const pk = evt.target.value;
    setPk(pk);
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
    </div>
  );
}

export default Wallet;
