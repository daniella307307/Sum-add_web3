import React, { useEffect, useState } from "react";
import Web3 from "web3";
import SumContract from "../../../build/contracts/Sum.json";

const SumApp = () => {
    const [account, setAccount] = useState("");
    const [sumInstance, setSumInstance] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [number1, setNumber1] = useState(0);
    const [number2, setNumber2] = useState(0);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                console.log("Ethereum browser detected.");
                const web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
                setWeb3(web3);
                const accounts = await web3.eth.getAccounts();
                console.log("Accounts:", accounts);
                setAccount(accounts[0]);

                const networkId = await web3.eth.net.getId();
                console.log("Network ID:", networkId);
                const deployedNetwork = SumContract.networks[networkId];
                console.log("Deployed Network:", deployedNetwork);

                if (deployedNetwork) {
                    const instance = new web3.eth.Contract(
                        SumContract.abi,
                        deployedNetwork.address
                    );
                    setSumInstance(instance);
                } else {
                    console.error("Smart contract not deployed to detected network.");
                }
            } else {
                console.log("Ethereum browser not detected!");
            }
        };
        init();
    }, []);

    const handleCalculate = async () => {
    if (sumInstance) {
        try {
            const result = await sumInstance.methods.add(number1, number2).call();
            console.log("Result from smart contract:", result);
            setResult(parseInt(result)); // Convert result to a number
        } catch (error) {
            console.error("Error calling the smart contract:", error);
        }
    } else {
        console.error("sumInstance is not set");
    }
};


    return (
        <div>
            <h1>Sum of Two Numbers</h1>
            <p>Account: {account}</p>
            <input
                type="number"
                value={number1}
                onChange={(e) => setNumber1(Number(e.target.value))}
            />
            <input
                type="number"
                value={number2}
                onChange={(e) => setNumber2(Number(e.target.value))}
            />
            <button onClick={handleCalculate}>Calculate</button>
            {result !== null && <p>Result: {result}</p>}
        </div>
    );
};

export default SumApp;
