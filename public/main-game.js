document.querySelectorAll('h1 span').forEach(a=>a.style.animationDelay=2*Math.random()+'s')

var host = false;

const gameItems = {

     connected:false,
     bufferSize : 3,

     driftThreshold : 1, //ms
     driftTrimFactor : 0.1, //
     stacksize:5, // averaging period for ping/lead times

     frameLength : 1000/60, //1000/FPS target
     nextFrame:0,
     lastAnimationFrame:0,
     synctick:0,

     gameVersion:230310, // increment whenever the game logic changes

     grabY : 0, //mouse input

     ballStartSpeed:4,
     ballSpeedIncrement : 0.25,

};

var font=new Image();
font.src="data:image/gif;base64,R0lGODlhHgAFAIAB"+btoa("\0\xe8\xe8\xe8\xff\xff")+"/yH5BAEAAAEALAAAAAAeAAUAAAIdhANom+x/WphJWTRp23h7WIEdloUaGWnpozItVQAAOw==";

const drawItems = {
     canvas: 0,
     canvasContext: 0,
     canvasW: 0,
     canvasH: 0,
     viewport: 0,
     // graph : 0,
     // ggrid : 0,
     // showstats : 0,
     frameNumber: 0,
     scaleFactor: 1,
     paddleH: 60,
     paddleW: 20,
     ball: {x:0,y:-20,speed:0,hspeed:0,vspeed:0},
     ballSize: 20,
     edgeGuard: 0,
     leftPaddle: 0,
     rightPaddle: 0,
     scoreLeft: 0,
     scoreRight: 0,
     one_time_log_game_ended: false,
     game_ended: false,
     gameEnded:0,
     leftWinner:0,
     rightWinner:0,
     init: function() {
          this.edgeGuard= this.paddleH/2+this.ballSize/2;
          this.canvas=document.getElementById("game");
          this.canvasW = this.canvas.width;
          this.canvasH = this.canvas.height;
          this.leftPaddle = {y : this.canvasH/2, x : 20};
          this.rightPaddle = {y : this.canvasH/2, x : this.canvasW-20};
          this.canvasContext=this.canvas.getContext("2d");
          this.canvasContext.imageSmoothingEnabled=false;
          this.canvasContext.shadowColor='#e8e8e8'
          this.canvasContext.shadowBlur=8;
          this.viewport=document.querySelector('meta[name="viewport"]');
          // graph=document.getElementById("graph").getContext("2d");
          // ggrid=document.getElementById("ggrid").getContext("2d");
          // showstats=document.getElementById("showstats").checked;
          this.frameNumber = -gameItems.bufferSize;
          this.canvasContext.fillStyle='#e8e8e8';
          //this.newBall();  ball will be reset at frame 102
     },
     drawInitialGame: function(t){
          this.canvasContext.clearRect( 0,0,this.canvasW,this.canvasH);
          this.canvasContext.fillRect( this.leftPaddle.x - this.paddleW/2, this.leftPaddle.y - this.paddleH/2, this.paddleW, this.paddleH)
          this.canvasContext.fillRect( this.rightPaddle.x - this.paddleW/2, this.rightPaddle.y - this.paddleH/2, this.paddleW, this.paddleH)
     },

     drawGameEnded: function() {
          var saveColor = this.canvasContext.fillStyle;
          this.canvasContext.fillStyle = this.leftWinner? "#03AD09":"#D11638";
          this.canvasContext.fillRect(0,0,this.canvasW/2,this.canvasH);
          this.canvasContext.fillStyle = this.leftWinner?"#D11638":"#03AD09";
          this.canvasContext.fillRect(this.canvasW/2,0,this.canvasW,this.canvasH);
          this.canvasContext.fillStyle = saveColor;
          if (! this.one_time_log_game_ended ) { // draw keeps going... how to stop it????
               this.one_time_log_game_ended = true;
               MiscUtilities.MetaLog.log("*********************************");
               MiscUtilities.MetaLog.log("          GAME ENDED!");
               MiscUtilities.MetaLog.log("*********************************");
  
            // unhide buttons
            recordScoreBtn.classList.remove("d-none");
            viewHistoryBtn.classList.remove("d-none");
  
          }
     },

     drawScore: function(x,score,alignRight){
          var t=score.toString(), offset=alignRight?t.length*40:0;
          for (var c in t) {
               this.canvasContext.drawImage(font, (t[c].charCodeAt(0)-0x30)*3, 0, 3,5,x+c*40-offset,20,30,50)
          }
     },

     // Animation frame FPS could be different at each end, so don't rely on it for any timing.
     draw: function(t){
          this.canvasContext.clearRect( 0,0,this.canvasW,this.canvasH)
     
          if (this.gameEnded) {
               this.drawGameEnded();
          }
          if (this.frameNumber<88) {
               for (var i=0;i<this.frameNumber/8;i++) this.canvasContext.fillRect( this.canvasW/2-5,13+i*27, 10,10),this.canvasContext.fillRect( this.canvasW/2-5,580-i*27, 10,10)
          } else {
               this.canvasContext.fillRect( this.leftPaddle.x - this.paddleW/2, this.leftPaddle.y - this.paddleH/2, this.paddleW, this.paddleH)
               this.canvasContext.fillRect( this.rightPaddle.x - this.paddleW/2, this.rightPaddle.y - this.paddleH/2, this.paddleW, this.paddleH)
               this.canvasContext.fillRect( this.ball.x-this.ballSize/2,this.ball.y-this.ballSize/2, this.ballSize, this.ballSize )
               for (var i=13;i<this.canvasH;i+=27) this.canvasContext.fillRect( this.canvasW/2-5,i, 10,10)
               this.drawScore(this.canvasW/2-45,this.scoreLeft,1)
               this.drawScore(this.canvasW/2+55,this.scoreRight)
          }
          // if (showstats) doStats(t)
          if (gameItems.connected) requestAnimationFrame(drawProxy)
          gameItems.lastAnimationFrame=t
     },

     newBall: function(angle) {
          this.ball.x=this.canvasW/2;
          this.ball.y=this.canvasH/2;
          this.ball.speed=gameItems.ballStartSpeed;
          this.ball.speedIncrement = gameItems.ballSpeedIncrement;
          this.ball.hspeed = Math.cos(angle)*this.ball.speed;
          this.ball.vspeed = Math.sin(angle)*this.ball.speed;
     
     }
   
}

