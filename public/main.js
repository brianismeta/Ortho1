const connectButton = document.getElementById("connectButton");
const switchButton = document.getElementById("switchButton");
const playButton = document.getElementById("playButton");
const orthoButton = document.getElementById("orthoButton");
const walletID = document.getElementById("walletID");
const orthoverseStatus = document.getElementById("orthoverseStatus");
const reloadButton = document.getElementById("reloadButton");
const installAlert = document.getElementById("installAlert");
const orthoverseland = document.getElementById("orthoverseland");
const mobileDeviceWarning = document.getElementById("mobileDeviceWarning");
const showland = document.getElementById("showland");
// const bkimg = document.getElementById("bkimg");

var sOrthoverseLandInformation = "*";
var iOrthoverseCastleLevel = -1;

const convertHexToDecimal = hex => parseInt(hex,16);

const orthoTokenContact = "0x118aed2606d02c2545c6d7d2d1021e567cc08922";
const orthoTokenURI = "https://orthoverse.io/api/metadata/";

const _connectStatus = {
  NoMetamask: -1,
  NotConnected: 0,
  WrongChain: 1,
  Connected: 2,
  Authenticated: 3
};
var connectStatus = _connectStatus.NotConnected;

// don't call without being connected, and to the right chain
// in this way the call can continue without Metamask prompt
function getOrthoverseLandInformation(index) {
  var orthoverseJSON = "";
  var zero24 = "000000000000000000000000";
  var params = [
    {
      //from: softAddress(),
      to: orthoTokenContact,
      //'4-byte function hash followed by address',
      data: "0x0e89341c" + zero24 + softAddress(false),
      //"gas":"0x5f5e100", "gasprice":"0x3b9aca00", "value":"0x0"
      // id: 1
    }
    //,"latest"
  ];
  
  ethereum
    .request({
      method: 'eth_call',
      params,
      id: '1'
    })
    .then((result) => {
      // Good result returns null in this case
      console.log("Good: " +result);

      // Using the decodeURIComponent function in combination with regex to convert the hex value into utf8 value
      sOrthoverseLandInformation = decodeURIComponent(
        result.substr(130).replace(/\s+/g, "").replace(/[0-9a-f]{2}/g, "%$&")
      ).replace(/\0/g, '');//.trim();
        //var xy = symbol.replace(/\0/g, '') ;
      // The result varies by RPC method.
      // For example, this method will return a transaction hash hexadecimal string on success.
//      RefreshButtonStatus();
      //alert("ORTHO JSON: " + orthoverseJSON);
      connectStatus = _connectStatus.Authenticated;
      RevealOrthoverseLand();
      //return orthoverseJSON;
})
    .catch((error) => {
      // If the request fails, the Promise will reject with an error.
      console.log("eth_call failed: " +error.message);
      orthoverseStatus.innerHTML = 'No Orthoverse land detected.  Reveal your land at <a href="https://orthoverse.io">orthoverse.io</a>';
      //return null;
    });


//'{"jsonrpc":"2.0", "method":"eth_call", "params":[{"from": "eth.accounts[0]", "to": "0x65da172d668fbaeb1f60e206204c2327400665fd", "data": "0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000005"}], "id":1}'


  // var responseObj;
  // var xmlhttp = new XMLHttpRequest();
  // xmlhttp.onreadystatechange = function() {
  //   if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
  //       responseObj = JSON.parse(xmlhttp.responseText);
  //       //document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
  //   }
  // }
  // xmlhttp.open("GET", orthoTokenURI + softAddress() +"-"+index+".json", true);
  // xmlhttp.send();
  
  //return orthoverseJSON;

}

function getOrthoverseCastleLevel(index) {
  var orthoverseCastleLevel = "";
  var zero24 = "000000000000000000000000";
  var params = [
    {
      //from: softAddress(),
      to: orthoTokenContact,
      //'4-byte function hash followed by address',
      data: "0xc08db79d" + zero24 + softAddress(false),
      //"gas":"0x5f5e100", "gasprice":"0x3b9aca00", "value":"0x0"
      // id: 1
    }
    //,"latest"
  ];
  
  ethereum
    .request({
      method: 'eth_call',
      params,
      id: '1'
    })
    .then((result) => {
      // Good result returns null in this case
      console.log("Good: " +result);

      // Using the decodeURIComponent function in combination with regex to convert the hex value into utf8 value
      iOrthoverseCastleLevel = convertHexToDecimal(result.substr(2));
      //return orthoverseCastleLevel;
      // decodeURIComponent(
      //   result.substr(130).replace(/\s+/g, "").replace(/[0-9a-f]{2}/g, "%$&")
      // ).replace(/\0/g, '');//.trim();
        //var xy = symbol.replace(/\0/g, '') ;
      // The result varies by RPC method.
      // For example, this method will return a transaction hash hexadecimal string on success.
//      RefreshButtonStatus();
      //alert("Castle Level: " + orthoverseCastleLevel);
})
    .catch((error) => {
      // If the request fails, the Promise will reject with an error.
      //return orthoverseCastleLevel;
      console.log("eth_call failed: " +error.message);
    });


//'{"jsonrpc":"2.0", "method":"eth_call", "params":[{"from": "eth.accounts[0]", "to": "0x65da172d668fbaeb1f60e206204c2327400665fd", "data": "0x6ffa1caa0000000000000000000000000000000000000000000000000000000000000005"}], "id":1}'


  // var responseObj;
  // var xmlhttp = new XMLHttpRequest();
  // xmlhttp.onreadystatechange = function() {
  //   if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
  //       responseObj = JSON.parse(xmlhttp.responseText);
  //       //document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
  //   }
  // }
  // xmlhttp.open("GET", orthoTokenURI + softAddress() +"-"+index+".json", true);
  // xmlhttp.send();
  //return orthoverseCastleLevel;

}
// const startLoading = () => {
//   connectButton.classList.add("loadingButton");
// };

