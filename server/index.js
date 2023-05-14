const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());



// PRIV_KEY_1 = "374f132c993b5cb4850348a50d25cb7da6df86b41ccbc7c3d0ecd67e935a2d4d"
// PRIV_KEY_2 = "8c016714f3f8ef90f1d6582b798ced50ba81493a4edbf809c387f949ba9cde2f"
// PRIV_KEY_3 = "c330060d884356d8e511584bd01749bdd181fb3a54870bfdcaa951509798bdbb"

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

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
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
