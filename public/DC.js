const DC = { id: null, dc: null, me: null, you: null, log: function () { } };

var local_msgs = { "msgs": [] };

var myPeerId = "";
var yourPeerId = "";

var lastPeerId = "";

var peer = null; // own peer object
var conn = null;



//peer = new Peer(null);

//var peerconfig = null;
var eu_turn_server = 'turn:eu-0.turn.peerjs.com:3478?transport=tcp';
var na_turn_server = 'turn:us-0.turn.peerjs.com:3478?transport=tcp';
var peer_username = 'peerjs';
var peer_password = 'peerjsp';
var cuvee_server = 'turn:signaling.cuveebits.com:5349?transport=tcp';
var cuvee_username = '1676412243:fakeuser';
var cuvee_password = 'ZmE4MjVkNzFhNmYwZDc0NWFhMmRlZThkZTgwODY4MjU2OThkZTE5Mw==';

var peerconfig = { 'host': '0.peerjs.com', 'debug': 0, 'config' :  { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }, { 'urls': 'turn:us-0.turn.peerjs.com:3478?transport=tcp', username: 'peerjs', credential: 'peerjsp' }]}};


//var peerconfig = { 'host': '0.peerjs.com', 'debug': 3, 'config' :  { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }, { 'urls': 'turn:relay.metered.ca:80', username: '339b2c2c352953b59cd1800c', credential: 'cvf1xgDZRFU7E36I' }]}};
//peerconfig = { 'host': '0.peerjs.com', 'debug': 3, 'config' :  { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }, { 'urls': 'turn:signaling.cuveebits.com:5349', username: '1676412243:fakeuser', credential: 'ZmE4MjVkNzFhNmYwZDc0NWFhMmRlZThkZTgwODY4MjU2OThkZTE5Mw==' }]}};

// error says both username and credential are required when using turn or turns
//var peerconfig = { 'host': '0.peerjs.com', 'debug': 3, 'config' :  { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }, { 'urls': 'turn:signaling.cuveebits.com:5349', username:'redential: '4fa4e982a4b2906b8b5e7be323c6b039014e840bcdc265c12771cd598961eef5' }]}};

function createRoom(setup) {
     // Close old connection
     if (conn) {
          console.log("Closing old connection");
          conn.close();
     }

     // Create own peer object with connection to shared PeerJS server
     console.log('Create room - init');
     peer = new Peer(null,peerconfig);

     peer.on('open', function (id) {
          console.log('Create room - open');
          // Workaround for peer.reconnect deleting previous id
          myPeerId = id;
          if (peer.id === null) {
               console.log('Received null id from peer open, restoring to last peer id: ' + lastPeerId);
               peer.id = lastPeerId;
          } else {
               console.log('Remembering peer.id for potential disconnects.');
               lastPeerId = peer.id;
          }

          console.log('Created peer.id: ' + peer.id);
          scpicehost.value = peer.id;
          applyLocationToInviteCode();
          console.log("Awaiting connection...");
     });
     peer.on('connection', function (c) {
          console.log('Create room - peer connection');

          // Allow only a single connection
          if (conn && conn.open) {
               c.on('open', function () {
                    c.send("Already connected to another client");
                    setTimeout(function () { c.close(); }, 500);
                    document.getElementById
               });
               return;
          }

          conn = c;
          addData("Connected to peer.id: " + conn.peer);
          addData("Connected");
          if (!already_init) {
               already_init = true;
               setup.onopen();
          } else
          console.log("Already init - skip setup");
          createRoom_ready(setup);
     });
     peer.on('disconnected', function () {
          console.log('Create room - peer disconnected');
          console.log('Connection lost. Attempting reconnect');

          // trying workaround from https://github.com/peers/peerjs/issues/650
          this.disconnectBackoff = 1;
          this.retrySocketConnection();

          if (false) { // original code before workaround above
               // Workaround for peer.reconnect deleting previous id
               console.log('Restoring peer id from ' + peer.id + " to " + lastPeerId);//Connection lost. Attempting reconnect');
               peer.id = lastPeerId;
               peer.reconnect();
          }
     });
     peer.on('close', function () {
          console.log('Create room - peer closed');
          conn = null;
          console.log('Connection destroyed');
     });
     peer.on('error', function (err) {
          console.log('Create room - peer error: ' + err);
          //addData(err);

          // trying workaround from https://github.com/peers/peerjs/issues/650
          this.peer.on('error', (e) => {
               if (FATAL_ERRORS.includes(e.type)) {
                 this.reconnectTimeout(e); // this function waits then tries the entire connection over again
               } else {
                 console.log('Non fatal error: ',  e.type);
               }
             });          

     });


};

