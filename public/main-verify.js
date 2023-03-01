
function ascii_to_hexa(str)
  {
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	 }
	return arr1.join('');
   }

function _promEthereumPersonalSign(challenge_string) {
     return new Promise(function (resolve, reject) {
          ethereum.request({ 
               method: 'personal_sign',
               params: [
                    // hex encoded string
                    ascii_to_hexa(challenge_string), 
                    // account
                    softAddress(true)],
          })
          .then((response) => {
//               _promEthereumPersonalVerify(challenge_string,response,softAddress(true));
               resolve(response);
          })
          .catch((error) => {
               MetaLog.error(error, error.code);
               reject();
          });
     });
}

function _promEthereumPersonalVerify(message, hash, account) {
     return new Promise(function (resolve, reject) {
          ethereum.request({ 
               method: 'personal_ecRecover',
               params: [message, hash],
          })
          .then((response) => {
               resolve(response);
          })
          .catch((error) => {
               MetaLog.error(error, error.code);
               reject();
          });
     });
}



// // channel for sending and receiving blockchain information
// bot._client.registerChannel('ethereum', ['string', []])

// bot._client.on('ethereum', (msg) => {
// console.log('Ethereum:', msg)
// // console.log('My wallet: ', playScreen.walletAddress)

// // respond to server challenge
// if (msg.slice(0, 5) === 'chal:' && playScreen.walletAddress !== '') {
// const challenge = msg.slice(5)
// if (playScreen.web3wc !== undefined) {
// const signed = playScreen.web3wc.eth.personal
// .sign(challenge, playScreen.walletAddress)
// .then((response) => {
// console.log('Signed challenge:', response)
// bot._client.writeChannel('ethereum', 'chal:' + response)
// })
// } else {
// window.ethereum
// .request({
// method: 'personal_sign',
// params: [challenge, playScreen.walletAddress],
// })
// .then((response) => {
// // send the signed response
// console.log('chal:' + response)
// bot._client.writeChannel('ethereum', 'chal:' + response)
// })
// }
// }

// // wallet accept: challenge accepted - can set entity address
// if (msg.slice(0, 5) === 'wack:') {
// const address = msg.slice(5)
// bot.player.entity.ethereum.wallet = address
// bot.player.entity.ethereum.confirmed = true
// bot.player.entity.skin.default = address
// }

// player._client.on('ethereum', (msg) => {
//      serv.info('Player ethereum channel message received:' , msg)
     
//      // This section handles the ethereum address signing challenge/response
//      if (msg.slice(0, 5) === 'chal:') {
//      const prefix = '\x19Ethereum Signed Message:\n' // EIP-191 personal_sign prefix
//      console.log("Challenge is:")
//      console.log(player.ethereum.challenge)
//      const challenge = prefix + player.ethereum.challenge.length + player.ethereum.challenge
//      const response = msg.slice(5)
//      const challengeHash = ethUtils.keccak(Buffer.from(challenge, 'utf-8'))
//      console.log("Challenge hash: ", challengeHash)
//      const { v, r, s } = ethUtils.fromRpcSig(response)
//      const pubKey = ethUtils.ecrecover(ethUtils.toBuffer(challengeHash), v, r, s)
//      const addrBuf = ethUtils.pubToAddress(pubKey)
//      const addr = ethUtils.bufferToHex(addrBuf)
//      if (addr.length === 42) {
//      serv.info('Confirmed ' + player.username + ' controls ' + addr)
//      player.ethereum.wallet = addr
//      player.ethereum.confirmed = true
//      player._client.writeChannel('ethereum', 'wack:' + addr)
//      }
//      }
     
//      function sendChallenge () {
//      // ethereum init msg that kicks off the whole authentication spiel
//      player._client.registerChannel('ethereum', ['string', []], true)
//      const challenge =
//      "*+-.__.-+*+-.__.-+*+-.__.-+*+-.__.-+*+-.__.-+*\n" +
//      " Sign this message to log on\n to the Orthoverse\n" +
//      "*+-.__.-+*+-.__.-+*+-.__.-+*+-.__.-+*+-.__.-+*\n\n" +
//      "By signing this you agree to the terms and conditions at https://orthoverse.io/terms\n" +
//      "Date and time: " + new Date().toLocaleString() + '\n' +
//      'Random number: ' +
//      [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
//      player._client.writeChannel('ethereum', 'chal:' + challenge)
//      player.ethereum.challenge = challenge
//      }