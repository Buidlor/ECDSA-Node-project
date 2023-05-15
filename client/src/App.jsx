import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
// [
//   "374f132c993b5cb4850348a50d25cb7da6df86b41ccbc7c3d0ecd67e935a2d4d", 
//   "8c016714f3f8ef90f1d6582b798ced50ba81493a4edbf809c387f949ba9cde2f",
//   "c330060d884356d8e511584bd01749bdd181fb3a54870bfdcaa951509798bdbb"
// ]
function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  
  const [pk, setPk] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        pk={pk}
        setPk={setPk}
      />
      <Transfer setBalance={setBalance} address={address} pk={pk}  />
    </div>
  );
}

export default App;
