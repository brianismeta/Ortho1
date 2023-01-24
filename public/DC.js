const DC = { id: null, dc: null, me: null, you: null, log: function () { } };

var local_msgs = { "msgs": [] };

var myPeerId = "";
var yourPeerId = "";

var lastPeerId = "";

var peer = null; // own peer object
var conn = null;



//peer = new Peer(null);

function createRoom(setup) {
     // Create own peer object with connection to shared PeerJS server
     console.log('Create room - init');
     peer = new Peer(null);

     peer.on('open', function (id) {
          console.log('Create room - open');
          // Workaround for peer.reconnect deleting previous id
          myPeerId = id;
          if (peer.id === null) {
               console.log('Received null id from peer open');
               peer.id = lastPeerId;
          } else {
               lastPeerId = peer.id;
          }

          console.log('ID: ' + peer.id);
          //recvId.innerHTML = "ID: <br>" + peer.id;
          scpicehost.value = peer.id;

          addData("Awaiting connection...");
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
          addData("Connected to: " + conn.peer);
          addData("Connected");
          setup.onopen();
          // Object.assign(conn.peerConnection,setup);
          // DC.dc = conn.peerConnection;
          // Object.assign(DC.dc,setup);

          //Object.assign(DC.dc, setup);
          createRoom_ready(setup);
     });
     peer.on('disconnected', function () {
          console.log('Create room - peer disconnected');
          //stat.innerHTML = "Connection lost. Please reconnect";
          addData('Connection lost. Please reconnect');

          // Workaround for peer.reconnect deleting previous id
          peer.id = lastPeerId;
          peer._lastServerId = lastPeerId;
          peer.reconnect();
     });
     peer.on('close', function () {
          console.log('Create room - peer closed');
          conn = null;
          //stat.innerHTML = "Connection destroyed. Please refresh";
          addData('Connection destroyed');
     });
     peer.on('error', function (err) {
          console.log('Create room - peer error');
          addData(err);
          //alert('' + err);
     });


};

function createRoom_ready(setup) {
     conn.on('data', function (data) {
          console.log('Create room - conn data: ' + JSON.stringify(data));
          addData("Data received");
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

// function _xjoinRoom() {

//   console.log('Join room - open');
//   peer = new Peer();
// //   null, {
// //     debug: 2
// // });

// peer.on('open', function (id) {
//     // Workaround for peer.reconnect deleting previous id
//     if (peer.id === null) {
//         console.log('Received null id from peer open');
//         peer.id = lastPeerId;
//     } else {
//         lastPeerId = peer.id;
//     }

//     console.log('ID: ' + peer.id);
// });
// peer.on('connection', function (c) {
//     // Disallow incoming connections
//     c.on('open', function() {
//         c.send("Sender does not accept incoming connections");
//         setTimeout(function() { c.close(); }, 500);
//     });
//     //readyready():
// });
// peer.on('disconnected', function () {
//     //stat.innerHTML = "Connection lost. Please reconnect";
//     console.log('Connection lost. Please reconnect');

//     // Workaround for peer.reconnect deleting previous id
//     peer.id = lastPeerId;
//     peer._lastServerId = lastPeerId;
//     peer.reconnect();
// });
// peer.on('close', function() {
//     conn = null;
//     //stat.innerHTML = "Connection destroyed. Please refresh";
//     console.log('Connection destroyed');
// });
// peer.on('error', function (err) {
//     console.log(err);
//     alert('' + err);
// });

function _joinRoom(setup) {
     // Close old connection
     if (conn) {
          conn.close();
     }

     addData("Creating peerjs obj");
     peer = new Peer(); //null);


     peer.on('open', function (id) {
          console.log('Join room - open');
          // Workaround for peer.reconnect deleting previous id
          myPeerId = id;
          if (peer.id === null) {
               console.log('Received null id from peer open');
               peer.id = lastPeerId;
          } else {
               lastPeerId = peer.id;
          }

          console.log('ID: ' + peer.id);


          // Create connection to destination peer specified in the input field
          
          
          // DataConnection object
          conn = peer.connect(scpice.value, {
               reliable: true
          });
          
          //Object.assign(DC.dc, setup);

          addData("Connected (?)");

          conn.on('open', function () {
               //stat.innerHTML = "Connected to: " + conn.peer;
               console.log("Join room -conn open to: " + conn.peer);
               // Object.assign(conn.peerConnection,setup);
               // DC.dc = conn.peerConnection;
               // Object.assign(DC.dc,setup);
               setup.onopen();
               
               // Check URL params for comamnds that should be sent immediately
               // var command = getUrlParam("command");
               // if (command)
               //     conn.send(command);
           });
           // Handle incoming data (messages only since this is the signal sender)
           conn.on('data', function (data) {
               console.log("Join room -conn data: " + JSON.stringify(data));
               setup.onmessage(data);

           });
           conn.on('close', function () {
               console.log("Join room -conn closed");
               //setup.onclose();

               //stat.innerHTML = "Connection closed";
           });
 //recvId.innerHTML = "ID: <br>" + peer.id;
          //scpicehost.value = peer.id;

          //addData("Awaiting connection...");

          //addData("Connected to: " + conn.peer);
          //console.log("Connected to: " + conn.peer);

          // // Check URL params for comamnds that should be sent immediately
          // var command = getUrlParam("command");
          // if (command)
          //     conn.send(command);
     });
     // Handle incoming data (messages only since this is the signal sender)
     peer.on('data', function (data) {
          console.log("Join room -peer data:" + JSON.stringify(data));
          setup.onmessage(data);
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
DC.send = function(data){
     DC.log("DC.send send data " + JSON.stringify(data));

     //if (DC.dc && DC.dc.readyState=="open" && data) {
          conn.send(data);
     //conn.dataChannel.send(data);
     //DC.dc.send(JSON.stringify(data));
     
     // BC - WRONG - this calls pong's send which then calls this send -- a loop!
     //send(data);
     
     // BC - WRONG - this sends the data to yourself - a loop!
     //setup.onmessage(data);
     //}
}
