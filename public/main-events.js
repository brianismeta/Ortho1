function init_and_connect() {
     DC.host(setup);
     //  setup, id=> {
     //   document.querySelector('#divCreateGameOptions h2').innerHTML = 'ID: '+ id
     // });
   
}

createGameButton.onclick = function() {
     MetaLog.log("Create Game! :)");
     track_create_game();

     //init_and_connect();
     divCreateGameOptions.style.display='block'
     divHomeActionButtons.style.display='none'
     host=true;
     ShowLand(softAddress(false),true);  
}

startBtn.onclick = function(){
     //DC.join( parseInt(conid.value), scpice.value, setup );
     //  document.body.style.backgroundImage="";
     track_start_game();
     send({type:"SYN" })
     // startBtn.style.display="none";
     // readyBtn.style.display = 'none';
     host_can_start.classList.add('hiddenMessage');//').style.display='none';
     host_wait_guest_ready.classList.add('hiddenMessage');//.style.display="none";
     guest_wait_host_ready.classList.add('hiddenMessage');//.style.display="none";
     guest_wait_ready.classList.add('hiddenMessage');//.style.display="none";

};
readyBtn.onclick = function(){
     //DC.join( parseInt(conid.value), scpice.value, setup );
     //  document.body.style.backgroundImage="";
     track_guest_ready();
     send({type:"READY" })
     // readyBtn.style.display="none";
     // startBtn.style.display="none";
     host_can_start.classList.add('hiddenMessage');//.style.display='none';
     host_wait_guest_ready.classList.add('hiddenMessage');//.style.display="none";
     guest_wait_host_ready.classList.remove('hiddenMessage');//.style.display="";
     guest_wait_ready.classList.add('hiddenMessage');//.style.display="none";

};        
   
joinGameButton.onclick = function(){
     divJoinBox.style.display='block'
     divHomeActionButtons.style.display='none'
     // conid.value = DC.id ? DC.id:"";
     scpice.focus()
}

joinGameButton2.onclick = function(){
     track_guest_join();
     DC.joinRoom(setup);
     ShowLand(softAddress(false),true);
     return false
}

codeBtn.onclick = function(){
     track_guest_code();

     bkimg.disabled = true;
     difflevel.disabled = true;
     document.getElementById("location").disabled = true;
     document.getElementById("codeBtn").disabled = true;
     //applyLocationToInviteCode();
     setPeerServers_basedOnLocationCode();

     init_and_connect();

     document.getElementById("shareCode").style.display="";
     document.getElementById("divFirstOptions").style.display="none";
     //   divJoinBox.innerHTML='Connecting...'
     return false
   }

   const imgs = [
     "", "", // image zero
     "pexels-rudolf-kirchner-831082.jpg","Photo by Rudolf Kirchner on pexels.com",
     "pexels-miquel-rossello-calafell-3061171.jpg", "Photo by Miquel Rossello Calafell on pexels.com",
     "pexels-pixabay-161913.jpg", "Photo by Pixabay on pexels.com",
     "pexels-elina-sazonova-1876580.jpg", "Photo by Elina Sazonova on pexels.com",
     "pexels-hert-niks-3224113.jpg", "Photo by Hert Niks on pexels.com",
     "pexels-pixabay-208598.jpg", "Photo by Pixabay on pexels.com",
     "pexels-rachel-claire-4819830.jpg","Photo by Rachel Claire on pexels.com",

     "pexels-eberhard-grossgasteiger-2437291.jpg","Photo by Eberhard Grossgasteiger on pexels.com",
     "pexels-francesco-ungaro-464327.jpg","Photo by Francesco Ungaro on pexels.com",
     // "pexels-chait-goli-1796727.jpg","Photo by Chait Goli on pexels.com",
     // "pexels-chris-czermak-2444403.jpg","Photo by Chris Czermak on pexels.com",
     "pexels-iain-2350366.jpg","Photo by Iain on pexels.com",
     "pexels-matt-hardy-2755160.jpg","Photo by Matt Hardy on pexels.com",
     "pexels-krivec-ales-553575.jpg","Photo by Krivec Ales on pexels.com",
     "pexels-todd-trapani-1198817.jpg","Photo by Todd Trapani on pexels.com",
     // "pexels-markus-spiske-127723.jpg", "Photo by Markus Spiske on pexels.com",
];

