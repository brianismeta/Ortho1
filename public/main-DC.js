const DC = { id: null, dc: null, me: null, you: null, log: function () { } };

var local_msgs = { "msgs": [] };

var myPeerId = "";
var yourPeerId = "";

var lastPeerId = "";

var peer = null; // own peer object
var conn = null;

const PeerInfo = {
     eu_turn_server: 'turn:eu-0.turn.peerjs.com:3478?transport=tcp',
     na_turn_server: 'turn:us-0.turn.peerjs.com:3478?transport=tcp',
     peer_username: 'peerjs',
     peer_password: 'peerjsp',
     cuvee_server: 'turn:signaling.cuveebits.com:5349?transport=tcp',
     cuvee_username: '1676412243:fakeuser',
     cuvee_password: 'ZmE4MjVkNzFhNmYwZDc0NWFhMmRlZThkZTgwODY4MjU2OThkZTE5Mw==',
     peerconfig: { 'host': '0.peerjs.com', 'debug': 3, 
     'config' :  { 
          'iceServers': [
               { 'urls': 'stun:stun.l.google.com:19302' }, 
               { 'urls': 'turn:us-0.turn.peerjs.com:3478?transport=tcp', username: 'peerjs', credential: 'peerjsp' }],
          iceTransportPolicy: "relay"
     }},
}


// 'setup' is a global, so let's skip it here
function createRoom() {
     // Close old connection
     if (conn) {
          MiscUtilities.MetaLog.log("[HOST] Closing old connection");
          conn.close();
     }

     // Create own peer object with connection to shared PeerJS server
     MiscUtilities.MetaLog.log('[HOST] Create room - init');
     peer = new Peer(null,PeerInfo.peerconfig);

     peer.on('open', function (id) {
          MiscUtilities.MetaLog.log('[HOST] Create room - open');
          // Workaround for peer.reconnect deleting previous id
          myPeerId = id;
          if (peer.id === null) {
               MiscUtilities.MetaLog.log('[HOST] Received null id from peer open, restoring to last peer id: ' + lastPeerId);
               peer.id = lastPeerId;
          } else {
               MiscUtilities.MetaLog.log('[HOST] Remembering peer.id for potential disconnects.');
               lastPeerId = peer.id;
          }

          MiscUtilities.MetaLog.log('[HOST] Created peer.id: ' + peer.id);
          scpicehost.value = peer.id;
          applyLocationToInviteCode();
          MiscUtilities.MetaLog.log("[HOST] Awaiting connection...");
     });
     peer.on('connection', function (c) {
          MiscUtilities.MetaLog.log('[HOST] Create room - peer connection');

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
          addData("[HOST] Connected to peer.id: " + conn.peer);
          addData("[HOST] Connected");

          createRoom_ready();

          if (!already_init) {
               already_init = true;
               //window.setTimeout('setup.onopen()',1000);
               setup.onopen();
          } else {
               MiscUtilities.MetaLog.log("Already init - skip setup");
          }
          //window.setTimeout('createRoom_ready()',1000);
          //createRoom_ready(setup);
     });
     peer.on('disconnected', function () {
          MiscUtilities.MetaLog.log('[HOST] Create room - peer disconnected');
          MiscUtilities.MetaLog.log('[HOST] Connection lost. Attempting reconnect');

          // trying workaround from https://github.com/peers/peerjs/issues/650
          this.disconnectBackoff = 1;
          this.retrySocketConnection();

     });
     peer.on('close', function () {
          MiscUtilities.MetaLog.log('[HOST] Create room - peer closed');
          conn = null;
          MiscUtilities.MetaLog.log('[HOST] Connection destroyed');
     });
     peer.on('error', function (err) {
          MiscUtilities.MetaLog.log('[HOST] Create room - peer error: ' + err);
          //addData(err);

          // trying workaround from https://github.com/peers/peerjs/issues/650
          this.peer.on('error', (e) => {
               if (FATAL_ERRORS.includes(e.type)) {
                 this.reconnectTimeout(e); // this function waits then tries the entire connection over again
               } else {
                 MiscUtilities.MetaLog.log('[HOST] Non fatal error: ',  e.type);
               }
             });          

     });


};