function createRoom_ready(setup) {
     conn.on('data', function (data) {
          //console.log('Create room - conn data: ' + JSON.stringify(data));
          //addData("Data received");
          setup.onmessage(data);
          //       var cueString = "<span class=\"cueMsg\">Cue: </span>";
          //       switch (data.substr(0,5)) {
          //           case 'data:':
          // //                                addData(data);
          // console.log(data.substr(0,50))
          //               addMessage('<img src="' + data + '" />')
          // //                                addMessage(cueString + data);
          //               break;
          //           case 'Fade':
          //               fade();
          //               addMessage(cueString + data);
          //               break;
          //           case 'Off':
          //               off();
          //               addMessage(cueString + data);
          //               break;
          //           case 'Reset':
          //               reset();
          //               addMessage(cueString + data);
          //               break;
          //           default:
          //               addMessage("<span class=\"peerMsg\">Peer: </span>" + data);
          //               break;
          //       };
     });
     conn.on('close', function () {
          console.log('Create room - conn closed');
          setup.onclose();
          addData("Connection reset -- Awaiting connection...");
          conn = null;
     });
     // Handle errors
     conn.on('error', function (errordata) {
          //console.log("Join room -conn data: " + JSON.stringify(data));
          console.log("Connection error: " + errordata);
     });
}


// function initialize() {
//   // Create own peer object with connection to shared PeerJS server

// recvIdInput.value = window.location.href.substr(48);

//   peer = new Peer(null, {
//       debug: 2
//   });

//   peer.on('open', function (id) {
//       // Workaround for peer.reconnect deleting previous id
//       if (peer.id === null) {
//           console.log('Received null id from peer open');
//           peer.id = lastPeerId;
//       } else {
//           lastPeerId = peer.id;
//       }

//       console.log('ID: ' + peer.id);
//   });
//   peer.on('connection', function (c) {
//       // Disallow incoming connections
//       c.on('open', function() {
//           c.send("Sender does not accept incoming connections");
//           setTimeout(function() { c.close(); }, 500);
//       });
//   });
//   peer.on('disconnected', function () {
//       stat.innerHTML = "Connection lost. Please reconnect";
//       console.log('Connection lost. Please reconnect');

//       // Workaround for peer.reconnect deleting previous id
//       peer.id = lastPeerId;
//       peer._lastServerId = lastPeerId;
//       peer.reconnect();
//   });
//   peer.on('close', function() {
//       conn = null;
//       stat.innerHTML = "Connection destroyed. Please refresh";
//       console.log('Connection destroyed');
//   });
//   peer.on('error', function (err) {
//       console.log(err);
//       alert('' + err);
//   });
// };

/**
* Create the connection between the two Peers.
*
* Sets up callbacks that handle any events related to the
* connection and data received on it.
*/


DC.joinRoom = function (setup) {
     _joinRoom(setup);
}


var already_init = false;