// const stopLoading = () => {
//   const timeout = setTimeout(() => {
//     connectButton.classList.remove("loadingButton");
//     clearTimeout(timeout);
//   }, 300);
// };

const isMobile = () => {
  let check = false;

  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);

  return check;
};

// reloadButton.addEventListener("click", () => {
//   window.location.reload();
// });

function softConnect() {
     if (typeof ethereum != 'undefined') {
          if (ethereum.isConnected() && (ethereum.selectedAddress != null)) {
          if (ethereum.chainId == 0x01) {
               connectStatus = _connectStatus.Connected;
               //var level= getOrthoverseCastleLevel(0);
          
               return true;
          } else {
               connectStatus = _connectStatus.WrongChain;
          }
          } else {
          connectStatus = _connectStatus.NotConnected;
          }
     } else {
          connectStatus = _connectStatus.NoMetamask;
     }
     return false;
}
function softAddress(fInclude0x = true) {
  if (ethereum.isConnected() && (ethereum.selectedAddress != null)) {
    return ethereum.selectedAddress.substr(fInclude0x?0:2);
  }
  else
    return "Not Connected";

}
// function softMainNet() {
//   if (ethereum.isConnected() && (ethereum.selectedAddress != null)
//   && (ethereum.chainId == 0x01)) {
//     connectStatus = _connectStatus.Connected;
//     return true;
//   }
// }
function hardConnect() {
  ethereum
  .request({ method: "eth_requestAccounts" })
  .then((accounts) => {
    //const account = accounts[0];

    //walletID.innerHTML = `Wallet connected: <span>${account}</span>`;

    //connectStatus = _connectStatus.Connected;

    //stopLoading();
//    RefreshButtonStatus();
// now check for Orthoverse land
//if (sOrthoverseLandInformation = "")

    // sOrthoverseLandInformation = getOrthoverseLandInformation(0);
    // iOrthoverseCastleLevel = getOrthoverseCastleLevel(0);

  })
  .catch((error) => {
    console.log(error, error.code);

    //alert(error.code);
    //stopLoading();
  });
}
function switchMainNet() {
  var params = [
    {
      chainId: '0x1'
    },
  ];
  
  ethereum
    .request({
      method: 'wallet_switchEthereumChain',
      params,
    })
    .then((result) => {
      // Good result returns null in this case
      //console.log("Good: " +result);
      // The result varies by RPC method.
      // For example, this method will return a transaction hash hexadecimal string on success.
//      RefreshButtonStatus();
    })
    .catch((error) => {
      // If the request fails, the Promise will reject with an error.
      console.log("wallet_switchEthereumChain failed: " +error.message);
    });
}

// do not use... note that ORTH is NOT an ERC-20 token,
// ORTH is an ERC1155 token, and adding the token to Metamask
// doesn't add much value.  Would be better just to provide
// links to Etherscan.io to see the contract.
function AddOrthoTokenToWallet() {
  ethereum
  .request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20', // ERC1155 is not supported by MetaMask
      options: {
        address: '0x118aeD2606D02C2545C6D7D2d1021e567cc08922',
        symbol: 'ORTH',
        decimals: 18, // probably not 18.
        image: 'http://www.chainfrog.com/wp-content/uploads/2016/08/profile2.jpg',
        // not the right image for the token
      },
    },
  })
  .then((success) => {
    if (success) {
      console.log('ORTH successfully added to wallet!');
    } else {
      throw new Error('Something went wrong.');
    }
  })
  .catch((error) => {
    // If the request fails, the Promise will reject with an error.
    console.log("wallet_watchAsset failed: " +error.message);
  });
}
function getOrthoUri() {
  var params = [
    {
      tokenId: softAddress()
    },
  ];
  
  ethereum
    .request({
      method: 'wallet_switchEthereumChain',
      params,
    })
    .then((result) => {
      // Good result returns null in this case
      //console.log("Good: " +result);
      // The result varies by RPC method.
      // For example, this method will return a transaction hash hexadecimal string on success.
//      RefreshButtonStatus();
    })
    .catch((error) => {
      // If the request fails, the Promise will reject with an error.
      console.log("wallet_switchEthereumChain failed: " +error.message);
    });
}

