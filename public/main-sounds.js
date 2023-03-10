var arrSounds = new Array(10);

function SoundObj(src) {
     this.sound = document.createElement("audio");
     this.sound.src = src;
     this.sound.setAttribute("preload", "auto");
     this.sound.setAttribute("controls", "none");
     this.sound.style.display = "none";
     document.body.appendChild(this.sound);
     this.play = function(){
         this.sound.play();
     }
     this.stop = function(){
         this.sound.pause();
     }    
 }
 function initSounds() {
 for (var i=0; i<10; i++) {
     arrSounds[i] = new SoundObj("sounds/"+i+".wav");
 }
}
function adjustBounceSound(speed) {
     if (speed < 3.6)
     return 0;
     if (speed < 4.3)
     return 1;
     if (speed < 5)
     return 2;
     if (speed < 5.6)
     return 3;
     if (speed < 6.3)
     return 4;
     if (speed < 7)
     return 5;
     if (speed < 7.6)
     return 6;
     if (speed < 8.3)
     return 7;
     if (speed < 9)
     return 8;
     return 9;
}
 