drawItems.init();

function drawProxy() {
     drawItems.draw();
}

function drawInitialGameProxy() {
     drawItems.drawInitialGame();
}


//drawItems.canvas=document.getElementById("game")
//canvasContext=canvas.getContext("2d")
//drawItems.canvasW=canvas.width;drawItems.canvasH=canvas.height

//gameItems.viewport = document.querySelector('meta[name="gameItems.viewport"]');
// gameItems.graph=document.getElementById("gameItems.graph").getContext("2d")
// gameItems.ggrid=document.getElementById("gameItems.ggrid").getContext("2d")
// gameItems.showstats=document.getElementById("gameItems.showstats").checked;
// statsbox.style.display='none';//gameItems.showstats?'block':'none';
// ballspeed.oninput()

var InputStates = {

     myInputs: [],
     yoInputs: [],
     rollbackState: {},
     rollbackInputs: [],
     yoInputLastDir: 0,
     storeRollbackState: function() {
          this.rollbackState = {frame:this.myInputs[0].frame, seed, scoreLeft:drawItems.scoreLeft, scoreRight:drawItems.scoreRight, ball:objcopy(drawItems.ball), leftY:drawItems.leftPaddle.y, rightY:drawItems.rightPaddle.y}
     },
     loadRollbackState: function() {
          drawItems.leftPaddle.y=this.rollbackState.leftY
          drawItems.rightPaddle.y=this.rollbackState.rightY
          seed=this.rollbackState.seed
          drawItems.scoreLeft=this.rollbackState.scoreLeft
          drawItems.scoreRight=this.rollbackState.scoreRight
          drawItems.ball=objcopy(this.rollbackState.ball)
     },
     
};

