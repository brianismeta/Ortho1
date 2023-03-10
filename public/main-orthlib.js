//const { connect } = require("http2");

var yourwallet = "";
var mywallet = "";
const convertHexToDecimal = hex => parseInt(hex,16);
const orthoTokenContact = "0x118aed2606d02c2545c6d7d2d1021e567cc08922";
const orthoTokenURI = "https://orthoverse.io/api/metadata/";

const orthoAPILandSearchURI = "https://orthoverse.io/api/land/search/"; // add the 0x address

orthoverseHomeLand = document.getElementById("orthoverseHomeLand");
orthoverseEnemyLand = document.getElementById("orthoverseEnemyLand");
startBtn = document.getElementById("startBtn");
readyBtn = document.getElementById("readyBtn");
host_wait_guest_ready = document.getElementById("host_wait_guest_ready");// style='display:none' class="">Waiting for Enemy to Engage...</div>
guest_wait_host_ready = document.getElementById("guest_wait_host_ready");// style='display:none' class="">Waiting for Enemy to Start Game...</div>
guest_wait_ready = document.getElementById("guest_wait_ready"); // style='display:none' class="">Press button after all images have loaded...</div>

errorNoMetaMask = document.getElementById("errorNoMetaMask");
connectButton = document.getElementById("connectButton");
switchButton = document.getElementById("switchButton");
errorNoOrthoverseLand = document.getElementById("errorNoOrthoverseLand");
goToOrthoverseButton = document.getElementById("goToOrthoverseButton");
createGameButton = document.getElementById("createGameButton");
joinGameButton  = document.getElementById("joinGameButton");

//var sOrthoverseLandInformation = "*";
//var iOrthoverseCastleLevel = -1;

const _connectStatus = {
     NoMetamask: -1,
     NotConnected: 0,
     WrongChain: 1,
     NoLand: 2,
     Authenticated: 3,
     Connecting: 4
   };
var connectStatus = _connectStatus.NotConnected;

// function hardConnect() {
//      ethereum
//      .request({ method: "eth_requestAccounts" })
//      .then((accounts) => {
//      })
//      .catch((error) => {
//        MiscUtilities.MetaLog.log(error, error.code);
   
