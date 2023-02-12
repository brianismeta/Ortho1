document.querySelectorAll('h1 span').forEach(a=>a.style.animationDelay=2*Math.random()+'s')

canvas=document.getElementById("game")
ctx=canvas.getContext("2d")
ctx.imageSmoothingEnabled=false;
ctx.shadowColor='#e8e8e8'
ctx.shadowBlur=8;
w=canvas.width;h=canvas.height

viewport = document.querySelector('meta[name="viewport"]');
graph=document.getElementById("graph").getContext("2d")
ggrid=document.getElementById("ggrid").getContext("2d")
showstats=document.getElementById("showstats").checked;
statsbox.style.display='none';//showstats?'block':'none';
ballspeed.oninput()

host=false;
connected=false;
bufferSize = 3;
frameNumber = -bufferSize;

driftThreshold = 1 //ms
driftTrimFactor = 0.1 //
stacksize=5 // averaging period for ping/lead times

frameLength = 1000/60 //1000/FPS target
nextFrame=0
lastAnimationFrame=0;
synctick=0;

version=1 // increment whenever the game logic changes

myInputs=[]
yoInputs=[]
rollbackState={}
rollbackInputs=[]
yoInputLastDir=0;

scaleFactor=1
paddleH=60
paddleW=20
ballSize=20
edgeGuard=paddleH/2+ballSize/2
left ={y:h/2,x:20}
right={y:h/2,x:w-20}
grabY = 0; //mouse input

scoreLeft=0
scoreRight=0

ballStartSpeed=4;
ballSpeedIncrement = 0.25;

gameEnded=0;
leftWinner=0;
rightWinner=0;

ball={x:0,y:-20,speed:0,hspeed:0,vspeed:0}

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
         //orthoverseStatus.innerHTML = 'No Orthoverse land detected.  Reveal your land at <a href="https://orthoverse.io">orthoverse.io</a>';
         //return null;
       });
   
   
   }
//    function getOrthoverseCastleLevel(index) {
//      var orthoverseCastleLevel = "";
//      var zero24 = "000000000000000000000000";
//      var params = [
//        {
//          //from: softAddress(),
//          to: orthoTokenContact,
//          //'4-byte function hash followed by address',
//          data: "0xc08db79d" + zero24 + softAddress(false),
//          //"gas":"0x5f5e100", "gasprice":"0x3b9aca00", "value":"0x0"
//          // id: 1
//        }
//        //,"latest"
//      ];
     
//      ethereum
//        .request({
//          method: 'eth_call',
//          params,
//          id: '1'
//        })
//        .then((result) => {
//          // Good result returns null in this case
//          console.log("Good: " +result);
   
//          // Using the decodeURIComponent function in combination with regex to convert the hex value into utf8 value
//          iOrthoverseCastleLevel = convertHexToDecimal(result.substr(2));
//    })
//        .catch((error) => {
//          // If the request fails, the Promise will reject with an error.
//          console.log("eth_call failed: " +error.message);
//        });
//    }

   
//    // INITIALIZE OUR STUFF HERE
//    // get our own CASTLE INFORMATION (NOTE: ASYNC!!!)
// getOrthoverseCastleLevel(0);
//getOrthoverseLandInformation(0);



function objcopy(o){
  let copy = {}
  for (var a in o) {
    if (o.hasOwnProperty(a)) copy[a] = o[a];
  }
  return copy
}
function storeRollbackState(){
  rollbackState = {frame:myInputs[0].frame, seed, scoreLeft, scoreRight, ball:objcopy(ball), leftY:left.y, rightY:right.y}
}
function loadRollbackState(){
  left.y=rollbackState.leftY
  right.y=rollbackState.rightY
  seed=rollbackState.seed
  scoreLeft=rollbackState.scoreLeft
  scoreRight=rollbackState.scoreRight
  ball=objcopy(rollbackState.ball)
}

