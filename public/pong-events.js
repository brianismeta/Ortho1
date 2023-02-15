function init_and_connect() {
     DC.host(setup);
     //  setup, id=> {
     //   document.querySelector('#divCreateGameOptions h2').innerHTML = 'ID: '+ id
     // });
   
}

createBtn.onclick = function() {
     gtag('event', 'host_click_creategame', {
          'event_category': 'pong_game'
        });

//init_and_connect();
divCreateGameOptions.style.display='block'
divHomeActionButtons.style.display='none'
host=true;
ShowLand(softAddress(false),true);  
}

startBtn.onclick = function(){
     //DC.join( parseInt(conid.value), scpice.value, setup );
     //  document.body.style.backgroundImage="";
     gtag('event', 'host_click_startgame', {
          'event_category': 'pong_game'
     });
     send({type:"SYN" })
     startBtn.style.display="none";
     readyBtn.style.display = 'none';
     host_wait_guest_ready.style.display="none";
     host_wait_guest_ready.style.display="none";
     guest_wait_host_ready.style.display="none";
     guest_wait_ready.style.display="none";

};
readyBtn.onclick = function(){
     //DC.join( parseInt(conid.value), scpice.value, setup );
     //  document.body.style.backgroundImage="";
     gtag('event', 'guest_click_readygame', {
          'event_category': 'pong_game'
     });
     send({type:"READY" })
     readyBtn.style.display="none";
     startBtn.style.display="none";
     host_wait_guest_ready.style.display="none";
     host_wait_guest_ready.style.display="none";
     guest_wait_host_ready.style.display="";
     guest_wait_ready.style.display="none";

};        
   
      joinBtn1.onclick = function(){
  divJoinBox.style.display='block'
  divHomeActionButtons.style.display='none'
  // conid.value = DC.id ? DC.id:"";
  scpice.focus()
}
joinBtn2.onclick = function(){
  //DC.join( parseInt(conid.value), scpice.value, setup );
//  document.body.style.backgroundImage="";
gtag('event', 'guest_click_joingame', {
     'event_category': 'pong_game'
   });
DC.joinRoom(setup);

  ShowLand(softAddress(false),true);
  
//   divJoinBox.innerHTML='Connecting...'
  return false
}

codeBtn.onclick = function(){
     //DC.join( parseInt(conid.value), scpice.value, setup );
   //  document.body.style.backgroundImage="";
   gtag('event', 'guest_click_getcode', {
        'event_category': 'pong_game'
      });

bkimg.disabled = true;
difflevel.disabled = true;
document.getElementById("location").disabled = true;

//applyLocationToInviteCode();
setPeerServers_basedOnLocationCode();

      init_and_connect();

      document.getElementById("shareCode").style.display="";
   //   divJoinBox.innerHTML='Connecting...'
     return false
   }

   const imgs = [
     "", "", // image zero
     "pexels-caio-62645.jpg", "Photo by Caio on pexels.com",
     "pexels-ekrulila-2615285.jpg", "Photo by Ekrulila on pexels.com",
     "pexels-elina-sazonova-1876580.jpg", "Photo by Elina Sazonova on pexels.com",
     "pexels-hert-niks-3224113.jpg", "Photo by Hert Niks on pexels.com",
     "pexels-julia-volk-5272995.jpg", "Photo by Julia Volk on pexels.com",
     "pexels-julia-volk-5273000.jpg", "Photo by Julia Volk on pexels.com",
     "pexels-lisa-fotios-3341054.jpg", "Photo by Lisa Fotios on pexels.com",
     "pexels-markus-spiske-127723.jpg", "Photo by Markus Spiske on pexels.com",
     "pexels-min-an-1006094.jpg", "Photo by Min An on pexels.com",
     "pexels-miquel-rossello-calafell-3061171.jpg", "Photo by Miquel Rossello Calafell on pexels.com",
     "pexels-pixabay-161913.jpg", "Photo by Pixabay on pexels.com",
     "pexels-pixabay-208598.jpg", "Photo by Pixabay on pexels.com",
     "pexels-pixabay-208674.jpg","Photo by Pixabay on pexels.com",
     "pexels-rachel-claire-4819830.jpg","Photo by Rachel Claire on pexels.com",
     "pexels-rudolf-kirchner-831082.jpg","Photo by Rudolf Kirchner on pexels.com"
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
          // console.log("image url is " + imageUrl);
          // preloaderImg.addEventListener('load', (event) => {
          //      console.log("image loaded");
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
          document.body.style.background = "#131313";
     }
     // document.getElementById("photocredit1").innerHTML = imgs[imgid*2+1];
     document.getElementById("photocredit2").innerHTML = imgs[imgid*2+1];
}


   
function onloadstuff() {
     if (!softConnect()) {
          hardConnect();
          //window.setTimeout("onloadstuff()",500);
          // alert("Metamask is no longer connected to the Orthoverse!")
          // window.location.href = "index.html";
     } //else 
         // ShowLand(softAddress(false),true);

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
     //setBackgroundImage(imgid);
     // var guid = document.getElementById("scpicehost");
     // if (guid.value.substr(2,1) == '-') {
     //      guid.value = location + '-' + guid.value.substr(3);
     // } else {
     //      guid.value = location + '-' + guid.value;
     // }
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
          // DC.host(setup);
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

window.onload=window.onresize=function(){
     onloadstuff();
  scaleFactor=Math.max(1,w/(window.innerWidth-16),h/(window.innerHeight*0.98))
  document.getElementById("bkimg").addEventListener("change",()=>{
          //alert("change!");
          var imgid = document.getElementById("bkimg").value;
          setBackgroundImage(imgid);
          //document.body.style.backgroundImage = "url("+imgs[imgid*2]+")";
          //document.body.style.backgroundSize = "cover";
  });
  document.getElementById("location").addEventListener("change",()=>{
     //alert("change!");
//     applyLocationToInviteCode();
     
     //document.body.style.backgroundImage = "url("+imgs[imgid*2]+")";
     //document.body.style.backgroundSize = "cover";
});
document.getElementById("scpice").addEventListener("change",()=>{
     //alert("change!");
     applyInviteCodeToPeerConfig();
     
     //document.body.style.backgroundImage = "url("+imgs[imgid*2]+")";
     //document.body.style.backgroundSize = "cover";
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
     var username = (parseInt(Date.now()/1000) + 60*60*24) + ":orthopong";
     var password = calcHMAC(username,"4fa4e982a4b2906b8b5e7be323c6b039014e840bcdc265c12771cd598961eef5");
     console.log(username);
     console.log(password);
     cuvee_username = username;
     cuvee_password = password;

     console.log("username: " + username);
     console.log("password: " + password);

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