//      });
//    }

   
async function softConnect() {
     if (typeof ethereum != 'undefined') {
          if (ethereum.isConnected() && (ethereum.selectedAddress != null)) {
          if (ethereum.chainId == 0x01) {
               // check if land exists!
               connectStatus = _connectStatus.Connecting;
               //var level= getOrthoverseCastleLevel(0);
               var land = await GetLandAPI(softAddress(true));
               if (land != null && land != -1)
                    connectStatus = _connectStatus.Authenticated;
               else
                    connectStatus = _connectStatus.NoLand;
               RefreshButtonStatus();
               //LandExists();
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


// ANY address will show information from the smart contract... may not be revealed through.

var homeLandName = "";
var awayLandName = "";
function ShowLand(walletAddress, fHome) {
     //MiscUtilities.MetaLog.log("Show Land for wallet " + walletAddress + " home(1/0) " + fHome + " host(1/0) " + host);
     _promEthereumGetLandURIFromContract(walletAddress)
     .then(async function (OrthURI) {
          var sImgURL = OrthURI.replace("metadata","img").replace(".json",".png").replace("0x","");
          if (fHome) {
               var landname = await GetLandAPI("0x"+walletAddress);
               if (landname == null) landname = ""; else landname = JSON.parse(landname).name;
               (host?orthoverseHomeLand:orthoverseEnemyLand).innerHTML = "YOUR LAND:<br><img src='" + sImgURL + "' class='img-fluid' /><br>" + landname;
               (host?orthoverseHomeLand:orthoverseEnemyLand).classList.remove("d-none");
               homeLandName = landname;
          }
          else {
               var landname = await GetLandAPI("0x"+walletAddress);
               if (landname == null) landname = ""; else landname = JSON.parse(landname).name;
               (host?orthoverseEnemyLand:orthoverseHomeLand).innerHTML = "ENEMY LAND:<br><img src='" + sImgURL + "' class='img-fluid' /><br>" + landname;
               (host?orthoverseEnemyLand:orthoverseHomeLand).classList.remove("d-none");
               awayLandName = landname;
          }
          return true;
     })
     .catch(function () { // no info returned on error
          return false;
     });

     return false;
}

// function ShowLand(walletAddress, fHome) {
//      MiscUtilities.MetaLog.log("Show Land for wallet " + walletAddress + " home(1/0) " + fHome + " host(1/0) " + host);
//      var orthoverseJSON = "";
//      var zero24 = "000000000000000000000000";
//      var params = [
//           {
//           //from: softAddress(),
//           to: orthoTokenContact,
//           //'4-byte function hash followed by address',
//           data: "0x0e89341c" + zero24 + walletAddress,
//           }
//      ];
//      ethereum
//           .request({
//           method: 'eth_call',
//           params,
//           id: '1'
//           })
//           .then((result) => {
//                // Good result returns null in this case
//                MiscUtilities.MetaLog.log("Good: " +result);
//                // Using the decodeURIComponent function in combination with regex to convert the hex value into utf8 value
//                var sOrthoverseLandInformation = decodeURIComponent(
//                     result.substr(130).replace(/\s+/g, "").replace(/[0-9a-f]{2}/g, "%$&")
//                ).replace(/\0/g, '');//.trim();
//                var sImgURL = sOrthoverseLandInformation.replace("metadata","img").replace(".json",".png").replace("0x","");
//                //.replace("-0","-"+iOrthoverseCastleLevel)         //  alert(sImgURL);
//                if (fHome) {
//                     GetLandName("0x"+walletAddress,(result)=>
//                          {
//                               var landname = "";
//                               if (result.name) landname=result.name;
//                               (host?orthoverseHomeLand:orthoverseEnemyLand).innerHTML = "YOUR LAND:<br><img src='" + sImgURL + "' class='img-fluid' /><br>" + landname;
//                               (host?orthoverseHomeLand:orthoverseEnemyLand).classList.remove("d-none");
          
//                          });

//                }
//                else {
//                     GetLandName("0x"+walletAddress,(result)=>
//                          {
//                               var landname = "";
//                               if (result.name) landname=result.name;
//                               (host?orthoverseEnemyLand:orthoverseHomeLand).innerHTML = "ENEMY LAND:<br><img src='" + sImgURL + "' class='img-fluid' /><br>" + landname;
//                               (host?orthoverseEnemyLand:orthoverseHomeLand).classList.remove("d-none");
//                          });
//                }
//           })
//           .catch((error) => {
//                // If the request fails, the Promise will reject with an error.
//                MiscUtilities.MetaLog.log("eth_call failed: " +error.message);
//           });
// }

// function LandExists() {
//      MiscUtilities.MetaLog.log("Check if wallet " + softAddress() + " has Orthoverse land" );
//      var orthoverseJSON = "";
//      var zero24 = "000000000000000000000000";
//      var params = [
//           {
//           //from: softAddress(),
//           to: orthoTokenContact,
//           //'4-byte function hash followed by address',
//           data: "0x0e89341c" + zero24 + softAddress(false),
//           }
//      ];
//      ethereum
//           .request({
//           method: 'eth_call',
//           params,
//           id: '1'
//           })
//           .then((result) => {
//                // Good result returns null in this case
//                MiscUtilities.MetaLog.log("Land exists: " +result);
//                connectStatus = _connectStatus.Authenticated; 
//           })
//           .catch((error) => {
//                // If the request fails, the Promise will reject with an error.
//                MiscUtilities.MetaLog.log("eth_call failed: " +error.message);
//                connectStatus = _connectStatus.NoLand; 
//           });
// }

// function GetLandName(address0x, callbackfn) {
//   var responseObj;
//   var xmlhttp = new XMLHttpRequest();
//   xmlhttp.onreadystatechange = function() {
//     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//         responseObj = JSON.parse(xmlhttp.responseText);
//         callbackfn(responseObj);
//         //document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
//     }
//   }
//   xmlhttp.open("GET", orthoAPILandSearchURI + address0x, true);
//   xmlhttp.send();

// }

// http get in a promise
function _promMakeHTTPRequest (method, url) {
     return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open(method, url);
          xhr.onload = function () {
               if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
               } else {
                    reject({
                         status: xhr.status,
                         statusText: xhr.statusText
                    });
               }
          };
          xhr.onerror = function () {
               reject({
                    status: xhr.status,
                    statusText: xhr.statusText
               });
          };
          xhr.send();
     });
}

// hard connect in a promise
function _promEthereumRequestAccounts() {
     return new Promise(function (resolve, reject) {
          ethereum.request({ method: "eth_requestAccounts" })
          .then((accounts) => {
               resolve();
          })
          .catch((error) => {
               MetaLog.error(error, error.code);
               reject();
          });
     });
}
function hardConnect() {
     _promEthereumRequestAccounts().then(()=>{}).catch(()=>{});
}

function switchMainNet() {
     _promEthereumSwitchMainNet().then(()=>{RefreshButtonStatus()}).catch();
}
function _promEthereumSwitchMainNet() {
     return new Promise(function (resolve, reject) {
          var params = [
          {
               chainId: '0x1'
          },
          ];
     
          ethereum.request({
               method: 'wallet_switchEthereumChain',
               params,
          }).then((result) => {
               MiscUtilities.MetaLog.log("Switched to Ethereum MainNet");
               resolve();
          }).catch((error) => {
               // If the request fails, the Promise will reject with an error.
               MiscUtilities.MetaLog.log("wallet_switchEthereumChain failed: " +error.message);
               reject();
          });
     });
}


// Do not use the contract unless necessary
// Will return land information even if the user has no tokens!
function _promEthereumGetLandURIFromContract(walletAddress) {
     return new Promise(function (resolve, reject) {
          //MiscUtilities.MetaLog.log("Show Land for wallet " + walletAddress );
          var orthoverseJSON = "";
          var zero24 = "000000000000000000000000";
          var params = [
               {
               //from: softAddress(),
               to: orthoTokenContact,
               //'4-byte function hash followed by address',
               data: "0x0e89341c" + zero24 + walletAddress,
               }
          ];
          ethereum
          .request({
               method: 'eth_call',
               params,
               id: '1'
          })
          .then((result) => {
               // Good result returns null in this case
               //MiscUtilities.MetaLog.log("Good: " +result);
               // Using the decodeURIComponent function in combination with regex to convert the hex value into utf8 value
               var sOrthoverseLandInformation = decodeURIComponent(
                    result.substr(130).replace(/\s+/g, "").replace(/[0-9a-f]{2}/g, "%$&")
               ).replace(/\0/g, '');//.trim();

               resolve(sOrthoverseLandInformation);     

          })
          .catch((error) => {
               // If the request fails, the Promise will reject with an error.
               MetaLog.error("eth_call failed: " +error.message);
               reject();
          });
     });
}



// callback function must take a boolean whether succeed (true) or failed (false)
// 'succeed' doesn't mean the land exists, just that the HTTP call succeeded.

async function GetLandAPI(address0x) {

     var result = -1;
     await _promMakeHTTPRequest('GET', orthoAPILandSearchURI + address0x)
     .then(function (datums) {
          result = datums;
          //return(datums);
     })
     .catch(function (err) {
          MetaLog.error('Error retrieving Land API', err.statusText);
          result = null;
          //return null;
     });

     return result;
}
     // var responseObj;
     // var xmlhttp = new XMLHttpRequest();

     // xmlhttp.onload = () => {
     //      responseObj = JSON.parse(xmlhttp.responseText);
     //      callbackfn(responseObj);
     // }
     // // xmlhttp.onreadystatechange = function() {
     // //   if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
     // //       responseObj = JSON.parse(xmlhttp.responseText);
     // //       callbackfn(responseObj);
     // //       //document.getElementById("myDiv").innerHTML = xmlhttp.responseText;
     // //   }
     // // }
     // xmlhttp.open("GET", orthoAPILandSearchURI + address0x, true);
     // xmlhttp.send();



// function switchMainNet() {
//      var params = [
//           {
//                chainId: '0x1'
//           },
//      ];
     
//      ethereum.request({
//           method: 'wallet_switchEthereumChain',
//           params,
//      }).then((result) => {
//           MiscUtilities.MetaLog.log("Switched to Ethereum MainNet");
//      }).catch((error) => {
//           // If the request fails, the Promise will reject with an error.
//           MiscUtilities.MetaLog.log("wallet_switchEthereumChain failed: " +error.message);
//      });
// }
   
function RefreshButtonStatus() {
     var check_soon = false;

     MiscUtilities.MetaLog.log("Start button status updates")

     if (connectStatus != _connectStatus.Authenticated && connectStatus != _connectStatus.Connecting && connectStatus != _connectStatus.NoLand) {
               MiscUtilities.MetaLog.log("Do a soft connect since status is " + connectStatus);
               softConnect(); // update connected status
     }

     if (connectStatus == _connectStatus.NoMetamask) {
          errorNoMetaMask.classList.remove("d-none");
          connectButton.classList.add("d-none");
          switchButton.classList.add("d-none");
          errorNoOrthoverseLand.classList.add("d-none");
          goToOrthoverseButton.classList.add("d-none");
          createGameButton.classList.add("d-none");
          joinGameButton.classList.add("d-none");
     } else if (connectStatus == _connectStatus.NotConnected) {
          errorNoMetaMask.classList.add("d-none");
          connectButton.classList.remove("d-none");
          switchButton.classList.add("d-none");
          errorNoOrthoverseLand.classList.add("d-none");
          goToOrthoverseButton.classList.add("d-none");
          createGameButton.classList.add("d-none");
          joinGameButton.classList.add("d-none");
          check_soon = true;
     } else if (connectStatus == _connectStatus.WrongChain) {
          errorNoMetaMask.classList.add("d-none");
          connectButton.classList.add("d-none");
          switchButton.classList.remove("d-none");
          errorNoOrthoverseLand.classList.add("d-none");
          goToOrthoverseButton.classList.add("d-none");
          createGameButton.classList.add("d-none");
          joinGameButton.classList.add("d-none");
          check_soon = true;
     } else if (connectStatus == _connectStatus.NoLand) {
          errorNoMetaMask.classList.add("d-none");
          connectButton.classList.add("d-none");
          switchButton.classList.add("d-none");
          errorNoOrthoverseLand.classList.remove("d-none");
          goToOrthoverseButton.classList.remove("d-none");
          createGameButton.classList.add("d-none");
          joinGameButton.classList.add("d-none");
     } else if (connectStatus == _connectStatus.Authenticated) {
          errorNoMetaMask.classList.add("d-none");
          connectButton.classList.add("d-none");
          switchButton.classList.add("d-none");
          errorNoOrthoverseLand.classList.add("d-none");
          goToOrthoverseButton.classList.add("d-none");
          createGameButton.classList.remove("d-none");
          joinGameButton.classList.remove("d-none");
     } else if (connectStatus == _connectStatus.Connecting) {
          errorNoMetaMask.classList.add("d-none");
          connectButton.classList.add("d-none");
          switchButton.classList.add("d-none");
          errorNoOrthoverseLand.classList.add("d-none");
          goToOrthoverseButton.classList.add("d-none");
          createGameButton.classList.add("d-none");
          joinGameButton.classList.add("d-none");
          check_soon = true;
          
     }

     if (check_soon) {
          MiscUtilities.MetaLog.log("Setting timeout for 3 seconds to update button status")
          window.setTimeout(RefreshButtonStatus,3000);
     } else {
          MiscUtilities.MetaLog.log("Button status updates will not refresh")
     }

}