drawInitialPongGame=function(t){
     ctx.clearRect( 0,0,w,h)
   
       ctx.fillRect( left.x - paddleW/2, left.y - paddleH/2, paddleW, paddleH)
       ctx.fillRect( right.x - paddleW/2, right.y - paddleH/2, paddleW, paddleH)
     //   for (let i=13;i<h;i+=27) ctx.fillRect( w/2-5,i, 10,10)
     //if (connected) requestAnimationFrame(drawInitialPongGame)
   }
   
var one_time_log_game_ended = false;
// Animation frame FPS could be different at each end, so don't rely on it for any timing.
draw=function(t){
  ctx.clearRect( 0,0,w,h)

  if (gameEnded) {
     var saveColor = ctx.fillStyle;
     ctx.fillStyle = leftWinner? "#A6EE7A":"#F7816E";
     ctx.fillRect(0,0,w/2,h);
     ctx.fillStyle = leftWinner?"#F7816E":"#A6EE7A";
     ctx.fillRect(w/2,0,w,h);
     ctx.fillStyle = saveColor;
     if (! one_time_log_game_ended ) { // draw keeps going... how to stop it????
          one_time_log_game_ended = true;
          console.log("*********************************");
          console.log("*********************************");
          console.log("*********************************");
          console.log("          GAME ENDED!");
          console.log("*********************************");
          console.log("*********************************");
          console.log("*********************************");
     }
  }
  if (frameNumber<88) {
    for (let i=0;i<frameNumber/8;i++) ctx.fillRect( w/2-5,13+i*27, 10,10),ctx.fillRect( w/2-5,580-i*27, 10,10)
  } else {
    ctx.fillRect( left.x - paddleW/2, left.y - paddleH/2, paddleW, paddleH)
    ctx.fillRect( right.x - paddleW/2, right.y - paddleH/2, paddleW, paddleH)
    ctx.fillRect( ball.x-ballSize/2,ball.y-ballSize/2, ballSize, ballSize )
    for (let i=13;i<h;i+=27) ctx.fillRect( w/2-5,i, 10,10)
    drawScore(w/2-45,scoreLeft,1)
    drawScore(w/2+55,scoreRight)
  }
  if (showstats) doStats(t)

  if (connected) requestAnimationFrame(draw)
  lastAnimationFrame=t
}
ctx.fillStyle='#e8e8e8'
var font=new Image();
font.src="data:image/gif;base64,R0lGODlhHgAFAIAB"+btoa("\0\xe8\xe8\xe8\xff\xff")+"/yH5BAEAAAEALAAAAAAeAAUAAAIdhANom+x/WphJWTRp23h7WIEdloUaGWnpozItVQAAOw==";

function drawScore(x,score,alignRight){
  let t=score.toString(), offset=alignRight?t.length*40:0;
  for (var c in t) {
    ctx.drawImage(font, (t[c].charCodeAt(0)-0x30)*3, 0, 3,5,x+c*40-offset,20,30,50)
  }
}