function _joinRoom(setup) {
     // Close old connection
     if (conn) {
          console.log("Closing old connection");
          conn.close();
     }

     addData("Creating peerjs obj");
     peer = new Peer(null,peerconfig); //null);


     peer.on('open', function (id) {
          console.log('Join room - open');
          // Workaround for peer.reconnect deleting previous id
          myPeerId = id;
          if (peer.id === null) {
               console.log('Received null id from peer open, restoring to last peer id: ' + lastPeerId);
               peer.id = lastPeerId;
          } else {
               console.log('Remembering peer.id for potential disconnects.');
               lastPeerId = peer.id;
          }

          console.log('Joined with peer.id: ' + peer.id);

          // Create connection to destination peer specified in the input field
          // DataConnection object
          // Close old connection
          if (conn) {
               console.log('Closing old connection');
               conn.close();
               // should automatically try to rejoin in the 'onclose' event
          } else {
               console.log('Connecting to peer.id: ' + scpice.value);
               conn = peer.connect(getConnectIDFromInviteCode(scpice.value), {
                    reliable: true
               });
          }
          //addData("Connected (?)");

          conn.on('open', function () {
               console.log("Join room - connected to peer.id: " + conn.peer);
               if (!already_init) {
                    already_init = true;
                    setup.onopen();
               } else
               console.log("Already init - skip setup");
           });
           // Handle incoming data (messages only since this is the signal sender)
           conn.on('data', function (data) {
               //console.log("Join room -conn data: " + JSON.stringify(data));
               setup.onmessage(data);
           });
           // Handle errors
           conn.on('error', function (errordata) {
               //console.log("Join room -conn data: " + JSON.stringify(data));
               console.log("Connection error: " + errordata);
           });
           conn.on('close', function () {
               console.log("Join room -conn closed... try to rejoin! :)");
               // try to rejoin
               conn = peer.connect(getConnectIDFromInviteCode(scpice.value), {
                    reliable: true
               });
    
           });
     });
     // Handle incoming data (messages only since this is the signal sender)
     peer.on('data', function (data) {
          //console.log("Join room -peer data:" + JSON.stringify(data));
          setup.onmessage(data);
     });
     peer.on('disconnected', function () {
          console.log('Join room - peer disconnected');
          console.log('Connection lost. Attempting reconnect');

          // trying workaround from https://github.com/peers/peerjs/issues/650
          this.disconnectBackoff = 1;
          this.retrySocketConnection();

          if (false) { // original code before workaround above
               // Workaround for peer.reconnect deleting previous id
               console.log('Restoring peer id from ' + peer.id + " to " + lastPeerId);//Connection lost. Attempting reconnect');
               peer.id = lastPeerId;
               peer.reconnect();
          }
     });
     peer.on('error', function (err) {
          console.log('Join room - peer error: ' + err);
          //addData(err);

          // trying workaround from https://github.com/peers/peerjs/issues/650
          this.peer.on('error', (e) => {
               if (FATAL_ERRORS.includes(e.type)) {
                 this.reconnectTimeout(e); // this function waits then tries the entire connection over again
               } else {
                 console.log('Non fatal error: ',  e.type);
               }
             });          
     });
     peer.on('close', function () {
          addData("Join room -peer closed");
          setup.onclose();
     });
};


/**
* Triggered once a connection has been achieved.
* Defines callbacks to handle incoming data and connection events.
*/

function addData(data) {

     console.log(data);
}


// (function(){
//   URL='signal.php';

//   let oldId = window.location.hash.match(/^#([1-9]\d{3})$/);
//   if (oldId) DC.id = oldId[1];

//   var cfg  = {
//     'iceServers': [
//       {'urls': 'stun:stun.stunprotocol.org:3478'},
//       {'urls': 'stun:stun.l.google.com:19302'},
//     ]
//   };

//   var pc=null;

//   function post(data, callback){
//     var ajax = new XMLHttpRequest();
//     ajax.onreadystatechange = function() {
//       if(ajax.readyState==4 && ajax.status==200){
//         callback(JSON.parse(ajax.responseText))
//       }
//     }
//     ajax.open("POST", URL);
//     ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//     ajax.send(data);
//   }

//   var fHost = true;
// function init_host() {

// }
// function init_client() {

// }
//   function init() {
//     DC.log("init()");
//     pc = new RTCPeerConnection(cfg)

