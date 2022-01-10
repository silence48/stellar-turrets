#example-requests and responses

stellar.toml
routermatch, ln90
```js
"routermatch": [{
"method": "GET",
"path": "/.well-known/stellar.toml",
"keys": [],
"options": {},
"regexp": {},
"matches": ["/.well-known/stellar.toml"],
"params": {}
},]
```
routerresponse, ln93
```js            
"routerresponse": [{
"webSocket": null,
"url": "",
"redirected": false,
"ok": true,
"headers": {},
"statusText": "OK",
"status": 200,
"bodyUsed": false,
"body": { "locked": false }
}]
```

## testing /tx-fees with an auth token:
```powershell
curl.exe -X 'GET' `
>>   'https://testnet-turret-alpha1.s3x.workers.dev/tx-fees' `
>>   -H 'accept: application/json' `
>>   -H 'Authorization: Bearer AAAAAgAAAACvg9eAtrX0fOxem0ZcpoHWaO2cPapfLIB4V6lyY4gD+QAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAABh0lgtAAAAAAAAAAAAAAAAAAAAAWOIA/kAAABANhcnbRDgUOVaQL3rhzRqgIjmGNNZR01wPLv9PatnW2jfjyRq/UtI5ndGJ8RTOHjOR+8pnpGLPRJFKGd80GsEDg=='
```
### /expected return: 
```json
{"hash":"b59a2a10299b45e21ff8a1866ce46dbd6eb19b80972a90a0f1b20489d443ad1a",
"publicKey":"GCXYHV4AW227I7HML2NUMXFGQHLGR3M4HWVF6LEAPBL2S4TDRAB7SYRU",
"lastModifiedTime":0,
"balance":0,
"txFunctionHashes":[],
"singleUse":false}
```

## logs from get on fees:
```json
{"outcome":"ok","scriptName":null,"exceptions":[],"logs":[
  {"message":["START ENV"],"level":"log","timestamp":1641105565529},
  {"message":[{"HORIZON_URL":"https://horizon-testnet.stellar.org","META":{},"RUN_DIVISOR":"1000000","STELLAR_NETWORK":"TESTNET","TURRET_ADDRESS":"GAWFB46XRA6GKIYL6CDX7PPI5XIF5KDC44HZLQRSSHTTA2J2ELMQEEWC","TURRET_RUN_URL":"lp2sscctpi.execute-api.us-east-1.amazonaws.com","TURRET_SIGNER":"SDNQAFFYAJJEOMZ2VFACXPGI6Y454PIV7IFNWJ4KKHAC2BE3WWQNAEDJ","TX_FEES":{},"TX_FUNCTIONS":{},"UPLOAD_DIVISOR":"1000","XLM_FEE_MAX":"10","XLM_FEE_MIN":"1"}],"level":"log","timestamp":1641105565529},
  
  {"message":["END ENV, start request line 55 index.js"],"level":"log","timestamp":1641105565529},{"message":[{"cf":{"clientTcpRtt":47,"longitude":"-83.64260","latitude":"41.70520","tlsCipher":"ECDHE-RSA-AES128-GCM-SHA256","continent":"NA","asn":13490,"country":"US","tlsClientAuth":{"certIssuerDNLegacy":"","certIssuerSKI":"","certSubjectDNRFC2253":"","certSubjectDNLegacy":"","certFingerprintSHA256":"","certNotBefore":"","certSKI":"","certSerial":"","certIssuerDN":"","certVerified":"NONE","certNotAfter":"","certSubjectDN":"","certPresented":"0","certRevoked":"0","certIssuerSerial":"","certIssuerDNRFC2253":"","certFingerprintSHA1":""},"tlsExportedAuthenticator":{"clientFinished":"85a22b090262a73a4192e6b7edbcc685b7d08fbff0641df4070518977a232349","clientHandshake":"d9ad9fc85cb9489ab022275425567f556ed2ad8b67b75145ed89a670b2111622","serverHandshake":"ab47e114c6a60209cb41dfcf04647b81b40d6eb312b9c138e9903f9e8c793df5","serverFinished":"8c011ff067b4860f58f5e68ae9605b8a1a37ea68904d91daca46a55ec93d8579"},"tlsVersion":"TLSv1.2","colo":"ORD","timezone":"America/New_York","city":"Toledo","edgeRequestKeepAliveStatus":1,"requestPriority":"","httpProtocol":"HTTP/1.1","region":"Ohio","regionCode":"OH","asOrganization":"Buckeye Cablevision","metroCode":"547","postalCode":"43623"},"signal":{"aborted":false},"fetcher":{},"redirect":"manual","headers":{},"url":"https://testnet-turret-alpha1.s3x.workers.dev/tx-fees","method":"GET","bodyUsed":false,"body":null}],"level":"log","timestamp":1641105565529},{"message":["END REQUEST"],"level":"log","timestamp":1641105565529},
  {"message":[{}],"level":"log","timestamp":1641105565529},
  {"message":["END CTX"],"level":"log","timestamp":1641105565529},{
    "message":["The router match line 90 on index"],"level":"log","timestamp":1641105565529},
  
  {"message":[{"method":"GET","path":"/tx-fees","keys":[],"options":{},"regexp":{},"matches":["/tx-fees"],"params":{}}],"level":"log","timestamp":1641105565529},{"message":["The router match end"],"level":"log","timestamp":1641105565529},
  
  {"message":["welcome to the authtxtoken function I shall be your logger"],"level":"log","timestamp":1641105565529},{"message":["first i will give you network, then authtoken then a string saying end in the future it will just be start, params, end"],"level":"log","timestamp":1641105565529},
  
  {"message":["TESTNET"],"level":"log","timestamp":1641105565529},
  
  {"message":["AAAAAgAAAACvg9eAtrX0fOxem0ZcpoHWaO2cPapfLIB4V6lyY4gD+QAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAABh0lgtAAAAAAAAAAAAAAAAAAAAAWOIA/kAAABANhcnbRDgUOVaQL3rhzRqgIjmGNNZR01wPLv9PatnW2jfjyRq/UtI5ndGJ8RTOHjOR+8pnpGLPRJFKGd80GsEDg=="],"level":"log","timestamp":1641105565529},
  
  {"message":["end"],"level":"log","timestamp":1641105565529},{"message":["the authtx"],"level":"log","timestamp":1641105565529},{"message":[{"_networkPassphrase":"Test SDF Network ; September 2015","_tx":{"_attributes":{"sourceAccount":{"_switch":{"name":"keyTypeEd25519","value":0},"_arm":"ed25519","_armType":{"_length":32,"_padding":0},"_value":{"type":"Buffer","data":[175,131,215,128,182,181,244,124,236,94,155,70,92,166,129,214,104,237,156,61,170,95,44,128,120,87,169,114,99,136,3,249]}},"fee":0,"seqNum":{"low":0,"high":0,"unsigned":false},"timeBounds":{"_attributes":{"minTime":{"low":0,"high":0,"unsigned":true},"maxTime":{"low":1641175085,"high":0,"unsigned":true}}},"memo":{"_switch":{"name":"memoNone","value":0},"_arm":{},"_armType":{}},"operations":[],"ext":{"_switch":0,"_arm":{},"_armType":{}}}},"_signatures":[{"_attributes":{"hint":{"type":"Buffer","data":[99,136,3,249]},"signature":{"type":"Buffer","data":[54,23,39,109,16,224,80,229,90,64,189,235,135,52,106,128,136,230,24,211,89,71,77,112,60,187,253,61,171,103,91,104,223,143,36,106,253,75,72,230,119,70,39,196,83,56,120,206,71,239,41,158,145,139,61,18,69,40,103,124,208,107,4,14]}}}],"_fee":"0","_envelopeType":
  
  {"name":"envelopeTypeTx","value":2},"_memo":{"_switch":{"name":"memoNone","value":0},"_arm":{},"_armType":{}},"_sequence":"0","_source":"GCXYHV4AW227I7HML2NUMXFGQHLGR3M4HWVF6LEAPBL2S4TDRAB7SYRU","_timeBounds":{"minTime":"0","maxTime":"1641175085"},"_operations":[]}],"level":"log","timestamp":1641105565529},{"message":["the end of authtx"],"level":"log","timestamp":1641105565529},{"message":["GCXYHV4AW227I7HML2NUMXFGQHLGR3M4HWVF6LEAPBL2S4TDRAB7SYRU"],"level":"log","timestamp":1641105565529},{"message":["The router response on line 93"],"level":"log","timestamp":1641105565607},{"message":[{"webSocket":null,"url":"","redirected":false,"ok":true,"headers":{},"statusText":"OK","status":200,"bodyUsed":false,"body":{"locked":false}}],"level":"log","timestamp":1641105565607},{"message":["continues to the if method get"],"level":"log","timestamp":1641105565607},
  
{"message":["{\"webSocket\":null,\"url\":\"\",\"redirected\":false,\"ok\":true,\"headers\":{},\"statusText\":\"OK\",\"status\":200,\"bodyUsed\":false,\"body\":{\"locked\":false}}"],"level":"log","timestamp":1641105565607},
  
  {"message":[{"webSocket":null,"url":"","redirected":false,"ok":true,"headers":{},"statusText":"OK","status":200,"bodyUsed":false,"body":{"locked":false}}],"level":"log","timestamp":1641105565607}],"eventTimestamp":1641105565529,"event":{"request":{"url":"https://testnet-turret-alpha1.s3x.workers.dev/tx-fees","method":"GET","headers":{"accept":"application/json","accept-encoding":"gzip","authorization":"REDACTED","cf-connecting-ip":"72.241.33.170","cf-ipcountry":"US","cf-ray":"6c71fd788df32bc8","cf-visitor":"{\"scheme\":\"https\"}","connection":"Keep-Alive","host":"testnet-turret-alpha1.s3x.workers.dev","user-agent":"curl/7.55.1","x-forwarded-proto":"https","x-real-ip":"72.241.33.170"},"cf":{"clientTcpRtt":47,"longitude":"-83.64260","latitude":"41.70520","tlsCipher":"ECDHE-RSA-AES128-GCM-SHA256","continent":"NA","asn":13490,"country":"US","tlsClientAuth":{"certIssuerDNLegacy":"","certIssuerSKI":"","certSubjectDNRFC2253":"","certSubjectDNLegacy":"","certFingerprintSHA256":"","certNotBefore":"","certSKI":"","certSerial":"","certIssuerDN":"","certVerified":"NONE","certNotAfter":"","certSubjectDN":"","certPresented":"0","certRevoked":"0","certIssuerSerial":"","certIssuerDNRFC2253":"","certFingerprintSHA1":""},"tlsExportedAuthenticator":{"clientFinished":"85a22b090262a73a4192e6b7edbcc685b7d08fbff0641df4070518977a232349","clientHandshake":"d9ad9fc85cb9489ab022275425567f556ed2ad8b67b75145ed89a670b2111622","serverHandshake":"ab47e114c6a60209cb41dfcf04647b81b40d6eb312b9c138e9903f9e8c793df5","serverFinished":"8c011ff067b4860f58f5e68ae9605b8a1a37ea68904d91daca46a55ec93d8579"},"tlsVersion":"TLSv1.2","colo":"ORD","timezone":"America/New_York","city":"Toledo","edgeRequestKeepAliveStatus":1,"requestPriority":"","httpProtocol":"HTTP/1.1","region":"Ohio","regionCode":"OH","asOrganization":"Buckeye Cablevision","metroCode":"547","postalCode":"43623"}}}}