function createRoom_ready() {
     MiscUtilities.MetaLog.log('[HOST] Add additional events ');

     conn.on('data', function (data) {
          setup.onmessage(data);
     });
     conn.on('close', function () {
          MiscUtilities.MetaLog.log('[HOST] Create room - conn closed');
          setup.onclose();
          addData("[HOST] Connection reset -- Awaiting connection...");
          conn = null;
     });
     // Handle errors
     conn.on('error', function (errordata) {
          //MiscUtilities.MetaLog.log("Join room -conn data: " + JSON.stringify(data));
          MiscUtilities.MetaLog.log("[HOST] Connection error: " + errordata);
     });
}



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
          MiscUtilities.MetaLog.log("[JOIN] Closing old connection");
          conn.close();
     }

     addData("[JOIN] Creating peerjs obj");
     peer = new Peer(null,PeerInfo.peerconfig); //null);


     peer.on('open', function (id) {
          MiscUtilities.MetaLog.log('[JOIN] Join room - open');
          // Workaround for peer.reconnect deleting previous id
          myPeerId = id;
          if (peer.id === null) {
               MiscUtilities.MetaLog.log('[JOIN] Received null id from peer open, restoring to last peer id: ' + lastPeerId);
               peer.id = lastPeerId;
          } else {
               MiscUtilities.MetaLog.log('[JOIN] Remembering peer.id for potential disconnects.');
               lastPeerId = peer.id;
          }

          MiscUtilities.MetaLog.log('[JOIN] Joined with peer.id: ' + peer.id);

          // Create connection to destination peer specified in the input field
          // DataConnection object
          // Close old connection
          if (conn) {
               MiscUtilities.MetaLog.log('[JOIN] Closing old connection');
               conn.close();
               // should automatically try to rejoin in the 'onclose' event
          } else {
               MiscUtilities.MetaLog.log('[JOIN] Connecting to peer.id: ' + scpice.value);
               conn = peer.connect(getConnectIDFromInviteCode(scpice.value), {
                    reliable: true
               });
          }
          //addData("Connected (?)");

          // delay??
          MiscUtilities.MetaLog.log('[JOIN] Delay start ');
          for (var i=0; i<500000; i++);
          MiscUtilities.MetaLog.log('[JOIN] Delay end ');



          conn.on('open', function () {
               MiscUtilities.MetaLog.log("[JOIN] Join room - connected to peer.id: " + conn.peer);
               if (!already_init) {
                    already_init = true;
                    setup.onopen();
               } else
               MiscUtilities.MetaLog.log("[JOIN] Already init - skip setup");
           });
           // Handle incoming data (messages only since this is the signal sender)
           conn.on('data', function (data) {
               //MiscUtilities.MetaLog.log("Join room -conn data: " + JSON.stringify(data));
               setup.onmessage(data);
           });
           // Handle errors
           conn.on('error', function (errordata) {
               //MiscUtilities.MetaLog.log("Join room -conn data: " + JSON.stringify(data));
               MiscUtilities.MetaLog.log("Connection error: " + errordata);
           });
           conn.on('close', function () {
               MiscUtilities.MetaLog.log("[JOIN] Join room -conn closed... try to rejoin! :)");
               // try to rejoin
               conn = peer.connect(getConnectIDFromInviteCode(scpice.value), {
                    reliable: true
               });
    
           });
     });
     // Handle incoming data (messages only since this is the signal sender)
     peer.on('data', function (data) {
          //MiscUtilities.MetaLog.log("Join room -peer data:" + JSON.stringify(data));
          setup.onmessage(data);
     });
     peer.on('disconnected', function () {
          MiscUtilities.MetaLog.log('[JOIN] Join room - peer disconnected');
          MiscUtilities.MetaLog.log('[JOIN] Connection lost. Attempting reconnect');

          // trying workaround from https://github.com/peers/peerjs/issues/650
          this.disconnectBackoff = 1;
          this.retrySocketConnection();

          if (false) { // original code before workaround above
               // Workaround for peer.reconnect deleting previous id
               MiscUtilities.MetaLog.log('Restoring peer id from ' + peer.id + " to " + lastPeerId);//Connection lost. Attempting reconnect');
               peer.id = lastPeerId;
               peer.reconnect();
          }
     });
     peer.on('error', function (err) {
          MiscUtilities.MetaLog.log('[JOIN] Join room - peer error: ' + err);
          //addData(err);

          // trying workaround from https://github.com/peers/peerjs/issues/650
          this.peer.on('error', (e) => {
               if (FATAL_ERRORS.includes(e.type)) {
                 this.reconnectTimeout(e); // this function waits then tries the entire connection over again
               } else {
                 MiscUtilities.MetaLog.log('[JOIN] Non fatal error: ',  e.type);
               }
             });          
     });
     peer.on('close', function () {
          addData("[JOIN] Join room -peer closed");
          setup.onclose();
     });
};


/**
* Triggered once a connection has been achieved.
* Defines callbacks to handle incoming data and connection events.
*/

function addData(data) {

     MiscUtilities.MetaLog.log(data);
}



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

// read value in main-util.js from local storage
//var debugdroppedpackets = false;
// var droppedpacketcounter = 0;
// var maxpacketcount = 300;

// // read value in main-util.js from local storage
// //var debugreorderedpackets = false;
// var reorderedpacketscounter = 0;
// var maxreorderedpacketscount = 20;
// var resendpacketdelayms = 200;
DC.send = function(data, resent=false){

     if (LSConfig.debugdroppedpackets == true) {
          LSConfig.droppedpacketcounter++;
          if (LSConfig.droppedpacketcounter > LSConfig.maxpacketcount) {
               LSConfig.droppedpacketcounter = 0;
               MiscUtilities.PacketLog.log("***DROPPING data " + JSON.stringify(data));
               return;
          }
     }
     if (LSConfig.debugreorderedpackets == true && !resent) {
          LSConfig.reorderedpacketscounter++;
          if (LSConfig.reorderedpacketscounter > LSConfig.maxreorderedpacketscount) {
               LSConfig.reorderedpacketscounter = 0;
               MiscUtilities.PacketLog.log("*** reordering packet" + JSON.stringify(data));
               window.setTimeout(DC.send(data,true),LSConfig.resendpacketdelayms);
               return;
          }
     }
     
     MiscUtilities.PacketLog.log("Send: " + JSON.stringify(data));
     if (conn) conn.send(data);
}