//     if (fHost) {
//     pc.onicecandidate = function(e) {
//       if (e.candidate != null) {
//         DC.log("got ice candidate: ",e.candidate);
//         AddMsg(JSON.stringify({"ice":e.candidate}));
//         //post("id="+DC.id+"&to="+DC.you+"&msg="+encodeURIComponent(JSON.stringify({"ice":e.candidate})), gotmsgs);
//       }
//     }
//     pc.onicegatheringstatechange = function(e){
//       if (e.target.iceGatheringState=="complete") {
//         DC.log("ice gathering complete")
//         function poll(){
//           DC.log("polling to start game");
//           post("to="+DC.you+"&id="+DC.id, function(d){
//             gotmsgs(d);
//             if (DC.me=='bob' && DC.dc.readyState=="connecting") setTimeout(poll, 1000);
//           })
//         }
//         setTimeout(poll, 1000);
//       }
//       else {
//         DC.log("ice gathering incomplete")
//       }
//     }
//   }
//     window.location.assign('#'+DC.id)
//   }

//   function gotmsgs(d){
//     DC.log("gotmsgs");
//     for (c of d.msgs) {
//       if (c.ice) {
//         pc.addIceCandidate(new RTCIceCandidate(c.ice)).catch(DC.log)
//       }
//       if (c.sdp) {
//         gotsdp(c.sdp)
//       }
//     }
//   }

//   function gotsdp(sdp){
//     DC.log("got sdp",sdp)
//     pc.setRemoteDescription( new RTCSessionDescription(sdp)).then(function(){
//       if (sdp.type=='offer') pc.createAnswer().then(createdDesc).catch(DC.log)
//     });
//   }

//   function AddMsg(st) {
//     DC.log("Add message " + st);
//     local_msgs.msgs.push(JSON.parse(st));
//     //scpicehost.value = btoa(JSON.stringify(local_msgs));
//   }

//   function createdDesc(desc){
//     DC.log("got description",desc)

//     pc.setLocalDescription(desc).then(function(){
//       AddMsg(JSON.stringify({"sdp":pc.localDescription}));
//       //post("to="+DC.you+"&id="+DC.id+"&msg="+encodeURIComponent(JSON.stringify({"sdp":pc.localDescription})),gotmsgs)
//     }).catch(DC.log);
//   }

// host function
DC.host = function (setup) { //} setup, ready ) {


     createRoom(setup);

     //      DC.me='bob';
     //      DC.you='alice';
     //     DC.log("i'm the host!");
     //     fHost = true;
     //     //  post("id="+DC.id, newId=> {
     //     //   if (newId) DC.id = newId;
     //     DC.id = 77;
     //       init()
     //       DC.dc = pc.createDataChannel('test')
     //       Object.assign(DC.dc, setup)
     //       pc.createOffer().then(createdDesc).catch(DC.log)

     //       ready(DC.id);
     // //    })
};

// client function
DC.join = function (joinid, scpice, setup) {
        DC.log("DC.join - empty function");
     //   fHost = false;
     //   DC.me='alice';
     //   DC.you='bob';
     //   DC.id = joinid;

     //   init();
     //   pc.ondatachannel = function (e) {
     //     DC.log("ondatachannel!");
     //     DC.dc = e.channel || e;
     //     Object.assign(DC.dc, setup)
     //   }
     //   //post("to=bob&id="+DC.id, gotmsgs);
     //   gotmsgs(JSON.parse(atob(scpice)));
     // }

     // DC.send = function(data){
     //   DC.log("send data " + data);

     //   if (DC.dc && DC.dc.readyState=="open" && data) {
     //     DC.dc.send(JSON.stringify(data));
     //   }
     // }

};

var debugdroppedpackets = false;
var droppedpacketcounter = 0;
var maxpacketcount = 300;

DC.send = function(data){

     if (debugdroppedpackets == true) {
          droppedpacketcounter++;
          if (droppedpacketcounter > maxpacketcount) {
               droppedpacketcounter = 0;
               console.log("***DROPPING data " + JSON.stringify(data));
               return;
          }
     }
     
     //console.log("Sending data " + JSON.stringify(data));

     //if (DC.dc && DC.dc.readyState=="open" && data) {
          if (conn) conn.send(data);
     //conn.dataChannel.send(data);
     //DC.dc.send(JSON.stringify(data));
     
     // BC - WRONG - this calls pong's send which then calls this send -- a loop!
     //send(data);
     
     // BC - WRONG - this sends the data to yourself - a loop!
     //setup.onmessage(data);
     //}
}
