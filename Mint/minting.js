"use strict"
	
import TokenABI from "./MoonRugs.js";
const contractAddress = "0x0932e96f0DC9C1ef6E8f2B28FD5AEA0F9faA11a8";

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

let providerOptions;

let provider;
let web3;
let account;
let contract;	
let web3Modal;

let numberOfTokensToMint = 1;

function getNumberOfTokensToMint(){
	numberOfTokensToMint = parseInt(document.querySelector("#numberOfTokens").value);
}

function setNumberOfTokensToMint(){
	document.querySelector("#numberOfTokens").value = numberOfTokensToMint.toString();
}

function increase(){
	numberOfTokensToMint++;
	if(numberOfTokensToMint > 10) numberOfTokensToMint = 10;
	setNumberOfTokensToMint();
}

function decrease(){
	numberOfTokensToMint--;
	if(numberOfTokensToMint < 1) numberOfTokensToMint = 1;
	setNumberOfTokensToMint();
}

function showMessage(message){
	var messageEl = document.querySelector('#message')
	messageEl.innerHTML = message
};

async function getAccountData(){
	web3 = new Web3(provider); 		
	const accounts = await web3.eth.getAccounts();
	account = accounts[0];
	contract = new web3.eth.Contract(TokenABI, contractAddress);
};

async function refreshAccountData(){
	await getAccountData();
};

function init() {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "935dd3e936284caa950afa817ecf10e9",
      }
    },
  };

  web3Modal = new Web3Modal({
    cacheProvider: false, 
    providerOptions,
  });
}

async function onConnect(){
	
	try {
		provider = await web3Modal.connect();
	} catch(e) {
		console.log("Did not connect a wallet.", e);
		return;
	}
	
	provider.on("accountsChanged", (accounts) => {
		getAccountData();
	});

	provider.on("chainChanged", (chainId) => {
		getAccountData();
	});

	provider.on("networkChanged", (networkId) => {
		getAccountData();
	});
	
	await refreshAccountData();
};

async function isConnected(){
	if(!web3) return false;
	try {
		return await web3.eth.net.isListening();
	}catch(err){
		return false;
	}
};

async function mint(numToMint){
	if(!web3 || !(await isConnected()))
		await onConnect();
		
	if(!await isConnected())
		return;
		
	const pricePerToken = 0.00;
	const priceForMint = pricePerToken * numToMint;
	var mintPrice = web3.utils.toWei(String(priceForMint), 'ether');
	try {
		console.log(`MoonRugs mint ${numToMint} for ${mintPrice} eth.`);
		contract.methods.mint(numberOfTokensToMint).send({
			from: account,
			value: mintPrice
		}, function(err, res) {
			if (err) {
				console.log(err);
				showMessage("Error: " + err.message);
				return
			}
			console.log(res);
			showMessage('Transaction submitted <a href="https://etherscan.io/tx/' + res + '">view on etherscan</a>');
		})
	} catch (error) {
		console.log(error);
		showMessage("Error: " + error.message);
	}
};

async function getTokenIds(){
	if(!web3 || !(await isConnected()))
		await onConnect();
		
	if(!await isConnected())
		return;
	
	try{
		let result = await contract.methods.tokensOfOwner(account).call();
		showMessage(`Tokens for account: ${account} is: ${result}`);
	} catch (error) {
		console.log(error);
		showMessage("Error: " + error.message);
	}
};

export async function getRugTokenIds(){
	if(!web3 || !(await isConnected()))
		await onConnect();
		
	if(!await isConnected())
		return;
	
	try{
		let result = await contract.methods.tokensOfOwner(account).call();
		return result.join();
	} catch (error) {
		return "Error: " + error.message;
	}
};


window.addEventListener('load', async () => {
	init();
	if(!(document.querySelector("#mintTokens"))) return;
	document.querySelector("#mintTokens").addEventListener("click", async ()=>{ await mint(numberOfTokensToMint); });
	document.querySelector("#numberOfTokens").addEventListener("change", () => { getNumberOfTokensToMint(); });
	document.querySelector("#numberOfTokens").addEventListener("keyup", () => { getNumberOfTokensToMint(); });
	document.querySelector("#increase").addEventListener("click", () => { increase(); });
	document.querySelector("#decrease").addEventListener("click", () => { decrease(); });
});
