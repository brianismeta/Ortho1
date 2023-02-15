

setup = {
     onopen: function(){
        console.log("setup.onopen");
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
        console.log("setup.onclose");
       connected=false;
       debuglog.innerHTML = '[ disconnected &mdash; refresh to play again ]'
       debuglog.style.display='inline-block';
   
     },
     onmessage:function(e) {
        //console.log("Received peer data: " + JSON.stringify(e));
   
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
   
   
   
   
   
   
   
   