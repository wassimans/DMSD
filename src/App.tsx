import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import { useAccount } from "wagmi";
import { Wrap, WrapItem } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import DMSD from "./components/DMSD";
import Subscription from "./components/Subscription";
import Home from "./components/Home";
import Wallets from "./components/Wallets";

const App: React.FC = () => {
  const { isConnected } = useAccount();

  return (
    <>
      <Wrap margin={2} justify={"right"}>
        <WrapItem>
          <ConnectButton label="Connecter votre wallet" />
        </WrapItem>
      </Wrap>
      <Router>
        <div>
          <Routes>
            <Route
              path="/"
              element={isConnected ? <Navigate to="/DMSD" /> : <Login />}
            />
            {/* <Route
              path="/DMSD"
              element={
                isConnected ? <Navigate to="/DMSD/Home" /> : <Subscription />
              }
            /> */}
            <Route path="/" element={<Login />} />
            <Route path="/DMSD" element={<DMSD />} />
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default App;
