var yourwallet = "";
var mywallet = "";
const convertHexToDecimal = hex => parseInt(hex,16);
const orthoTokenContact = "0x118aed2606d02c2545c6d7d2d1021e567cc08922";
const orthoTokenURI = "https://orthoverse.io/api/metadata/";

orthoverseHomeLand = document.getElementById("orthoverseHomeLand");
orthoverseEnemyLand = document.getElementById("orthoverseEnemyLand");
startBtn = document.getElementById("startBtn");
readyBtn = document.getElementById("readyBtn");
host_wait_guest_ready = document.getElementById("host_wait_guest_ready");// style='display:none' class="">Waiting for Enemy to Engage...</div>
guest_wait_host_ready = document.getElementById("guest_wait_host_ready");// style='display:none' class="">Waiting for Enemy to Start Game...</div>
guest_wait_ready = document.getElementById("guest_wait_ready"); // style='display:none' class="">Press button after all images have loaded...</div>


//var sOrthoverseLandInformation = "*";
//var iOrthoverseCastleLevel = -1;

const _connectStatus = {
     NoMetamask: -1,
     NotConnected: 0,
     WrongChain: 1,
     Connected: 2,
     Authenticated: 3
   };
var connectStatus = _connectStatus.NotConnected;

function hardConnect() {
     ethereum
     .request({ method: "eth_requestAccounts" })
     .then((accounts) => {
     })
     .catch((error) => {
       console.log(error, error.code);
   
     });
   }

   
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
function ShowLand(walletAddress, fHome) {
     console.log("Show Land for wallet " + walletAddress + " home(1/0) " + fHome + " host(1/0) " + host);
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
               console.log("Good: " +result);
               // Using the decodeURIComponent function in combination with regex to convert the hex value into utf8 value
               var sOrthoverseLandInformation = decodeURIComponent(
                    result.substr(130).replace(/\s+/g, "").replace(/[0-9a-f]{2}/g, "%$&")
               ).replace(/\0/g, '');//.trim();
               var sImgURL = sOrthoverseLandInformation.replace("metadata","img").replace(".json",".png").replace("0x","");
               //.replace("-0","-"+iOrthoverseCastleLevel)         //  alert(sImgURL);
               if (fHome) {
                    (host?orthoverseHomeLand:orthoverseEnemyLand).innerHTML = "YOUR LAND:<br><img src='" + sImgURL + "' class='img-fluid' />";
                    (host?orthoverseHomeLand:orthoverseEnemyLand).classList.remove("d-none");
               }
               else {
                    (host?orthoverseEnemyLand:orthoverseHomeLand).innerHTML = "ENEMY LAND:<br><img src='" + sImgURL + "' class='img-fluid' />";
                    (host?orthoverseEnemyLand:orthoverseHomeLand).classList.remove("d-none");
               }
          })
          .catch((error) => {
               // If the request fails, the Promise will reject with an error.
               console.log("eth_call failed: " +error.message);
          });
}



