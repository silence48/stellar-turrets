const { exec } = require('child_process')
const fs = require('fs')
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
  });
const execCmd = (command, workingDir) => {
	return new Promise((resolve, reject) => {
		exec(
			command,
			{
				cwd: workingDir
			},
			function(error, stdout, stderr) {
				error ? reject(error) : resolve((stdout || stderr).trim())
			}
		)
	})
}

const isAuthenticate = async () => {
	try {
		const output = await execCmd(`wrangler whoami`)

		if (output.toLowerCase().includes('are logged in')){
            console.log("User is logged in")
            return true
        } 

		return false
	} catch (err) {
        console.log("Login not found, please run wrangler login in your console and then try again")
		return false
	}
}

const getAccountId = async () => {
	try {
		const output = await execCmd(`wrangler whoami`)
        
		const acctrxp = /\s\|\s[A-Za-z0-9]{32}/g
		const match = output.match(acctrxp)
        const accountid = JSON.stringify(match).slice(5,37)
        console.log("your cf account id is: " + accountid)
		writethenv = fs.promises.appendFile('.env', ('WRANGLER_ACCOUNT_ID=' + accountid + "\n"))
		return true
	} catch (err) {
		console.log("Account id not found. please obtain it manually, run wrangler whoami")
        return undefined
	}
}

const getUserInput = async() => {
	try {
		readline.question('TESTNET_WRANGLER_WORKER_NAME = ', testnetWorkerName => {
			writethenv = fs.promises.appendFile('.env', ('TESTNET_WRANGLER_WORKER_NAME=' + testnetWorkerName + "\n"))
			readline.close();
		  })
		readline.question('PUBLIC_WRANGLER_WORKER_NAME = ', publicWorkerName => {
			writethenv = fs.promises.appendFile('.env', ('PUBLIC_WRANGLER_WORKER_NAME=' + publicWorkerName + "\n"))
			readline.close();
		  })
		return true
	} catch (err) {
		console.log("creating the names failed")
		return undefined
	}
}

const getinput = async () => {
	try {
		console.log('Fill in the requested output, if you do not have the KV namespaces ignore this for now as they will be created later')
		const output = await execCmd('npx envdist')
		return true
	} catch (err) {
		console.log("failed to creat keypairs please proceed manually.")
	}
}

const setupenv = async () => {
    try {
        const authenticated = await isAuthenticate()
        const accountid = await getAccountId()
        const input = await getinput()
        if(authenticated == true && accountid && input){
            console.log(authenticated + " " + accountid + " " + input)
            process.exit(1)
        }
        return false
    } catch (err){
        console.log('error failed please see the log')
        process.exit(1)
    }
    
}

setupenv()