```

//xdr-envelope for fee payment to GAWFB46XRA6GKIYL6CDX7PPI5XIF5KDC44HZLQRSSHTTA2J2ELMQEEWC

```
AAAAAgAAAACvg9eAtrX0fOxem0ZcpoHWaO2cPapfLIB4V6lyY4gD+QAAAGQABG//AAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAAAsUPPXiDxlIwvwh3+96O3QXqhi5w+VwjKR5zBpOiLZAgAAAAAAAAAABV1KgAAAAAAAAAABY4gD+QAAAEBGGu0N08I0Y6NKgbjxwuifwhcxKE8dsGaR6cg5vc1JhSGc4dVM5DoUiieD/EFZ+H8Q5u8JPU4M55HJgZk/0NgM
```
```powershell
curl.exe -X 'POST' `
  'https://testnet-turret-alpha1.s3x.workers.dev/tx-fees/GAWFB46XRA6GKIYL6CDX7PPI5XIF5KDC44HZLQRSSHTTA2J2ELMQEEWC' `
  -H 'accept: application/json' `
  -H 'Content-Type: application/json' `
  -d @"
{
  \"txFunctionFee\": \"AAAAAgAAAACvg9eAtrX0fOxem0ZcpoHWaO2cPapfLIB4V6lyY4gD+QAAAGQABG//AAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAAAsUPPXiDxlIwvwh3+96O3QXqhi5w+VwjKR5zBpOiLZAgAAAAAAAAAABV1KgAAAAAAAAAABY4gD+QAAAEBGGu0N08I0Y6NKgbjxwuifwhcxKE8dsGaR6cg5vc1JhSGc4dVM5DoUiieD/EFZ+H8Q5u8JPU4M55HJgZk/0NgM\"
}
"@
```

Response:

```json
{"publicKey":"GAWFB46XRA6GKIYL6CDX7PPI5XIF5KDC44HZLQRSSHTTA2J2ELMQEEWC",
"paymentHash":"7d1affc38614d47db18afc4cc5e681caf9c72b3fa6835652282570257ab2f295",
"lastModifiedTime":"1641107513026",
"balance":"9.0000000"}
```

## /tx-functions (list)

```json
{
"list_complete": true,
"keys": [
{
"hash": "0dc6069c2954910d4b010c8d6e2f9aac07f15e5f73a068993dcefd97ca36fcba",
"signer": "GBQDL37UM77ND3PJZTY72ITUEBOLRVOFIMYU3QR2TJXRGIVVA3N5Y5ST"
},
{
"hash": "1b364d39a3a0b8ee4a37f83160b61f56a3335fbc84d1f0e3d6c953f8b4365f5d",
"signer": "GDIHVCJ5LBZZNPQX24SFGL3PEFLPMQWFGN25VJNRKCHEFV3AFQRRDZSW"
},
{
"hash": "1de937659ab9dc148ad80020d21ba6d397b9e0713018cac556d25c4e10486678",
"signer": "GCF7HYBMJ7BX2F6ICR4GBV5SDCTNPOK3ZOX4QCCT4UUM2MT5JZGWKXMD"
},
{
"hash": "5bdddf55910113ab250e4b373b9c71a00facfe04cc8dda2bd98a0d1f68290ad8",
"signer": "GBA4YHEVGCZR6DIX5F2CI4JJNN27RVYXNMMQ7C6HPMZ6I3VQXCNUR6KS"
},
{
"hash": "b97ea3f0ca317fc75a6b428a71b6c232e302d377f90e5e41fa8f8f8a145c5566",
"signer": "GBSOHYMDNL4DL2J62DMTFXRIFU7KU4G6SRTGTZD2KVFPUF5LMTNISZHX"
},
{
"hash": "c39945fbae4fcc60723a0d43bd1527e03b3077996ae8631f2b258c79dece922d",
"signer": "GDTI6DUPQXOJMC2AGY6CSVXONH6JD6EPVCIMNMUN74B6NXUTEUXJYAFL"
},
{
"hash": "f651431e9d8b8a1f8aa5eee6250502905a387edbf95bee09db3a0ad427ad6605",
"signer": "GCCGEGVONILIE5ZV4EMXYKSAJJLXAFTLTKM2VUYQFAM4XGGSYDQVKC3V"
}
]
}
```

```ps
 curl.exe -X 'POST' `
  'https://testnet-turret-alpha1.s3x.workers.dev/tx-functions' `
  -H 'accept: application/json' `
  -H 'Content-Type: multipart/form-data' `
  -F 'txFunction=sample.js `
  -F 'txFunctionFields=Wwp7CiJuYW1lIjogIldhbGxldEFkZHIiLAoidHlwZSI6ICJTdHJpbmciLAoiZGVzY3JpcHRpb24iOiAiUHVibGljIEtleSBvZiB0aGUgd2FsbGV0IiwKInJ1bGUiOiAiUmVxdWlyZWQiCn0sCnsKIm5hbWUiOiAibmZ0Q29kZSIsCiJ0eXBlIjogInN0cmluZyIsCiJkZXNjcmlwdGlvbiI6ICJ0aGUgY29kZSBvZiB0aGUgbmZ0IiwKInJ1bGUiOiAiUmVxdWlyZWQiCn0sCnsKIm5hbWUiOiAibmZ0SXNzdWVyIiwKInR5cGUiOiAiU3RyaW5nIiwKImRlc2NyaXB0aW9uIjogIlB1YmxpYyBrZXkgb2YgdGhlIE5GVCBJc3N1aW5nIGFjY291bnQiLAoicnVsZSI6ICJSZXF1aXJlZCIKfSwKewoibmFtZSI6ICJwcmljZSIsCiJ0eXBlIjogInN0cmluZyIsCiJkZXNjcmlwdGlvbiI6ICJUaGUgcHJpY2UgYXQgd2hpY2ggdGhlIG5mdCBpcyB0byBiZSBzb2xkIGF0IiwKInJ1bGUiOiAiUmVxdWlyZWQiCn0sCnsKIm5hbWUiOiAiYnV5aW5nQ29kZSIsCiJ0eXBlIjogInN0cmluZzoiLAoiZGVzY3JpcHRpb24iOiAiVGhlIGNvZGUgb2YgdGhlIGFzc2V0IGJlaW5nIHRyYWRlZCIsCiJydWxlIjogIk9wdGlvbmFsIgp9LAp7CiJuYW1lIjogImJ1eWluZ0lzc3VlciIsCiJ0eXBlIjogInN0cmluZyIsCiJkZXNjcmlwdGlvbiI6ICJUaGUgcHVibGljIGtleSBvZiB0aGUgaXNzdWluZyBhY2NvdW50IGZvciB0aGUgYXNzZXQgYmVpbmcgdHJhZGVkIiwKInJ1bGUiOiAiT3B0aW9uYWwiCn0sCnsKIm5hbWUiOiAicXVhbnRpdHkiLAoidHlwZSI6ICJpbnRlZ2VyIiwKImRlc2NyaXB0aW9uIjogIlRoZSBhbW91bnQgdG8gYmUgc29sZCwgbXVzdCBiZSBhIGhvbGUgaW50ZWdlciIsCiJydWxlIjogIlJlcXVpcmVkIgp9LAp7CiJuYW1lIjogIm9mZmVySUQiLAoidHlwZSI6ICJpbnRlZ2VyIiwKImRlc2NyaXB0aW9uIjogIlRoZSBJRCBvZiB0aGUgc2VsbCBvcmRlciB0byBiZSBjYW5jZWxsZWQuIElmIGxlZnQgYmxhbmsgaXQgd2lsbCBjcmVhdGUgYSBuZXcgc2VsbCBvcmRlciIsCiJydWxlIjogIk9wdGlvbmFsIgp9Cl0=' `
  -F 'txFunctionFee=AAAAAgAAAACvg9eAtrX0fOxem0ZcpoHWaO2cPapfLIB4V6lyY4gD+QAAAGQABG//AAAAAgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAAAsUPPXiDxlIwvwh3+96O3QXqhi5w+VwjKR5zBpOiLZAgAAAAAAAAAAATEtAAAAAAAAAAABY4gD+QAAAECS3s27u1OFssEapCzltP+ZKCxG8MvCzo15Y8z66nbFjn4UeNPGHY9jrll3Fw/LusX/g6ebBRZeNjbgmyMHsvgE'
```