function objcopy(o){
     var copy = {}
     for (var a in o) {
          if (o.hasOwnProperty(a)) copy[a] = o[a];
     }
     return copy
}
   
   
seed= Math.floor(Math.random()*0xFFFFFFFF);
function rng() {
     var t = seed += 0x6D2B79F5;
     t = Math.imul(t ^ t >>> 15, t | 1);
     t ^= t + Math.imul(t ^ t >>> 7, t | 61);
     return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
   
// function FixAngle(myangle) {
//      // if the angle is too close to vertical, game will get boring.
//      // check for these radian numbers and fix it.
//      // Hard game will make adjustment more towards center than Easy or Medium.
//      var pi = Math.PI;
//      if (myangle < 0) {
//           myangle += 2*pi;
//      }
//      var cntn,lb,hb,mb,ret;
//      cntn = pi/4;
//      lb = pi/4; //3*pi/8;
//      mb = pi/2;
//      hb = 3*pi/4; //5*pi/8;
//      if (myangle > lb && myangle < mb) {
//           ret= rng()*cntn;
//           //MiscUtilities.MetaLog.log("Fixed angle from " + myangle + " to " + ret);
//           return ret;// lb;
//      } else if (myangle >= mb && myangle < hb) {
//           ret= pi - rng()*cntn;
//           //MiscUtilities.MetaLog.log("Fixed angle from " + myangle + " to " + ret);
//           return ret; //hb;
//      }
//      lb = 5*pi/4; //11*pi/8;
//      mb = 3*pi/2;
//      hb = 7*pi/4; //13*pi/8;
//      if (myangle > lb && myangle < mb) {
//           ret= pi + rng()*cntn;
//           //MiscUtilities.MetaLog.log("Fixed angle from " + myangle + " to " + ret);
//           return ret;// lb;
//      } else if (myangle >= mb && myangle < hb) {
//           ret= 2*pi - rng()*cntn;
//           //MiscUtilities.MetaLog.log("Fixed angle from " + myangle + " to " + ret);
//           return ret; //hb;
//      }
//      return myangle;
// }

function resetBall(){
   
     MiscUtilities.MetaLog.log("Ball reset to center");
     // check to see if someone won the game



     // choose a random angle in a 90deg cone facing one of the players
     var angle, pi=Math.PI;
     angle= rng()*pi/2-pi/4;
     if (rng()>0.5) {
          if (angle > 0)
          angle+= -pi;
          else
          angle+=pi;
     }
     //MiscUtilities.MetaLog.log("Angle start: " + angle);
     angle = MiscUtilities.FixAngle(angle);

     drawItems.newBall(angle);
}
   
   
var timePair={t1:null,t2:null}; // of last received packet
var pingStack=[];
var leadStack=[];

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
     drawItems.frameNumber = -gameItems.bufferSize;
     for (var i=0;i<gameItems.bufferSize;i++) {
          InputStates.myInputs.push( { frame:drawItems.frameNumber, dir:0 } )
          InputStates.yoInputs.push( { frame:drawItems.frameNumber, dir:0 } )
          drawItems.frameNumber++
     }
}
   
   var game_ended_localized_date_string;

