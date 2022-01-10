testnet account:

Public Key	GA4UPH2WH2H54FDN6I63264ADNSARFU6F6ADSB7XZKPWQOTYBA4EDGMZ
Secret Key	SDUN2SVAOAXA6GJRAVBJLYVHOS3GR76PCK3C3ABY4D3VBQVQ2DFZHIKU



# txfees/{publicKey} - Get - get remaining fee balance for authed address
curl.exe -X 'GET' `
  'http://127.0.0.1:8787/tx-fees' `
  -H 'accept: application/json' `
  -H 'Authorization: Bearer AAAAAgAAAAA5R59WPo/eFG3yPb17gBtkCJaeL4A5B/fKn2g6eAg4QQAAAGQAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAABh24QSAAAAAAAAAAEAAAAAAAAACgAAAAlzaW5nbGVVc2UAAAAAAAABAAAABHRydWUAAAAAAAAAAXgIOEEAAABAza8KOmpm8Cy3c0G/rk7cjDRhFeue5qRVagLNP5OrBfC2vNOmkZ86QiMKQTNNpvQv53YMMql4jwXPGkXAMC2BAA=='

# txfees/{publicKey} - Post - deposit xlm for fees

curl.exe -X 'POST' `
  'http://127.0.0.1:8787/tx-fees/GA4UPH2WH2H54FDN6I63264ADNSARFU6F6ADSB7XZKPWQOTYBA4EDGMZ' `
  -H 'accept: application/json' `
  -H 'Content-Type: application/json' `
  -d @"
{
  \"txFunctionFee\": \"AAAAAgAAAAA5R59WPo/eFG3yPb17gBtkCJaeL4A5B/fKn2g6eAg4QQAAAGQABfSTAAAACAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAAAsUPPXiDxlIwvwh3+96O3QXqhi5w+VwjKR5zBpOiLZAgAAAAAAAAAABV1KgAAAAAAAAAABeAg4QQAAAEBAtVQay5ENuPG7/feevSSJu+DvR088nPvuzJ+/NB8aRyyn0++Ka4JPOh3wuYj4vEhED1NAJ5T0MgAU+ORcSjQD\"
}
"@

# / - get - get details

curl.exe -X 'GET' `
  'http://127.0.0.1:8787/' `
  -H 'accept: application/json'