## txfees deposit

```js
{
  "publicKey": "GA4UPH2WH2H54FDN6I63264ADNSARFU6F6ADSB7XZKPWQOTYBA4EDGMZ",
  "paymentHash": "87edb4fb61fe87be56186a94d286f0776de6ceb57921e196818ebb9a6cf9c27e",
  "lastModifiedTime": "1641611942956",
  "balance": "9.0000000"
}
```

## single use auth token tx fees check
```js{
  "hash": "d60621550a074df7c3085eafc42a8d73524a173d7f49d5bd9cda555966859a74",
  "publicKey": "GA4UPH2WH2H54FDN6I63264ADNSARFU6F6ADSB7XZKPWQOTYBA4EDGMZ",
  "lastModifiedTime": "1641677616974",
  "balance": "36.0000000",
  "txFunctionHashes": [],
  "singleUse": true
}```

## router array 
```js
ae {
  routes: [
    {
      method: 'GET',
      path: '/',
      handler: [AsyncFunction: X],
      keys: [],
      options: {},
      regexp: /^\/[\/#\?]?$/i
    },
    {
      method: 'GET',
      path: '/.well-known/stellar.toml',
      handler: [AsyncFunction: ue],
      keys: [],
      options: {},
      regexp: /^\/\.well-known\/stellar\.toml[\/#\?]?$/i
    },
    {
      method: 'POST',
      path: '/jsontest',
      handler: [AsyncFunction: _t],
      keys: [],
      options: {},
      regexp: /^\/jsontest[\/#\?]?$/i
    },
    {
      method: 'POST',
      path: '/tx-functions',
      handler: [AsyncFunction: ze],
      keys: [],
      options: {},
      regexp: /^\/tx-functions[\/#\?]?$/i
    },
    {
      method: 'GET',
      path: '/tx-functions',
      handler: [AsyncFunction: ye],
      keys: [],
      options: {},
      regexp: /^\/tx-functions[\/#\?]?$/i
    },
    {
      method: 'GET',
      path: '/tx-functions/:txFunctionHash',
      handler: [AsyncFunction: Q],
      keys: [Array],
      options: {},
      regexp: /^\/tx-functions(?:\/([^\/#\?]+?))[\/#\?]?$/i
    },
    {
      method: 'POST',
      path: '/tx-functions/:txFunctionHash',
      handler: [AsyncFunction: We],
      keys: [Array],
      options: {},
      regexp: /^\/tx-functions(?:\/([^\/#\?]+?))[\/#\?]?$/i
    },
    {
      method: 'GET',
      path: '/tx-fees',
      handler: [AsyncFunction: Oe],
      keys: [],
      options: {},
      regexp: /^\/tx-fees[\/#\?]?$/i
    },
    {
      method: 'POST',
      path: '/tx-fees/:publicKey',
      handler: [AsyncFunction: Y],
      keys: [Array],
      options: {},
      regexp: /^\/tx-fees(?:\/([^\/#\?]+?))[\/#\?]?$/i
    },
    {
      method: 'PUT',
      path: '/ctrl-accounts/:ctrlAccount',
      handler: [AsyncFunction: _e],
      keys: [Array],
      options: {},
      regexp: /^\/ctrl-accounts(?:\/([^\/#\?]+?))[\/#\?]?$/i
    }
  ]
}```