seed= Math.floor(Math.random()*0xFFFFFFFF);
function rng() {
  var t = seed += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

function FixAngle(myangle) {
     // if the angle is too close to vertical, game will get boring.
     // check for these radian numbers and fix it.
     // Hard game will make adjustment more towards center than Easy or Medium.
     var pi = Math.PI;
     if (myangle < 0) {
          myangle += 2*pi;
     }
     var cntn,lb,hb,mb,ret;
     cntn = pi/4;
     lb = pi/4; //3*pi/8;
     mb = pi/2;
     hb = 3*pi/4; //5*pi/8;
     if (myangle > lb && myangle < mb) {
          ret= rng()*cntn;
          console.log("Fixed angle from " + myangle + " to " + ret);
          return ret;// lb;
     } else if (myangle >= mb && myangle < hb) {
          ret= pi - rng()*cntn;
          console.log("Fixed angle from " + myangle + " to " + ret);
          return ret; //hb;
     }
     lb = 5*pi/4; //11*pi/8;
     mb = 3*pi/2;
     hb = 7*pi/4; //13*pi/8;
     if (myangle > lb && myangle < mb) {
          ret= pi + rng()*cntn;
          console.log("Fixed angle from " + myangle + " to " + ret);
          return ret;// lb;
     } else if (myangle >= mb && myangle < hb) {
          ret= 2*pi - rng()*cntn;
          console.log("Fixed angle from " + myangle + " to " + ret);
          return ret; //hb;
     }
     return myangle;
}
function resetBall(){

     // check to see if someone won the game



  // choose a random angle in a 90deg cone facing one of the players
  let angle, pi=Math.PI;
  angle= rng()*pi/2-pi/4;
  if (rng()>0.5) {
     if (angle > 0)
          angle+= -pi;
     else
          angle+=pi;
     }
  console.log("Angle start: " + angle);
     angle = FixAngle(angle);
  ball.x=w/2
  ball.y=h/2
  ball.speed=ballStartSpeed
  ball.speedIncrement = ballSpeedIncrement;
  ball.hspeed = Math.cos(angle)*ball.speed
  ball.vspeed = Math.sin(angle)*ball.speed
}


timePair={t1:null,t2:null} // of last received packet
pingStack=[]
leadStack=[]
function send(o){
  o.t1 = timePair.t1
  o.t2 = timePair.t2
  o.tSend=performance.now()
  DC.send(o)
}
function avg(a){
  return a.reduce((x,y)=>x+y)/a.length
}

setup = {
  onopen: function(){
    connected=true;
    requestAnimationFrame(draw)
    debuglog.style.display='none';
    divHomeActionButtons.style.display='none';
    divJoinBox.style.display='none';
    divCreateGameOptions.style.display='none';
    divGameInfo.style.display='block';

    if (!host) {
     var walletAddress = softAddress(false);
      send({type:"version", version, walletAddress})
    }
  },
  onclose: function(){
    connected=false;
    debuglog.innerHTML = '[ disconnected &mdash; refresh to play again ]'
    debuglog.style.display='inline-block';

  },
  onmessage:function(e) {
    let ping, recTime = performance.now()
    // orig - var data = JSON.parse(e.data)
    var data = e; // JSON.parse(e)
    timePair = {t1:data.tSend, t2:recTime}

    if (data.t1) {
      let t1=data.t1, t2=data.t2, t3=data.tSend, t4 = recTime;
      ping = t4-t1 - (t3-t2);
      pingStack.push(ping)
      if (pingStack.length>stacksize) pingStack.shift()
    }

    if (data.type) switch (data.type) {
     // changed the logic due to initial issue with loading background image appears to 
     // conflict with the game's buffer sync detection
     // Now this is what is expected:
     // VERSION sent from JOINER to HOSTER with WalletAddr
     // ACKVERSION sent from HOSTER to JOINER with WalletAddr, Difficulty, BackgroundImage
     // JOINER will see START GAME button within a few seconds, delayed to load images
     // STARTGAME sent from JOINER to HOSTER
     // SYN sent from HOSTER to JOINER
     // exchange SYNACK / SYN for 5 times
     // ACK sent from HOSTER to JOINER with seed and buffersize
     // game starts

      case "version":

        if (data.version != version) {
          if (host) 
               send({type:"version", version}) //force the other player to also throw this error
          alert("Version mismatch! Please refresh the page and try again")
          DC.dc.close()
        } 
        else {
          //
          // GENERALLY THE PERSON WHO RECEIVE 'VERSION' IS THE HOST
          //
          // Receives the wallet address of the GUEST, so can display it on the screen
          //
          //console.log("Received Version. Sending SYN");
          console.log("Received Version. Sending ACKVERSION"); 
          yourwallet = data.walletAddress;
          ShowLand(yourwallet, false);
          //send({type:"SYN"})
          var imgid = getBackgroundImage();
          var difflevel = document.getElementById("difflevel").value;
          if (difflevel == 1) {
               ballStartSpeed = 3;
               paddleH=240;
          } else if (difflevel == 2) {
               ballStartSpeed = 5;
               paddleH=180;
          } else if (difflevel ==3) {
               ballStartSpeed = 7;
               paddleH=120;
          }
          var walletAddress = softAddress(false);
          send({type:"ACKVERSION",walletAddress,imgid,ballStartSpeed  })
          requestAnimationFrame(drawInitialPongGame);

          // now show that we are waiting on the GUEST to be READY
          host_wait_guest_ready.style.display="";
          startBtn.style.display="none";
          readyBtn.style.display="none";
          host_wait_guest_ready.style.display="";
          guest_wait_host_ready.style.display="none";
          guest_wait_ready.style.display="none";
          

        }
        break;
     case "ACKVERSION":
          //console.log("Received Version. Sending SYN");
          console.log("Received ACKVERSION."); 
          //yourwallet = data.walletAddress;
          //ShowLand(yourwallet, false);
          //send({type:"SYN"})
          //send({type:"ACKVERSION",ballStartSpeed, imgid, walletAddress })
          //   seed=data.seed
          //   bufferSize = data.bufferSize
          //
          // GENERALLY THE PERSON WHO RECEIVE 'ACKVERSION' IS THE GUEST
          //
          // Receives the wallet address of the HOST, the IMAGE ID (for the background image)
          // and the 'DIFFICULTY' (e.g. ball speed, paddle size)
          //
          ballStartSpeed = data.ballStartSpeed
          yourwallet = data.walletAddress;
          if (ballStartSpeed == 3) {
               paddleH = 240;
          } else if (ballStartSpeed == 5) {
               paddleH=180;
          } else if (ballStartSpeed ==7) {
               paddleH=120;
          }
    
          //var gamevs = yourwallet + " vs " + mywallet;
          ShowLand(yourwallet, false);
          // set background image
          setBackgroundImage(data.imgid);
          var imgimg = data.imgid;
          gtag('event', 'guest_recv_gameinfo', {
               'event_category': 'pong_game',
               'event_label': 'background',
               'value': imgimg
          });
          requestAnimationFrame(drawInitialPongGame);
    
          // now show that we are waiting for the GUEST to be READY
          readyBtn.style.display = '';
          host_wait_guest_ready.style.display="none";
          startBtn.style.display="none";
          host_wait_guest_ready.style.display="none";
          guest_wait_host_ready.style.display="none";
          guest_wait_ready.style.display="";

          break;
     case "READY":
          //
          // GENERALLY THE PERSON WHO RECEIVE 'READY' IS THE HOST
          //
          // This indicates that the GUEST is READY, and the HOST can now start the game
          //
          console.log("Received READY."); // Sending SYN"); 
          startBtn.style.display = "";
          //send({type:"SYN"})
          // now show that we are waiting for the GUEST to be READY
          readyBtn.style.display = 'none';
          host_wait_guest_ready.style.display="none";
          startBtn.style.display="";
          host_wait_guest_ready.style.display="none";
          guest_wait_host_ready.style.display="none";
          guest_wait_ready.style.display="none";
          break;
            break;

     case "SYN":
        console.log("Received SYN. Sending SYNACK"); 
        send({type:"SYNACK"})
          // GUEST RECEIVES SYN SO GAME IS STARTING
          host_wait_guest_ready.style.display="none";
          startBtn.style.display="none";
          readyBtn.style.display="none";
          host_wait_guest_ready.style.display="none";
          guest_wait_host_ready.style.display="none";
          guest_wait_ready.style.display="none";
        break;
      case "SYNACK":
        // repeatedly send start condition to establish average ping time
        if (pingStack.length < stacksize) {
          console.log("Received SYNACK. Sending another SYN.  Ping size is " + pingStack.length); 
          send({type:"SYN"})
          }
        else {
          pingStack.shift() // The first is usually unrepresentative, throw away
          let halftrip = avg(pingStack)/2

          bufferSize = (bufsize.value=="Auto") ? Math.min(5,Math.ceil(halftrip/frameLength)) : Number(bufsize.value);
          initBuffer()
          //ballStartSpeed = Number(ballspeed.value)
     
          
          // ballSpeedIncrement = Number(ballSpeedIncrement.value);
          var imgid = getBackgroundImage();
          var difflevel = document.getElementById("difflevel").value;
          if (difflevel == 1) {
               ballStartSpeed = 3;
               paddleH=240;
          } else if (difflevel == 2) {
               ballStartSpeed = 5;
               paddleH=180;
          } else if (difflevel ==3) {
               ballStartSpeed = 7;
               paddleH=120;
          }
          console.log("Received SYNACK. Sending ACK with game details"); 
          var walletAddress = softAddress(false);

          send({type:"ACK", seed, bufferSize, ballStartSpeed, imgid, walletAddress })

          // wait for half the roundtrip time before starting the first frame
          nextFrame = performance.now() + halftrip
          setTimeout(processFrame, nextFrame - performance.now())
        }
        break;
      case "ACK":
        console.log("Received ACK. Applying game details"); 
        seed=data.seed
        bufferSize = data.bufferSize
     //    ballStartSpeed = data.ballStartSpeed
     //    yourwallet = data.walletAddress;
     //    if (ballStartSpeed == 3) {
     //      paddleH = 240;
     // } else if (ballStartSpeed == 5) {
     //      paddleH=180;
     // } else if (ballStartSpeed ==7) {
     //      paddleH=120;
     // }

     //    //var gamevs = yourwallet + " vs " + mywallet;
     //    ShowLand(yourwallet, false);
     //  // set background image
     //    setBackgroundImage(data.imgid);
     //      var imgimg = data.imgid;
     //    gtag('event', 'click_startgame', {
     //      'event_category': 'pong_game',
     //      'event_label': 'background',
     //      'value': imgimg
     //    });

        
        nextFrame = performance.now()
        initBuffer()
        processFrame()
        break;
      case "input":

        if (rollbackInputs.length) {
          let myInput = rollbackInputs.shift()
          let yoInput = data.input
          loadRollbackState()

          if (yoInput.frame != myInput.frame) console.log("sync error waah",myInput.frame,yoInput.frame)

          processGameLogic(myInput,yoInput)
          storeRollbackState()

          // from here, run the rest of the buffer again
          yoInputLastDir = yoInput.dir

          for (let i=0;i<rollbackInputs.length;i++) {
            processGameLogic( rollbackInputs[i], {dir:yoInputLastDir} )
          }

        } else {
          yoInputs.push(data.input)
        }
        // check/adjust timing
        //input packet contains estimate until next frame
        let otherNextFrame = recTime -ping/2 + data.delay
        let frameDifference = (frameNumber-1 -data.input.frame)*frameLength
        let leadTime = nextFrame - otherNextFrame - frameDifference;
        leadStack.push(leadTime)
        if (leadStack.length>stacksize) leadStack.shift()

        break;
    }
  }
}

function initBuffer(){
  frameNumber = -bufferSize;
  for (let i=0;i<bufferSize;i++) {
    myInputs.push( { frame:frameNumber, dir:0 } )
    yoInputs.push( { frame:frameNumber, dir:0 } )
    frameNumber++
  }
}


function processFrame(){
// this is the key game loop -- if game ends, need to break this loop.

if (scoreLeft >=5 || scoreRight >= 5) {
     if (scoreLeft > scoreRight) {
          gameEnded = 1;
          leftWinner = 1;
     } else if (scoreRight > scoreLeft) {
          gameEnded = 1;
          rightWinner = 1;
     }
}

if (gameEnded)
     return;
  let yoInput,myInput;
  if (yoInputs.length==0) {
    if (rollbackInputs.length>=10){
      //give up and delay
      nextFrame += 1
      if (connected) setTimeout(processFrame,1)
      return
    }
    if (rollbackInputs.length==0) {
      //commence rollback
      storeRollbackState()
    } 
    rollbackInputs.push(myInputs[0])

    yoInput = {frame:myInputs[0].frame, dir:yoInputLastDir}

  } else {
    yoInput = yoInputs.shift()
    yoInputLastDir = yoInput.dir
  }

  myInput = myInputs.shift()

  if (myInput.frame != yoInput.frame) {console.log("SYNC ERROR AHHH", myInput,yoInput); return}

  processGameLogic(myInput,yoInput)

  // take input and add to stack
  myinput = { frame:frameNumber, dir:grabY*scaleFactor }
  grabY = 0;
  myInputs.push( myinput )

  // timing drift correction - should this be before or after transmitting?
  if (leadStack.length==stacksize) {
    let lead = -avg(leadStack)
    if (lead>driftThreshold) { //we are running fast
       nextFrame += Math.min(lead*driftTrimFactor, frameLength)
    }
  }

  frameNumber++
  nextFrame += frameLength

  let now = performance.now()
  if (nextFrame<now) {
    //console.log('timing disrupted')
    nextFrame=now
  }
  let delay = nextFrame - now

  // send inputs to other
  // if game is ended, we should not need to send inputs
  send({type:"input", input:myinput, delay})

  let framesync = now-lastAnimationFrame-synctick;
  if (framesync<2 || framesync>15) synctick=-4;
  else synctick=0

  if (connected) setTimeout(processFrame, delay + synctick)
}

function processGameLogic(myInput,yoInput){
     // called by processFrame and onmessage
  let oldlefty=left.y, oldrighty=right.y

  if (host) { processPlayer(left, myInput); processPlayer(right, yoInput); }
  else      { processPlayer(left, yoInput); processPlayer(right, myInput); }

  if (myInput.frame==102) resetBall(); //end of intro animation

  let impulses = Math.ceil(ball.speed), step=1/impulses;
  for (let i=0;i<impulses;i++) {

    ball.x += ball.hspeed*step;
    ball.y += ball.vspeed*step;

    // bounce off top and bottom
    if ((ball.y>h-10 && ball.vspeed>0 )
     || (ball.y<10   && ball.vspeed<0 )) ball.vspeed =-ball.vspeed;

    // check for face collision with paddle
    if (Math.round(ball.x-ballSize/2) == Math.round(left.x+paddleW/2-1) && vcollision(left)) {
      //reflect based on position
      ball.speed = ball.speed + ball.speedIncrement;
      let angle = Math.atan2(ball.y-left.y, 15)
      // limit angle to within 50 degrees of x-axis.
      angle = FixAngle(angle);
      ball.hspeed = Math.cos(angle)*ball.speed
      ball.vspeed = Math.sin(angle)*ball.speed
      console.log("Angle is now " + angle);
      ball.x++
    }
    else if (Math.round(ball.x+ballSize/2) == Math.round(right.x-paddleW/2+1) && vcollision(right)) {
      ball.speed = ball.speed + ball.speedIncrement;
      let angle = Math.atan2(ball.y-right.y, -15)
      // limit angle to within 50 degrees of x-axis.
      angle = FixAngle(angle);
      ball.hspeed = Math.cos(angle)*ball.speed
      ball.vspeed = Math.sin(angle)*ball.speed
      console.log("Angle is now " + angle);
      ball.x--
    }
    else if (ball.x-ballSize/2 < left.x+paddleW/2-1 && vcollision(left)) {
      ball.vspeed = -ball.vspeed
      if (ball.y<oldlefty) ball.y=left.y-paddleH/2-ballSize/2;
      else ball.y=left.y+paddleH/2+ballSize/2;
    }
    else if (ball.x+ballSize/2 > right.x-paddleW/2+1 && vcollision(right)) {
      ball.vspeed = -ball.vspeed
      if (ball.y<oldrighty) ball.y=right.y-paddleH/2-ballSize/2;
      else ball.y=right.y+paddleH/2+ballSize/2;
    }
  }

  if (ball.x<-ballSize) scoreRight++,resetBall()
  if (ball.x>w+ballSize) scoreLeft++,resetBall()
}

function processPlayer(p, input){
  p.y += input.dir;
  if (p.y > h-edgeGuard) p.y = h-edgeGuard;
  if (p.y <   edgeGuard) p.y = edgeGuard;
}

function vcollision(p){
  return (ball.y-ballSize/2 < p.y+paddleH/2 && ball.y+ballSize/2 > p.y-paddleH/2)
}

DC.log=function(...e) {
  console.log(...e)
  e[1]=JSON.stringify(e[1])
  document.getElementById("debuglog").innerHTML += e.join(" ")+"\n"
}
createBtn.onclick = function() {
     gtag('event', 'host_click_creategame', {
          'event_category': 'pong_game'
        });
  DC.host(setup);
  //  setup, id=> {
  //   document.querySelector('#divCreateGameOptions h2').innerHTML = 'ID: '+ id
  // });
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




canvas.onmousedown=function(e){
  let sy = e.pageY
  e.preventDefault()
  e.stopPropagation()

  document.onmousemove=function(e){
    grabY += e.pageY - sy
    sy = e.pageY
  }
  document.onmouseup=function(e){
    document.onmouseup=null;
    document.onmousemove=null;
  }
}

touches=[];
canvas.ontouchstart=function(e){
  e.preventDefault()
  for (let i =e.changedTouches.length;i--;){
    let t={sy:e.changedTouches[i].pageY}
    touches[e.changedTouches[i].identifier]=t;
  }
}
canvas.ontouchmove=function(e){
  e.preventDefault()
  for (let i=e.changedTouches.length;i--;){
     let t=touches[e.changedTouches[i].identifier];
     grabY += (e.changedTouches[i].pageY - t.sy)
     t.sy=e.changedTouches[i].pageY;
  }
  if (e.touches.length>2) { //3-finger touch to reset zoom level
    viewport.content = 'initial-scale=1';
    viewport.content = 'width=device-width';
  }
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

          document.body.style.backgroundImage = "url("+imgs[imgid*2]+")";
          document.body.style.backgroundSize = "cover";
     } else {
          document.body.style.background = "#131313";
     }
     // document.getElementById("photocredit1").innerHTML = imgs[imgid*2+1];
     document.getElementById("photocredit2").innerHTML = imgs[imgid*2+1];
}

function hardConnect() {
     ethereum
     .request({ method: "eth_requestAccounts" })
     .then((accounts) => {
     })
     .catch((error) => {
       console.log(error, error.code);
   
     });
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
function applyLocationToInviteCode() {
     var location = document.getElementById("location").value;
     //setBackgroundImage(imgid);
     var guid = document.getElementById("scpicehost");
     if (guid.value.substr(2,1) == '-') {
          guid.value = location + '-' + guid.value.substr(3);
     } else {
          guid.value = location + '-' + guid.value;
     }
     if (location == 'EU') {
          peerconfig.config.iceServers[1].urls = eu_turn_server;
          //var eu_turn_server = 'turn:eu-0.turn.peerjs.com:3478?transport=tcp';
          //var na_turn_server = 'turn:us-0.turn.peerjs.com:3478?transport=tcp';
          
     } else {
          peerconfig.config.iceServers[1].urls = na_turn_server;

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
     applyLocationToInviteCode();
     
     //document.body.style.backgroundImage = "url("+imgs[imgid*2]+")";
     //document.body.style.backgroundSize = "cover";
});

function applyInviteCodeToPeerConfig() {
     var guid = document.getElementById("scpice");
     var location;
     if (guid.value.substr(2,1) == '-') {
          location  = guid.value.substr(0,2);
     } else {
          location = 'US';
     }
     if (location == 'EU') {
          peerconfig.config.iceServers[1].urls = eu_turn_server;
          //var eu_turn_server = 'turn:eu-0.turn.peerjs.com:3478?transport=tcp';
          //var na_turn_server = 'turn:us-0.turn.peerjs.com:3478?transport=tcp';
          
     } else {
          peerconfig.config.iceServers[1].urls = na_turn_server;

     }

}
document.getElementById("scpice").addEventListener("change",()=>{
     //alert("change!");
     applyInviteCodeToPeerConfig();
     
     //document.body.style.backgroundImage = "url("+imgs[imgid*2]+")";
     //document.body.style.backgroundSize = "cover";
});



}



///// stats /////
rateAveragingPeriod=6;

animFrameRate=0;
animFrameRateSample=0;
animFrameRateCount=0;
gameFrameRate=0;
gameFrameSample=0;
gameFrameCount=0;
needle=50;

ggrid.strokeStyle="rgba(255,255,255,0.2)"
function drawgrid(x,y,w,h,linespace,zero){
  ggrid.beginPath()
  for (let i=x;i<=x+w;i+=linespace) {
    ggrid.moveTo(i,y)
    ggrid.lineTo(i,y+h)
  }
  for (let j=y;j<=y+h;j+=linespace) {
    ggrid.moveTo(x,  j)
    ggrid.lineTo(x+w,j)
  }
  ggrid.stroke()
  ggrid.beginPath()
  ggrid.moveTo(x,y+h+zero)
  ggrid.lineTo(x+w,y+h+zero)
  ggrid.stroke()
}
function newGraph(name, col, y, h, zero, gridsize){
  var pos = y+h +zero
  var lastY=0;
  if (gridsize) drawgrid(50,y,700,h,gridsize, zero)
  ggrid.fillStyle=col
  ggrid.fillText(name,gridsize?55:140,y-6)

  return function( Y ){
    graph.strokeStyle=col
    graph.beginPath()
    graph.moveTo(needle,lastY +pos)
    graph.lineTo(needle+1,Y +pos)
    graph.stroke()
    lastY=Y
  }
}

plotLead = newGraph("lag / lead (ms)", "green", 20, 180, -90, 20)
plotBuff = newGraph("buffer", "cyan", 220, 50, 0, 10)
plotRolb = newGraph("rollback buffer", "red", 220, 50, 0)
plotSnTc = newGraph("synctick", "teal", 290,40, 0, 20)
plotPing = newGraph("ping (ms)", "white", 350, 140, 0, 20)
plotSync = newGraph("framesync (ms)", "orange", 350,140,-20)

function doStats(t){
  animFrameRateCount+=(t-lastAnimationFrame);
  if (++animFrameRateSample >= rateAveragingPeriod) {
    animFrameRate = rateAveragingPeriod*1000/animFrameRateCount
    animFrameRateCount=0
    animFrameRateSample=0
    if (nextFrame>gameFrameCount) {
      gameFrameRate = (frameNumber-gameFrameSample)*1000/(nextFrame-gameFrameCount)
      gameFrameCount = nextFrame
      gameFrameSample = frameNumber
    }
  }

  let lead = leadStack.length? avg(leadStack) : 0;
  let ping = pingStack.length? avg(pingStack) : 0;

  graph.clearRect(needle,0,4,600)

  plotLead(lead)
  plotBuff(-yoInputs.length*5)
  plotRolb(-rollbackInputs.length*5)
  plotSnTc(synctick*3)
  plotPing(-ping)
  plotSync(Math.min(20,(t-nextFrame)*5))

  if (++needle>=750) needle=50

  let p="ping: " +ping.toFixed(3) + "ms\n"
       +"lead: " +lead.toFixed(3) + "ms\n"
       +"framesync: "+(nextFrame-t).toFixed(3)+"ms\n"
       +"Display FPS: "+animFrameRate.toFixed(3)
       +"\nGame FPS: "+gameFrameRate.toFixed(3)
       +"\nbuffer: "+"\u25a0 ".repeat(yoInputs.length);
  if (yoInputs.length<bufferSize) p+="\u25a1 ".repeat(bufferSize-yoInputs.length)
  p+= "\nrollback buffer: "+ (rollbackInputs.length?"\u25a0 ".repeat(rollbackInputs.length):"");
  document.getElementById("stats").innerHTML = p
}

