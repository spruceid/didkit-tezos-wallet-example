# didkit-tezos-wallet-example

Demo of issuing a VC using Tezos wallet Temple for signing.

## Usage

- Clone the repo alongside [https://github.com/spruceid/didkit/](didkit).
- Run `npm install`
- Serve this directory with a web server, and open `index.html` in a web browser where Temple is installed.
- Accept connection and signing request from wallet.

Note: this project hard-codes paths to npm packages in the `node_modules/` directory. This is generally not done because the internal structure of `node_modules/` is supposed to be abstracted by the package manager, but is done here to enable rapid prototyping without a bundler.

## Example

Signing request:  
![Signing Request](https://user-images.githubusercontent.com/95347/113930574-74db2a00-97bf-11eb-9956-c8c43aadb35a.png)

Signing input, copied from wallet and JSON-decoded:
```
Tezos Signed Message: 
_:c14n0 <http://purl.org/dc/terms/created> "2021-04-07T15:46:00.224Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/security#TezosSignature2021> .
_:c14n0 <https://w3id.org/security#proofPurpose> <https://w3id.org/security#assertionMethod> .
_:c14n0 <https://w3id.org/security#verificationMethod> <did:pkh:tz:tz1TwZZZSShtM73oEr74aDtDcns3UmFqaca6#TezosMethod2021> .

_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://www.w3.org/2018/credentials#VerifiableCredential> .
_:c14n0 <https://www.w3.org/2018/credentials#credentialSubject> <did:pkh:tz:tz1TwZZZSShtM73oEr74aDtDcns3UmFqaca6> .
_:c14n0 <https://www.w3.org/2018/credentials#issuanceDate> "2021-04-07T15:46:00.223Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
_:c14n0 <https://www.w3.org/2018/credentials#issuer> <did:pkh:tz:tz1TwZZZSShtM73oEr74aDtDcns3UmFqaca6> .
```

Verifiable Credential issued:
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ],
  "type": [
    "VerifiableCredential"
  ],
  "credentialSubject": {
    "id": "did:pkh:tz:tz1TwZZZSShtM73oEr74aDtDcns3UmFqaca6"
  },
  "issuer": "did:pkh:tz:tz1TwZZZSShtM73oEr74aDtDcns3UmFqaca6",
  "issuanceDate": "2021-04-07T19:17:16.208Z",
  "proof": {
    "@context": {
      "TezosMethod2021": "https://w3id.org/security#TezosMethod2021",
      "TezosSignature2021": {
        "@context": {
          "@protected": true,
          "@version": 1.1,
          "challenge": "https://w3id.org/security#challenge",
          "created": {
            "@id": "http://purl.org/dc/terms/created",
            "@type": "http://www.w3.org/2001/XMLSchema#dateTime"
          },
          "domain": "https://w3id.org/security#domain",
          "expires": {
            "@id": "https://w3id.org/security#expiration",
            "@type": "http://www.w3.org/2001/XMLSchema#dateTime"
          },
          "id": "@id",
          "nonce": "https://w3id.org/security#nonce",
          "proofPurpose": {
            "@context": {
              "@protected": true,
              "@version": 1.1,
              "assertionMethod": {
                "@container": "@set",
                "@id": "https://w3id.org/security#assertionMethod",
                "@type": "@id"
              },
              "authentication": {
                "@container": "@set",
                "@id": "https://w3id.org/security#authenticationMethod",
                "@type": "@id"
              },
              "id": "@id",
              "type": "@type"
            },
            "@id": "https://w3id.org/security#proofPurpose",
            "@type": "@vocab"
          },
          "proofValue": "https://w3id.org/security#proofValue",
          "publicKeyJwk": {
            "@id": "https://w3id.org/security#publicKeyJwk",
            "@type": "@json"
          },
          "type": "@type",
          "verificationMethod": {
            "@id": "https://w3id.org/security#verificationMethod",
            "@type": "@id"
          }
        },
        "@id": "https://w3id.org/security#TezosSignature2021"
      }
    },
    "type": "TezosSignature2021",
    "proofPurpose": "assertionMethod",
    "proofValue": "edsigtkDS2hB6bmD6imvwy8hmbJ3LksDDsRA3erqUeijmtYrXhxANyRc4o4qW596DVEjVmvxDntpgyeNbL8yJAevPqZqNnqwxgD",
    "verificationMethod": "did:pkh:tz:tz1TwZZZSShtM73oEr74aDtDcns3UmFqaca6#TezosMethod2021",
    "created": "2021-04-07T19:17:16.208Z",
    "publicKeyJwk": {
      "alg": "EdDSA",
      "crv": "Ed25519",
      "kty": "OKP",
      "x": "rVEB0Icbomw1Ir-ck52iCZl1SICc5lCg2pxI8AmydDw"
    }
  }
}
```
