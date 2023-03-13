function init_and_connect() {
     DC.host(setup);
     //  setup, id=> {
     //   document.querySelector('#divCreateGameOptions h2').innerHTML = 'ID: '+ id
     // });
   
}

createGameButton.onclick = function() {
     MiscUtilities.HideCriticalError();
     MiscUtilities.MetaLog.log("Create Game! :)");
     track_create_game();

     //init_and_connect();
     divCreateGameOptions.style.display='block'
     divHomeActionButtons.style.display='none'
     host=true;
     ShowLand(softAddress(false),true);  
}

startBtn.onclick = function(){
     MiscUtilities.HideCriticalError();
     
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
     MiscUtilities.HideCriticalError();
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
     MiscUtilities.HideCriticalError();
     divJoinBox.style.display='block'
     divHomeActionButtons.style.display='none'
     // conid.value = DC.id ? DC.id:"";
     scpice.focus()
}

function JoinGameClick() {
     track_guest_join();
     DC.joinRoom(setup);
     ShowLand(softAddress(false),true);
     return false
}
joinGameButton2.onclick = function(){
     MiscUtilities.HideCriticalError();
     JoinGameClick();
}

codeBtn.onclick = function(){
     MiscUtilities.HideCriticalError();
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
          // MiscUtilities.MetaLog.log("image url is " + imageUrl);
          // preloaderImg.addEventListener('load', (event) => {
          //      MiscUtilities.MetaLog.log("image loaded");
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

function SetPeerJSLogging() {
     if (MiscUtilities.PeerJSLog.IsEnabled()) {
          PeerInfo.peerconfig.debug = 3;
     } else {
          PeerInfo.peerconfig.debug = 0;
     } 
}

function setPeerServers_basedOnLocationCode() {
     var location = document.getElementById("location").value;
          if (adjustpeerconfig) {
          if (location == 'EU') {
               PeerInfo.peerconfig.config.iceServers[1].urls = PeerInfo.eu_turn_server;
               PeerInfo.peerconfig.config.iceServers[1].username = PeerInfo.peer_username;
               PeerInfo.peerconfig.config.iceServers[1].credential = PeerInfo.peer_password;
               //var eu_turn_server = 'turn:eu-0.turn.peerjs.com:3478?transport=tcp';
               //var na_turn_server = 'turn:us-0.turn.peerjs.com:3478?transport=tcp';
               
          } else if (location == 'NA') {
               PeerInfo.peerconfig.config.iceServers[1].urls = PeerInfo.na_turn_server;
               PeerInfo.peerconfig.config.iceServers[1].username = PeerInfo.peer_username;
               PeerInfo.peerconfig.config.iceServers[1].credential = PeerInfo.peer_password;
          } else if (location == 'CU') {
               PeerInfo.peerconfig.config.iceServers[1].urls = PeerInfo.cuvee_server;
               PopulateCuveeUsernameAndPassword();
               PeerInfo.peerconfig.config.iceServers[1].username = PeerInfo.cuvee_username;
               PeerInfo.peerconfig.config.iceServers[1].credential = PeerInfo.cuvee_password;
          }
     }
     SetPeerJSLogging();
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


// TODO --- resizing window should be a different function, seems like it may reset the game or have other undesired side-effects

var sign_challenge;

window.onload=window.onresize=function(){
     onloadstuff();
     drawItems.scaleFactor=Math.max(1,drawItems.canvasW/(window.innerWidth-16),drawItems.canvasH/(window.innerHeight*0.98))
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
     document.getElementById("scpice").addEventListener("input",()=>{
          if (document.getElementById("scpice").value == "") {
               document.getElementById("joinGameButton2").classList.add("d-none");
               document.getElementById("pasteButton").classList.remove("d-none");
          } else {
               document.getElementById("joinGameButton2").classList.remove("d-none");
               document.getElementById("pasteButton").classList.add("d-none");
          }
     });
     document.getElementById("pasteButton").addEventListener("click",()=>{
          MiscUtilities.HideCriticalError();
          navigator.clipboard.readText().then( (clipText)=>{document.getElementById("scpice").value = clipText});
          JoinGameClick();
     });

     document.getElementById("copyCode").addEventListener("click",()=>{
          MiscUtilities.HideCriticalError();

          var copyText = document.getElementById("scpicehost");

          // Copy the text inside the text field
          navigator.clipboard.writeText(copyText.value);
          document.getElementById("scpicehost").classList.add("elementToFadeInAndOut");
          setTimeout(function(){document.getElementById("scpicehost").classList.remove("elementToFadeInAndOut");}, 200);

     });

     document.getElementById("switchButton").addEventListener("click",()=>{
          MiscUtilities.HideCriticalError();
          switchMainNet();
     });

     document.getElementById("goToOrthoverseButton").addEventListener("click",()=>{
          MiscUtilities.HideCriticalError();
          window.location = "https://orthoverse.io";

     });

     document.getElementById("connectButton").addEventListener("click", ()=>
     {
          MiscUtilities.HideCriticalError();
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
          MiscUtilities.HideCriticalError();
          sign_challenge = prompt("Enter the message for the Enemy to sign.  After clicking OK, wait for a pop-up message to indicate whether the Enemy has passed verification.","Is it really you?");
          
          send({type:"challenge", sign_challenge});
     });

     document.getElementById("challenge2Btn").addEventListener("click", ()=>
     {
          MiscUtilities.HideCriticalError();
          sign_challenge = prompt("Enter the message for the Enemy to sign.  After clicking OK, wait for a pop-up message to indicate whether the Enemy has passed verification.","Is it really you?");
          
          send({type:"challenge", sign_challenge});
     });

     document.getElementById("recordScoreBtn").addEventListener("click", ()=>
     {
          MiscUtilities.HideCriticalError();
          var szAlert = "Recording game score:\n " + awayLandName + " (" + drawItems.scoreRight + ") at " + homeLandName + " (" + drawItems.scoreLeft + ") played at " + game_ended_localized_date_string + "\n\nNOTE: game scores are recorded locally in your browser's storage and may not be permanent.";
          alert(szAlert);

          var game_object = { 'home': homeLandName,
               'away': awayLandName,
               'homeScore': drawItems.scoreLeft,
               'awayScore': drawItems.scoreRight,
               'played': game_ended_localized_date_string 
          };

          // get a fresh copy of saved games
          var saved_games = JSON.parse( MiscUtilities.read_local_storage('string','savedGames','{"games":[]}') );
          saved_games.games.push(game_object);
          MiscUtilities.save_local_storage("savedGames", JSON.stringify(saved_games));

          updatehistorytable();


     });


     document.getElementById("viewHistoryBtn").addEventListener("click", ()=>
     {
     });

     //recordScoreBtn
     //viewHistoryBtn
     updatehistorytable();

     if (MiscUtilities.Sound.IsEnabled())
          initSounds();

}

function updatehistorytable() {
     // from saved_games to gamehistorytable
     document.getElementById("gamehistorytable").textContent = "";
     var saved_games = JSON.parse( MiscUtilities.read_local_storage('string','savedGames','{"games":[]}') );
     for (var i=saved_games.games.length-1; i>=0; i--) {
          // show most current version
          var gameobj = saved_games.games[i];
          if (gameobj != null) {
               // create element that looks like this:
               //                  <tr><th scope="row">1</th><td>Away</td><td>Home</td><td>Date</td></tr>
               var tr = document.createElement("tr");
               var th = document.createElement("th");
               th.setAttribute('scope','row');
               //var td = document.createElement("td");
               th.innerText = (i+1).toString();
               tr.appendChild(th);
               //tr.appendChild(td);
               var td = document.createElement("td");
               td.innerText = gameobj.away + "(" + gameobj.awayScore + ")";
               tr.appendChild(td);
               var td = document.createElement("td");
               td.innerText = gameobj.home + "(" + gameobj.homeScore + ")";
               tr.appendChild(td);
               var td = document.createElement("td");
               td.innerText = gameobj.played;
               tr.appendChild(td);
               document.getElementById("gamehistorytable").appendChild(tr);
          }
     }
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
     PeerInfo.cuvee_username = username;
     PeerInfo.cuvee_password = password;
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
               PeerInfo.peerconfig.config.iceServers[1].urls = PeerInfo.eu_turn_server;
               PeerInfo.peerconfig.config.iceServers[1].username = PeerInfo.peer_username;
               PeerInfo.peerconfig.config.iceServers[1].credential = PeerInfo.peer_password;
              
          } else if (location == 'NA') {
               PeerInfo.peerconfig.config.iceServers[1].urls = PeerInfo.na_turn_server;
               PeerInfo.peerconfig.config.iceServers[1].username = PeerInfo.peer_username;
               PeerInfo.peerconfig.config.iceServers[1].credential = PeerInfo.peer_password;

          } else if (location == 'CU') {
               PeerInfo.peerconfig.config.iceServers[1].urls = PeerInfo.cuvee_server;
               PopulateCuveeUsernameAndPassword();
               PeerInfo.peerconfig.config.iceServers[1].username = PeerInfo.cuvee_username;
               PeerInfo.peerconfig.config.iceServers[1].credential = PeerInfo.cuvee_password;

          }
     }
     SetPeerJSLogging();
}