function getBackgroundImage() {
     var imgid = document.getElementById("bkimg").value;
     return imgid;
}
function setBackgroundImage(imgid) {
     //var imgid = document.getElementById("bkimg").value;
     if (imgid > 0) {
          // preload into img element
          // and then move over to background
          // var imageUrl = imgs[imgid*2];//"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";
          // var bgElement = document.body;
          // var preloaderImg = document.createElement("img");
          // MetaLog.log("image url is " + imageUrl);
          // preloaderImg.addEventListener('load', (event) => {
          //      MetaLog.log("image loaded");
          //      document.body.style.backgroundImage = "url('" + imageUrl + "')";
          //      document.body.style.backgroundSize = "cover";
          //      //preloaderImg = null;
          // });
          // preloaderImg.src = imageUrl;
          // if (preloaderImg.complete) {
          //      preloaderImg.dispatchEvent(new Event("load"));
          // }

          document.body.style.backgroundImage = "url(images/"+imgs[imgid*2]+")";
          document.body.style.backgroundSize = "cover";
     } else {
          document.body.style.backgroundImage = "";
          document.body.style.background = "#131313";
          document.body.style.backgroundSize = "";
     }
     // document.getElementById("photocredit1").innerHTML = imgs[imgid*2+1];
     document.getElementById("photocredit2").innerHTML = imgs[imgid*2+1];
}


   
function onloadstuff() {
     RefreshButtonStatus();




     // test code
     //_promEthereumPersonalSign("test string");




     // if (!softConnect()) {
     //      hardConnect();
     //      //window.setTimeout("onloadstuff()",500);
     //      // alert("Metamask is no longer connected to the Orthoverse!")
     //      // window.location.href = "index.html";
     // } //else 
     //     // ShowLand(softAddress(false),true);

}




function getConnectIDFromInviteCode() {
     var guid = document.getElementById("scpice");
     if (guid.value.substr(2,1) == '-') {
          return guid.value.substr(3);
     } else {
          return guid.value;
     }

}


var adjustpeerconfig = true;


function setPeerServers_basedOnLocationCode() {
     var location = document.getElementById("location").value;
     if (adjustpeerconfig) {
          if (location == 'EU') {
               peerconfig.config.iceServers[1].urls = eu_turn_server;
               peerconfig.config.iceServers[1].username = peer_username;
               peerconfig.config.iceServers[1].credential = peer_password;
               //var eu_turn_server = 'turn:eu-0.turn.peerjs.com:3478?transport=tcp';
               //var na_turn_server = 'turn:us-0.turn.peerjs.com:3478?transport=tcp';
               
          } else if (location == 'NA') {
               peerconfig.config.iceServers[1].urls = na_turn_server;
               peerconfig.config.iceServers[1].username = peer_username;
               peerconfig.config.iceServers[1].credential = peer_password;
          } else if (location == 'CU') {
               peerconfig.config.iceServers[1].urls = cuvee_server;
               PopulateCuveeUsernameAndPassword();
               peerconfig.config.iceServers[1].username = cuvee_username;
               peerconfig.config.iceServers[1].credential = cuvee_password;
          }
     }

}

function applyLocationToInviteCode() {
     var location = document.getElementById("location").value;
     //setBackgroundImage(imgid);
     var guid = document.getElementById("scpicehost");
     if (guid.value.substr(2,1) == '-') {
          guid.value = location + '-' + guid.value.substr(3);
     } else {
          guid.value = location + '-' + guid.value;
     }
}

function xxxapplyLocationToInviteCode() {
     var location = document.getElementById("location").value;
     //setBackgroundImage(imgid);
     var guid = document.getElementById("scpicehost");
     if (guid.value.substr(2,1) == '-') {
          guid.value = location + '-' + guid.value.substr(3);
     } else {
          guid.value = location + '-' + guid.value;
     }
     if (adjustpeerconfig) {
          if (location == 'EU') {
               peerconfig.config.iceServers[1].urls = eu_turn_server;
               peerconfig.config.iceServers[1].username = peer_username;
               peerconfig.config.iceServers[1].credential = peer_password;
               //var eu_turn_server = 'turn:eu-0.turn.peerjs.com:3478?transport=tcp';
               //var na_turn_server = 'turn:us-0.turn.peerjs.com:3478?transport=tcp';
               
          } else if (location == 'NA') {
               peerconfig.config.iceServers[1].urls = na_turn_server;
               peerconfig.config.iceServers[1].username = peer_username;
               peerconfig.config.iceServers[1].credential = peer_password;
          } else if (location == 'CU') {
               peerconfig.config.iceServers[1].urls = cuvee_server;
               PopulateCuveeUsernameAndPassword();
               peerconfig.config.iceServers[1].username = cuvee_username;
               peerconfig.config.iceServers[1].credential = cuvee_password;
          }
          // re-connect (?)
          DC.host(setup);
     }
}