function RefreshButtonStatus() {
  if (connectStatus != _connectStatus.Authenticated)
    softConnect(); // update connected status
  if (connectStatus == _connectStatus.Connected) {
    // //connectButton.click();
    // if (softMainNet() ) {
    if (walletID) walletID.innerHTML = 'Wallet connected!'; //: <span>' + softAddress() + '</span>';
    if (walletID) walletID.classList.remove("d-none");//.style.display="";
    if (switchButton) switchButton.classList.add("d-none");
    if (connectButton) connectButton.classList.add("d-none");
    if (revealButton) revealButton.classList.remove("d-none");
  } else if (connectStatus == _connectStatus.WrongChain) {
    if(walletID) walletID.innerHTML = `Please switch your network to Ethereum MainNet to continue`;
    if(walletID) walletID.classList.remove("d-none");//.style.display="";
    if(switchButton) switchButton.classList.remove("d-none");
    if (connectButton) connectButton.classList.add("d-none");
    if (revealButton) revealButton.classList.add("d-none");
  } 
  else if (connectStatus == _connectStatus.NotConnected) {
    if (walletID) walletID.innerHTML = 'Not Connected';
    if (walletID) walletID.classList.remove("d-none");//.style.display="";
    if (switchButton) switchButton.classList.add("d-none");
    if (connectButton) connectButton.classList.remove("d-none");
    if (revealButton) revealButton.classList.add("d-none");
  } else if (connectStatus == _connectStatus.Authenticated) {
    if (walletID) walletID.innerHTML = 'Welcome fellow Orthoversian - you are connected with Wallet: <span>' + softAddress() + '</span>';
    if (walletID) walletID.classList.remove("d-none");//.style.display="";
    if (switchButton) switchButton.classList.add("d-none");
    if (connectButton) connectButton.classList.add("d-none");
    if (revealButton) revealButton.classList.add("d-none");
  } else if (connectStatus == _connectStatus.NoMetamask) {
     if (walletID) walletID.innerHTML = 'No MetaMask detected! Please refresh your browser after installing the MetaMask plugin';
     if (walletID) walletID.classList.remove("d-none");//.style.display="";
     if (switchButton) switchButton.classList.add("d-none");
     if (connectButton) connectButton.classList.add("d-none");
     if (revealButton) revealButton.classList.add("d-none");
 
  }
}

// why is this here?  because the browser built-in variables
// such as ethereum.selectedAddress and ethereum.chainId
// are not updated instantly
// upon the successful return of a wallet call, hence
// need to monitor these.  Also it helps to keep an eye on it
// because you could change the account or chain independently of our calls
// just by opening Ethereum extension and switching accounts and chains
// without the page knowing about it. 

window.setInterval(RefreshButtonStatus,200);

//$(document).ready(function () {
//  jQuery(document).ready(function($){
window.addEventListener("load", ()=> 
  {
//    RefreshButtonStatus();

     // if (bkimg) bkimg.addEventListener("change", ()=> {
     //      alert("change!");
     // });
  if(connectButton)  connectButton.addEventListener("click", ()=>
    {
     gtag('event', 'click_connect', {
          'event_category': 'pong_main'
        });

      if (typeof window.ethereum !== "undefined") {
        //startLoading();
        hardConnect();
      } else {
        if (isMobile()) {
          mobileDeviceWarning.classList.add("show");
        } else {
          window.open("https://metamask.io/download/", "_blank");
          installAlert.classList.add("show");
        }
      }
    });
  if(switchButton) switchButton.addEventListener("click", ()=> 
  {
     gtag('event', 'click_switchchain', {
          'event_category': 'pong_main'
        });
         switchMainNet(); 
    
  }
  );
  if(revealButton) revealButton.addEventListener("click", ()=> 
  {
    getOrthoverseCastleLevel(0);
    getOrthoverseLandInformation(0);

  //   if (sOrthoverseLandInformation == null ||
  //     iOrthoverseCastleLevel == null) {
  //       orthoverseStatus.innerHTML = 'No Orthoverse land detected.  Reveal your land at <a href="https://orthoverse.io">orthoverse.io</a>';
  //     }
  // }
  });
    
  if (playButton) playButton.addEventListener("click",() => {
    //alert("Not implemented!");
    gtag('event', 'click_play', {
     'event_category': 'pong_main'
   });
       location.href = "orthopong.html";
  });
    if (orthoButton) orthoButton.addEventListener("click", ()=> {
//    AddOrthoTokenToWallet();
    // var json = getOrthoverseLandInformation(0);
    // var level= getOrthoverseCastleLevel(0);
// Note that above are async, so may not be finished yet
    //alert(json);
//alert(level);

  });

  });

function RevealOrthoverseLand() {
//  alert(sOrthoverseLandInformation);
  var sImgURL = sOrthoverseLandInformation.replace("metadata","img").replace("-0","-"+iOrthoverseCastleLevel).replace(".json",".png").replace("0x","");
//  alert(sImgURL);
  orthoverseland.innerHTML = "<img src='" + sImgURL + "' class='img-fluid' />";

  showland.classList.remove("d-none");

}
//$(connectButton).click(switchMainNet);
// switchButton.addEventListener("click",() => {
//   switchMainNet();
// });

