import {nanoid} from './node_modules/nanoid/nanoid.js';
import initDIDKit, * as DIDKit from './node_modules/didkit-wasm/didkit_wasm.js';

function log(msg) {
	const pre = document.createElement('pre');
	pre.appendChild(document.createTextNode(msg));
	pre.style.whiteSpace = 'pre-wrap';
	document.body.appendChild(pre);
}

log('Loading...');

window.onerror = function (err) {
	log('Error: ' + err);
}

async function main() {
	window.nanoid = {nanoid};
	// dapp require nanoid
	const dapp = await import('./node_modules/@temple-wallet/dapp/dist/index.umd.js');
	const { TempleWallet } = window.dapp;
	await initDIDKit("/node_modules/didkit-wasm/didkit_wasm_bg.wasm");
	const version = DIDKit.getVersion();
	window.DIDKit = DIDKit;
	log('DIDKit version: ' + version);

	const wallet = new TempleWallet('MyAwesomeDapp');
	await wallet.connect('mainnet');
	await TempleWallet.isAvailable();
	const userAddress = wallet.pkh || (await wallet.getPKH());
	log('Wallet address: ' + userAddress);

	const {publicKey} = wallet.permission;
	/* TODO: Beacon?
	const publicKey = dapp.getCurrentPermission().publicKey;
	*/
	log('Public key: ' + publicKey);

	const publicKeyJwkString = await DIDKit.JWKFromTezos(publicKey);
	log('Public key JWK: ' + publicKeyJwkString);

	const did = 'did:pkh:tz:' + userAddress;
	const credential = {
		"@context": [
			"https://www.w3.org/2018/credentials/v1",
		],
		issuer: did,
		issuanceDate: new Date().toISOString(),
		type: ["VerifiableCredential"],
		credentialSubject: {
			id: did,
		},
	};
	const credentialString = JSON.stringify(credential);

	log('Credential: ' + credentialString);
	const proofOptions = {
		verificationMethod: did + "#TezosMethod2021",
		proofPurpose: "assertionMethod",
	};
	const proofOptionsString = JSON.stringify(proofOptions);
	log('Proof options: ' + proofOptionsString);

	const prepString = await DIDKit.prepareIssueCredential(
		credentialString,
		proofOptionsString,
		publicKeyJwkString
	);
	log('Preparation: ' + prepString);
	const preparation = JSON.parse(prepString);
	const {signingInput} = preparation;
	const micheline = signingInput && signingInput.micheline;
	if (!micheline) {
		throw new Error('Expected micheline signing input');
	}

	window.wallet = wallet;
	log('Expression: ' + micheline);
	const signature = await wallet.sign(micheline);
	log('Signature: ' + signature);

	/* Signing with Beacon might be something like this:
	const payload = {
		signingType: SigningType.MICHELINE,
		payload: micheline,
		sourceAddress: userAddress,
	};
	const { signature } = await wallet.client.requestSignPayload(payload);
	*/

	const vcString = await DIDKit.completeIssueCredential(
		credentialString,
		prepString,
		signature
	);
	log('VC: ' + vcString);

	const verifyOptionsString = proofOptionsString; //'{}';
	const verifyResultString = await DIDKit.verifyCredential(
		vcString, verifyOptionsString);
	log('Verification result: ' + verifyResultString);
}

main().catch((err) => {
	console.error(err);
	log('Error: ' + err.stack);
});
