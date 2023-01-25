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
ballSpeedIncrement = 0.1;

ball={x:0,y:-20,speed:0,hspeed:0,vspeed:0}

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


// Animation frame FPS could be different at each end, so don't rely on it for any timing.
draw=function(t){
  ctx.clearRect( 0,0,w,h)

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

function resetBall(){
  // choose a random angle in a 90deg cone facing one of the players
  let angle, pi=Math.PI;
  angle= rng()*pi/2-pi/4;
  if (rng()>0.5) angle+=pi;

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
      send({type:"version", version})
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
      case "version":
        if (data.version != version) {
          if (host) send({type:"version", version}) //force the other player to also throw this error
          alert("Version mismatch! Please refresh the page and try again")
          DC.dc.close()
        } else send({type:"SYN"})
        break;
      case "SYN":
        send({type:"SYNACK"})
        break;
      case "SYNACK":
        // repeatedly send start condition to establish average ping time
        if (pingStack.length < stacksize) send({type:"SYN"})
        else {
          pingStack.shift() // The first is usually unrepresentative, throw away
          let halftrip = avg(pingStack)/2

          bufferSize = (bufsize.value=="Auto") ? Math.min(5,Math.ceil(halftrip/frameLength)) : Number(bufsize.value);
          initBuffer()
          ballStartSpeed = Number(ballspeed.value)
          // ballSpeedIncrement = Number(ballSpeedIncrement.value);
          imgid = getBackgroundImage();
          send({type:"ACK", seed, bufferSize, ballStartSpeed, imgid })

          // wait for half the roundtrip time before starting the first frame
          nextFrame = performance.now() + halftrip
          setTimeout(processFrame, nextFrame - performance.now())
        }
        break;
      case "ACK":
        seed=data.seed
        bufferSize = data.bufferSize
        ballStartSpeed = data.ballStartSpeed
        // set background image
        setBackgroundImage(data.imgid);
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
  send({type:"input", input:myinput, delay})

  let framesync = now-lastAnimationFrame-synctick;
  if (framesync<2 || framesync>15) synctick=-4;
  else synctick=0

  if (connected) setTimeout(processFrame, delay + synctick)
}

function processGameLogic(myInput,yoInput){
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
      ball.hspeed = Math.cos(angle)*ball.speed
      ball.vspeed = Math.sin(angle)*ball.speed
      ball.x++
    }
    else if (Math.round(ball.x+ballSize/2) == Math.round(right.x-paddleW/2+1) && vcollision(right)) {
      ball.speed = ball.speed + ball.speedIncrement;
      let angle = Math.atan2(ball.y-right.y, -15)
      ball.hspeed = Math.cos(angle)*ball.speed
      ball.vspeed = Math.sin(angle)*ball.speed
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
  DC.host(setup);
  //  setup, id=> {
  //   document.querySelector('#divCreateGameOptions h2').innerHTML = 'ID: '+ id
  // });
  divCreateGameOptions.style.display='block'
  divHomeActionButtons.style.display='none'
  host=true;
}

joinBtn1.onclick = function(){
  divJoinBox.style.display='block'
  divHomeActionButtons.style.display='none'
  // conid.value = DC.id ? DC.id:"";
  scpice.focus()
}
joinBtn2.onclick = function(){
  //DC.join( parseInt(conid.value), scpice.value, setup );
  DC.joinRoom(setup);
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
     "", // image zero
     "pexels-caio-62645.jpg", 
     "pexels-ekrulila-2615285.jpg", 
     "pexels-elina-sazonova-1876580.jpg",
     "pexels-hert-niks-3224113.jpg",
     "pexels-julia-volk-5272995.jpg",
     "pexels-julia-volk-5273000.jpg",
     "pexels-lisa-fotios-3341054.jpg",
     "pexels-markus-spiske-127723.jpg",
     "pexels-min-an-1006094.jpg",
     "pexels-miquel-rossello-calafell-3061171.jpg",
     "pexels-pixabay-161913.jpg",
     "pexels-pixabay-208598.jpg",
     "pexels-pixabay-208674.jpg",
     "pexels-rachel-claire-4819830.jpg",
     "pexels-rudolf-kirchner-831082.jpg"
];

function getBackgroundImage() {
     var imgid = document.getElementById("bkimg").value;
     return imgid;
}
function setBackgroundImage(imgid) {
     //var imgid = document.getElementById("bkimg").value;
     document.body.style.backgroundImage = "url("+imgs[imgid]+")";
     document.body.style.backgroundSize = "cover";
}

window.onload=window.onresize=function(){
  scaleFactor=Math.max(1,w/(window.innerWidth-16),h/(window.innerHeight*0.98))
  document.getElementById("bkimg").addEventListener("change",()=>{
          //alert("change!");
          var imgid = document.getElementById("bkimg").value;
          document.body.style.backgroundImage = "url("+imgs[imgid]+")";
          document.body.style.backgroundSize = "cover";
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

