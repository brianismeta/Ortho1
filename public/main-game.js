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

version=230301 // increment whenever the game logic changes

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
   
   drawInitialGame=function(t){
        ctx.clearRect( 0,0,w,h)
      
          ctx.fillRect( left.x - paddleW/2, left.y - paddleH/2, paddleW, paddleH)
          ctx.fillRect( right.x - paddleW/2, right.y - paddleH/2, paddleW, paddleH)
        //   for (let i=13;i<h;i+=27) ctx.fillRect( w/2-5,i, 10,10)
        //if (connected) requestAnimationFrame(drawInitialGame)
      }
      
   var one_time_log_game_ended = false;
   // Animation frame FPS could be different at each end, so don't rely on it for any timing.
   draw=function(t){
     ctx.clearRect( 0,0,w,h)
   
     if (gameEnded) {
        var saveColor = ctx.fillStyle;
        ctx.fillStyle = leftWinner? "#03AD09":"#D11638";
        ctx.fillRect(0,0,w/2,h);
        ctx.fillStyle = leftWinner?"#D11638":"#03AD09";
        ctx.fillRect(w/2,0,w,h);
        ctx.fillStyle = saveColor;
        if (! one_time_log_game_ended ) { // draw keeps going... how to stop it????
             one_time_log_game_ended = true;
             MetaLog.log("*********************************");
             MetaLog.log("*********************************");
             MetaLog.log("*********************************");
             MetaLog.log("          GAME ENDED!");
             MetaLog.log("*********************************");
             MetaLog.log("*********************************");
             MetaLog.log("*********************************");

          // unhide buttons
          //recordScoreBtn
          recordScoreBtn.classList.remove("d-none");
          viewHistoryBtn.classList.remove("d-none");
          //viewHistoryBtn


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
             //MetaLog.log("Fixed angle from " + myangle + " to " + ret);
             return ret;// lb;
        } else if (myangle >= mb && myangle < hb) {
             ret= pi - rng()*cntn;
             //MetaLog.log("Fixed angle from " + myangle + " to " + ret);
             return ret; //hb;
        }
        lb = 5*pi/4; //11*pi/8;
        mb = 3*pi/2;
        hb = 7*pi/4; //13*pi/8;
        if (myangle > lb && myangle < mb) {
             ret= pi + rng()*cntn;
             //MetaLog.log("Fixed angle from " + myangle + " to " + ret);
             return ret;// lb;
        } else if (myangle >= mb && myangle < hb) {
             ret= 2*pi - rng()*cntn;
             //MetaLog.log("Fixed angle from " + myangle + " to " + ret);
             return ret; //hb;
        }
        return myangle;
   }
   function resetBall(){
   
     MetaLog.log("Ball reset to center");
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
     //MetaLog.log("Angle start: " + angle);
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
   function initBuffer(){
     frameNumber = -bufferSize;
     for (let i=0;i<bufferSize;i++) {
       myInputs.push( { frame:frameNumber, dir:0 } )
       yoInputs.push( { frame:frameNumber, dir:0 } )
       frameNumber++
     }
   }
   
   var game_ended_localized_date_string;

   function processFrame(){
   // this is the key game loop -- if game ends, need to break this loop.
   
   if (scoreLeft >=3 || scoreRight >= 3) {
        if (scoreLeft > scoreRight) {
             gameEnded = 1;
             leftWinner = 1;
        } else if (scoreRight > scoreLeft) {
             gameEnded = 1;
             rightWinner = 1;
        }
        const date = new Date();
        game_ended_localized_date_string = date.toLocaleString();
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
   
     if (myInput.frame != yoInput.frame) {MetaLog.log("SYNC ERROR AHHH", myInput,yoInput); return}
   
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
       //MetaLog.log('timing disrupted')
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
         //MetaLog.log("Angle is now " + angle);
         ball.x++
       }
       else if (Math.round(ball.x+ballSize/2) == Math.round(right.x-paddleW/2+1) && vcollision(right)) {
         ball.speed = ball.speed + ball.speedIncrement;
         let angle = Math.atan2(ball.y-right.y, -15)
         // limit angle to within 50 degrees of x-axis.
         angle = FixAngle(angle);
         ball.hspeed = Math.cos(angle)*ball.speed
         ball.vspeed = Math.sin(angle)*ball.speed
         //MetaLog.log("Angle is now " + angle);
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
     MetaLog.log(...e)
     e[1]=JSON.stringify(e[1])
     document.getElementById("debuglog").innerHTML += e.join(" ")+"\n"
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

         