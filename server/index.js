const express = require("express");
const secp = require("ethereum-cryptography/secp256k1");
const  {keccak256} = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { toHex } = require("ethereum-cryptography/utils");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());


const balances = {
  "a66045604e9dace389b29059570f5be8aa4001a5": 100,
  "1d14f19cfbe7af8c2154d4abeeea14f82f3ba76b": 50,
  "05503dc0c44ed4e2fbd09d513644c98d0c3c7571": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

// this function will convert the public key from hex to Uint8Array
function fromHex(hex) {
  const bytes = new Uint8Array(Math.ceil(hex.length / 2));
  for (let i = 0; i < bytes.length; i++)
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

app.post("/send", (req, res) => {
  const { sender, recipient, amount, publicKey, signature } = req.body;
  const messageHash = "a33321f98e4ff1c283c76998f14f57447545d339b3db534c6d886decb4209f28";
  
  let signatureBigInt = {
    r: BigInt(signature.r),
    s: BigInt(signature.s),
    recovery: BigInt(signature.recovery)
  };

  let publicKeyUint8Array = fromHex(publicKey);

  const isSigned =  secp.secp256k1.verify(signatureBigInt,messageHash, publicKeyUint8Array);
 
  if (!isSigned) {
    res.status(400).send({ message: "Invalid signature!" });
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
    return;
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