function processFrame(){
     // this is the key game loop -- if game ends, need to break this loop.

     if (drawItems.scoreLeft >=3 || drawItems.scoreRight >= 3) {
          if (drawItems.scoreLeft > drawItems.scoreRight) {
               drawItems.gameEnded = 1;
               drawItems.leftWinner = 1;
          } else if (drawItems.scoreRight > drawItems.scoreLeft) {
               drawItems.gameEnded = 1;
               drawItems.rightWinner = 1;
          }
          const date = new Date();
          game_ended_localized_date_string = date.toLocaleString();
     }
   
     if (drawItems.gameEnded)
          return;
     var yoInput,myInput;
     if (InputStates.yoInputs.length==0) {
          if (InputStates.rollbackInputs.length>=10){
               //give up and delay
               gameItems.nextFrame += 1
               if (gameItems.connected) setTimeout(processFrame,1)
                    return
          }
          if (InputStates.rollbackInputs.length==0) {
               //commence rollback
               InputStates.storeRollbackState()
          } 
          InputStates.rollbackInputs.push(InputStates.myInputs[0])

          yoInput = {frame:InputStates.myInputs[0].frame, dir:InputStates.yoInputLastDir}

     } else {
          yoInput = InputStates.yoInputs.shift()
          yoInputLastDir = yoInput.dir
     }
   
     myInput = InputStates.myInputs.shift()
   
     if (myInput.frame != yoInput.frame) {
          MiscUtilities.MetaLog.log("SYNC ERROR AHHH", myInput,yoInput);
          MiscUtilities.ShowCriticalError("data not in sync", false);
 
          return
     }
   
     processGameLogic(myInput,yoInput)
   
     // take input and add to stack
     myinput = { frame:drawItems.frameNumber, dir:gameItems.grabY*drawItems.scaleFactor }
     gameItems.grabY = 0;
     InputStates.myInputs.push( myinput )
   
     // timing drift correction - should this be before or after transmitting?
     if (leadStack.length==gameItems.stacksize) {
          var lead = -avg(leadStack)
          if (lead>gameItems.driftThreshold) { //we are running fast
               gameItems.nextFrame += Math.min(lead*gameItems.driftTrimFactor, gameItems.frameLength)
          }
     }
   
     drawItems.frameNumber++
     gameItems.nextFrame += gameItems.frameLength
   
     var now = performance.now()
     if (gameItems.nextFrame<now) {
          //MiscUtilities.MetaLog.log('timing disrupted')
          gameItems.nextFrame=now
     }
     var delay = gameItems.nextFrame - now
   
     // send inputs to other
     // if game is ended, we should not need to send inputs
     send({type:"input", input:myinput, delay})
   
     var framesync = now-gameItems.lastAnimationFrame-gameItems.synctick;
     if (framesync<2 || framesync>15) gameItems.synctick=-4;
     else gameItems.synctick=0
   
     if (gameItems.connected) setTimeout(processFrame, delay + gameItems.synctick)
   }
   
   function processGameLogic(myInput,yoInput){
        // called by processFrame and onmessage
     var oldlefty=drawItems.leftPaddle.y, oldrighty=drawItems.rightPaddle.y
   
     if (host) { processPlayer(drawItems.leftPaddle, myInput); processPlayer(drawItems.rightPaddle, yoInput); }
     else      { processPlayer(drawItems.leftPaddle, yoInput); processPlayer(drawItems.rightPaddle, myInput); }
   
     if (myInput.frame==102) resetBall(); //end of intro animation
   
     var impulses = Math.ceil(drawItems.ball.speed), step=1/impulses;
     for (var i=0;i<impulses;i++) {
   
       drawItems.ball.x += drawItems.ball.hspeed*step;
       drawItems.ball.y += drawItems.ball.vspeed*step;
   
       // bounce off top and bottom
       if ((drawItems.ball.y>drawItems.canvasH-10 && drawItems.ball.vspeed>0 )
        || (drawItems.ball.y<10   && drawItems.ball.vspeed<0 )) drawItems.ball.vspeed =-drawItems.ball.vspeed;
   
       // check for face collision with paddle
       if (Math.round(drawItems.ball.x-drawItems.ballSize/2) == Math.round(drawItems.leftPaddle.x+drawItems.paddleW/2-1) && vcollision(drawItems.leftPaddle)) {
         //reflect based on position
         drawItems.ball.speed = drawItems.ball.speed + drawItems.ball.speedIncrement;
         var angle = Math.atan2(drawItems.ball.y-drawItems.leftPaddle.y, 15)
         // limit angle to within 50 degrees of x-axis.
         angle = MiscUtilities.FixAngle(angle);
         drawItems.ball.hspeed = Math.cos(angle)*drawItems.ball.speed
         drawItems.ball.vspeed = Math.sin(angle)*drawItems.ball.speed
         //MiscUtilities.MetaLog.log("Angle is now " + angle);
         drawItems.ball.x++
         if (MiscUtilities.Sound.IsEnabled())
              arrSounds[adjustBounceSound(drawItems.ball.speed)].play();
       }
       else if (Math.round(drawItems.ball.x+drawItems.ballSize/2) == Math.round(drawItems.rightPaddle.x-drawItems.paddleW/2+1) && vcollision(drawItems.rightPaddle)) {
         drawItems.ball.speed = drawItems.ball.speed + drawItems.ball.speedIncrement;
         var angle = Math.atan2(drawItems.ball.y-drawItems.rightPaddle.y, -15)
         // limit angle to within 50 degrees of x-axis.
         angle = MiscUtilities.FixAngle(angle);
         drawItems.ball.hspeed = Math.cos(angle)*drawItems.ball.speed
         drawItems.ball.vspeed = Math.sin(angle)*drawItems.ball.speed
         //MiscUtilities.MetaLog.log("Angle is now " + angle);
         drawItems.ball.x--
         if (MiscUtilities.Sound.IsEnabled())
              arrSounds[adjustBounceSound(drawItems.ball.speed)].play();
       }
       else if (drawItems.ball.x-drawItems.ballSize/2 < drawItems.leftPaddle.x+drawItems.paddleW/2-1 && vcollision(drawItems.leftPaddle)) {
         drawItems.ball.vspeed = -drawItems.ball.vspeed
         if (drawItems.ball.y<oldlefty) drawItems.ball.y=drawItems.leftPaddle.y-drawItems.paddleH/2-drawItems.ballSize/2;
         else drawItems.ball.y=drawItems.leftPaddle.y+drawItems.paddleH/2+drawItems.ballSize/2;
       }
       else if (drawItems.ball.x+drawItems.ballSize/2 > drawItems.rightPaddle.x-drawItems.paddleW/2+1 && vcollision(drawItems.rightPaddle)) {
         drawItems.ball.vspeed = -drawItems.ball.vspeed
         if (drawItems.ball.y<oldrighty) drawItems.ball.y=drawItems.rightPaddle.y-drawItems.paddleH/2-drawItems.ballSize/2;
         else drawItems.ball.y=drawItems.rightPaddle.y+drawItems.paddleH/2+drawItems.ballSize/2;
       }
     }
   
     if (drawItems.ball.x<-drawItems.ballSize) drawItems.scoreRight++,resetBall()
     if (drawItems.ball.x>drawItems.canvasW+drawItems.ballSize) drawItems.scoreLeft++,resetBall()
   }
   
   function processPlayer(p, input){
     p.y += input.dir;
     if (p.y > drawItems.canvasH-drawItems.edgeGuard) p.y = drawItems.canvasH-drawItems.edgeGuard;
     if (p.y <   drawItems.edgeGuard) p.y = drawItems.edgeGuard;
   }
   
   function vcollision(p){
     return (drawItems.ball.y-drawItems.ballSize/2 < p.y+drawItems.paddleH/2 && drawItems.ball.y+drawItems.ballSize/2 > p.y-drawItems.paddleH/2)
   }
   
   DC.log=function(...e) {
     MiscUtilities.MetaLog.log(...e)
     e[1]=JSON.stringify(e[1])
     MiscUtilities.ShowCriticalError(e.join(" "),true);
     //document.getElementById("debuglog").innerHTML += e.join(" ")+"\n"
   }
   

   drawItems.canvas.onmousedown=function(e){
     var sy = e.pageY
     e.preventDefault()
     e.stopPropagation()
   
     document.onmousemove=function(e){
       gameItems.grabY += e.pageY - sy
       sy = e.pageY
     }
     document.onmouseup=function(e){
       document.onmouseup=null;
       document.onmousemove=null;
     }
   }
   
   touches=[];
   drawItems.canvas.ontouchstart=function(e){
     e.preventDefault()
     for (var i =e.changedTouches.length;i--;){
       var t={sy:e.changedTouches[i].pageY}
       touches[e.changedTouches[i].identifier]=t;
     }
   }
   drawItems.canvas.ontouchmove=function(e){
     e.preventDefault()
     for (var i=e.changedTouches.length;i--;){
        var t=touches[e.changedTouches[i].identifier];
        gameItems.grabY += (e.changedTouches[i].pageY - t.sy)
        t.sy=e.changedTouches[i].pageY;
     }
     if (e.touches.length>2) { //3-finger touch to reset zoom level
       drawItems.viewport.content = 'initial-scale=1';
       drawItems.viewport.content = 'width=device-width';
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


         