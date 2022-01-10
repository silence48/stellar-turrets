{
    "function": "(()=>{var e={722:(e,t,r)=>{const s=r(576),{map:a}=r(517),{Server:o,Networks:n,TransactionBuilder:i,Operation:u,Asset:d}=r(427),c=\"GCRHEEBJQ5FLJPHIGIQWJ7YLBT64MK7TS7W4K7PDIZQC5HCFN7KVKOWF\",l=new d(\"SmartNFT00\",c),p=new o(HORIZON_URL);e.exports=async e=>{const{source:t}=e,r=await p.trades().forAssetPair(l,d.native()).limit(95).order(\"desc\").call().then((({records:e})=>a(e,\"counter_account\"))).catch((()=>[])),o=await p.assets().forCode(l.code).forIssuer(l.issuer).limit(1).call().then((({records:[e]})=>{var t;return new s((null==e||null===(t=e.balances)||void 0===t?void 0:t.unauthorized)??0).toFixed(0,3)}));return p.loadAccount(c).then((e=>{let a=new i(e,{fee:\"0\",networkPassphrase:n[STELLAR_NETWORK]}).addOperation(u.changeTrust({asset:l,limit:\"1\",source:t})).addOperation(u.setTrustLineFlags({asset:l,trustor:t,flags:{authorized:!0}})).addOperation(u.manageSellOffer({selling:l,buying:d.native(),amount:\"1\",price:\"0.0000001\"})).addOperation(u.manageBuyOffer({selling:d.native(),buying:l,buyAmount:\"1\",price:\"0.0000001\",source:t})).addOperation(u.setTrustLineFlags({asset:l,trustor:t,flags:{authorized:!1}}));return r.forEach((e=>{const r=new s(o).div(95).pow(2).toFixed(0,2);a.addOperation(u.payment({destination:e,asset:d.native(),amount:r,source:t}))})),a=a.setTimeout(0).build(),a.toXDR()}))}},517:e=>{\"use strict\";e.exports=require(\"lodash\")},576:e=>{\"use strict\";e.exports=require(\"bignumber.js\")},427:e=>{\"use strict\";e.exports=require(\"stellar-sdk\")}},t={};var r=function r(s){var a=t[s];if(void 0!==a)return a.exports;var o=t[s]={exports:{}};return e[s](o,o.exports,r),o.exports}(722);module.exports=r})();",
    "fields": [
    {
    "name": "source",
    "type": "string",
    "description": "Stellar address of the buyer",
    "rule": "Must be a valid Stellar address"
    }
    ],
    "signer": "GBSOHYMDNL4DL2J62DMTFXRIFU7KU4G6SRTGTZD2KVFPUF5LMTNISZHX"
    }