// TODO --- resizing window should be a different function, seems like it may reset the game or have other undesired side-effects

var sign_challenge;

window.onload=window.onresize=function(){
     onloadstuff();
     scaleFactor=Math.max(1,w/(window.innerWidth-16),h/(window.innerHeight*0.98))
     document.getElementById("bkimg").addEventListener("change",()=>{
          //alert("change!");
          if (document.getElementById("bkimg").value != 0 && document.getElementById("bkimg").options[0].value == 0)
               document.getElementById("bkimg").remove(0);

          var imgid = document.getElementById("bkimg").value;
          setBackgroundImage(imgid);
     });
     document.getElementById("location").addEventListener("change",()=>{
          if (document.getElementById("location").value == "CU") {
               document.getElementById("cuveelink").style.display="none";
          } else {
               document.getElementById("cuveelink").style.display="none";
          }
     });
     document.getElementById("scpice").addEventListener("change",()=>{
          //alert("change!");
          applyInviteCodeToPeerConfig();
          
     });

     document.getElementById("copyCode").addEventListener("click",()=>{

          var copyText = document.getElementById("scpicehost");

          // Copy the text inside the text field
          navigator.clipboard.writeText(copyText.value);
          document.getElementById("scpicehost").classList.add("elementToFadeInAndOut");
          setTimeout(function(){document.getElementById("scpicehost").classList.remove("elementToFadeInAndOut");}, 200);

     });

     document.getElementById("switchButton").addEventListener("click",()=>{
          switchMainNet();
     });

     document.getElementById("goToOrthoverseButton").addEventListener("click",()=>{
          window.location = "https://orthoverse.io";

     });

     document.getElementById("connectButton").addEventListener("click", ()=>
     {
          track_click_connect();
 
          if (typeof window.ethereum !== "undefined") {
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

     document.getElementById("challenge1Btn").addEventListener("click", ()=>
     {
          sign_challenge = prompt("Enter the message for the Enemy to sign.  After clicking OK, wait for a pop-up message to indicate whether the Enemy has passed verification.","Is it really you?");
          
          send({type:"challenge", sign_challenge});
     });

     document.getElementById("challenge2Btn").addEventListener("click", ()=>
     {
          sign_challenge = prompt("Enter the message for the Enemy to sign.  After clicking OK, wait for a pop-up message to indicate whether the Enemy has passed verification.","Is it really you?");
          
          send({type:"challenge", sign_challenge});
     });


}



function calcHMAC( sInput, sKey ) {
     try {
          var hmacText = sInput;
          var hmacTextType = "TEXT";
          var hmacKeyInput = sKey;
          var hmacKeyInputType = "TEXT";
          var hmacVariant = "SHA-1";
          var hmacOutputType = "B64";
          //var hmacOutput = document.getElementById("hmacOutputText");
          var hmacObj = new jsSHA(
               hmacVariant,
               hmacTextType
          );
          hmacObj.setHMACKey(
               hmacKeyInput,
               hmacKeyInputType
          );
          hmacObj.update(hmacText);

          return hmacObj.getHMAC(hmacOutputType);
     } catch(e) {
          return null;
     }
}

function PopulateCuveeUsernameAndPassword() {
     var username = (parseInt(Date.now()/1000) + 60*60*24) + ":paddleofdoom";
     var password = calcHMAC(username,"4fa4e982a4b2906b8b5e7be323c6b039014e840bcdc265c12771cd598961eef5");
     MetaLog.log(username);
     MetaLog.log(password);
     cuvee_username = username;
     cuvee_password = password;

     MetaLog.log("username: " + username);
     MetaLog.log("password: " + password);

}
function applyInviteCodeToPeerConfig() {
     if (adjustpeerconfig) {
          var guid = document.getElementById("scpice");
          var location;
          if (guid.value.substr(2,1) == '-') {
               location  = guid.value.substr(0,2);
          } else {
               location = 'US';
          }
          if (location == 'EU') {
               peerconfig.config.iceServers[1].urls = eu_turn_server;
               peerconfig.config.iceServers[1].username = peer_username;
               peerconfig.config.iceServers[1].credential = peer_password;
              
          } else if (location == 'NA') {
               peerconfig.config.iceServers[1].urls = na_turn_server;
               peerconfig.config.iceServers[1].username = peer_username;
               peerconfig.config.iceServers[1].credential = peer_password;

          } else if (location == 'CU') {
               peerconfig.config.iceServers[1].urls = cuvee_server;
               PopulateCuveeUsernameAndPassword();
               peerconfig.config.iceServers[1].username = cuvee_username;
               peerconfig.config.iceServers[1].credential = cuvee_password;

          }
     }
}