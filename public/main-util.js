const MiscUtilities = {

     read_local_storage: function(vartype,varname,defaultvalue) {
          if (vartype == 'bool') {
               if (defaultvalue == 'true')
                    defaultvalue = '1';
               else if (defaultvalue == 'false')
                    defaultvalue = '0';
               else {
                    defaultvalue = parseInt(defaultvalue) >0?'1':'0';
               }
          } else if (vartype == 'int') {
               defaultvalue = parseInt(defaultvalue).toString();
          } // otherwise assume string

          var _val = window.localStorage.getItem(varname);
          if (_val == null) {
               window.localStorage.setItem(varname,defaultvalue);
               _val = defaultvalue;
          }
          if (vartype == 'int') {
               _val = parseInt(_val);
          } else if (vartype == 'bool') {
               _val = parseInt(_val)>1?true:false;
          }
          return _val;
     },


     save_local_storage: function(varname,varvalue) {
          window.localStorage.setItem(varname, varvalue);
     },

     MetaLog: {
          logconsole:0,
          init: function() {
               this.logconsole = MiscUtilities.read_local_storage('int','logconsole','0');
          },
          log: function(s) {

               s = MiscUtilities.dateHelper(new Date()).formatPadded + ": " + s;

               if (console && (this.logconsole ==1)) console.log(s);
          },
          error: function(s) {
               if (console && (this.logconsole ==1)) console.error(s);
          }
     },

     PeerJSLog: {
          IsEnabled: function() {
               return  MiscUtilities.read_local_storage('int','logpeerjs','0');
          }
     },

     Sound: {
          IsEnabled: function() {
               return  MiscUtilities.read_local_storage('int','sound','0');
          }
     },

     PacketLog: {
          logpackets: 0,
          init: function() {
               this.logpackets = MiscUtilities.read_local_storage('int','logpackets','0');

          },
          log: function(s) {
               if (console &&  (this.logpackets ==1)) console.log(s);
          },
          error: function(s) {
               if (console &&  (this.logpackets ==1)) console.error(s);
          }
     },

     ShowCriticalError: function(sMessage,fHtml) {
          if (fHtml)
               debuglog.innerHTML = "[ " + sMessage + " ]";
          else
               debuglog.innerText = "[ " + sMessage + " ]";

          debuglog.style.visibility='visible';
     },     

     HideCriticalError: function() {
          debuglog.innerHTML = ''
          debuglog.style.visibility='hidden';
     },     

     //dateHelper(new Date()).formatPadded

     dateHelperFactory: function() {
     const padZero = (val, len = 2) => `${val}`.padStart(len, `0`);
     const setValues = date => {
     let vals = {
          yyyy: { value: date.getFullYear() },
          m: { value: date.getMonth()+1 },
          d: { value: date.getDate() },
          h: { value: date.getHours() },
          mi: { value: date.getMinutes() },
          s: { value: date.getSeconds() },
          ms: { value: date.getMilliseconds() }, };
     Object.entries(vals).forEach( ([k, val]) => 
          val.padded = padZero(val.value, k === `ms` && 3 || 2) );
     return vals;
     };
     
     return date => {
     const dateValues = setValues(date);
     return {
          get paddedValues() { return Object.values(dateValues).map(v => v.padded); },
          get cleanValues() { return Object.values(dateValues).map(v => v.value); },
          get all() { return dateValues; },
          get splitDatePadded() {
          const paddedValues = [...this.paddedValues];
          return [ 
               paddedValues.splice(0, 3),
               paddedValues.splice(0, 3),
               paddedValues.pop() ]; },
          get splitDate() {
          const cleanValues = [...this.cleanValues];
          return [ 
               cleanValues.splice(0, 3),
               cleanValues.splice(0, 3),
               cleanValues.pop() ]; },
          get formatPadded() {
          const [d, t, ms] = this.splitDatePadded;
          return `${d.join(`/`)} ${t.join(`:`)}.${ms}`;
          }
     }; 
     }
     },

     init: function() {
          this.dateHelper = this.dateHelperFactory(),
          this.MetaLog.init();
          this.PacketLog.init();
          
     },

     FixAngle: function(myangle) {
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
               //MiscUtilities.MetaLog.log("Fixed angle from " + myangle + " to " + ret);
               return ret;// lb;
          } else if (myangle >= mb && myangle < hb) {
               ret= pi - rng()*cntn;
               //MiscUtilities.MetaLog.log("Fixed angle from " + myangle + " to " + ret);
               return ret; //hb;
          }
          lb = 5*pi/4; //11*pi/8;
          mb = 3*pi/2;
          hb = 7*pi/4; //13*pi/8;
          if (myangle > lb && myangle < mb) {
               ret= pi + rng()*cntn;
               //MiscUtilities.MetaLog.log("Fixed angle from " + myangle + " to " + ret);
               return ret;// lb;
          } else if (myangle >= mb && myangle < hb) {
               ret= 2*pi - rng()*cntn;
               //MiscUtilities.MetaLog.log("Fixed angle from " + myangle + " to " + ret);
               return ret; //hb;
          }
          return myangle;
     },
     ascii_to_hexa: function(str)
  {
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	 }
	return arr1.join('');
   },

     
}

MiscUtilities.init();


const LSConfig = {

     init: function() {
          this.debugdroppedpackets = MiscUtilities.read_local_storage('bool','debugdroppedpackets','false');
          this.debugreorderedpackets = MiscUtilities.read_local_storage('bool','debugreorderedpackets','false');
          this.psign = MiscUtilities.read_local_storage('int','psign','0');
          this.saved_games = MiscUtilities.read_local_storage('string','savedGames','{"games":[]}');

          this.droppedpacketcounter = 0;
          this.maxpacketcount = 300;

          // read value in main-util.js from local storage
          //var debugreorderedpackets = false;
          this.reorderedpacketscounter = 0;
          this.maxreorderedpacketscount = 20;
          this.resendpacketdelayms = 200;

     }
}
LSConfig.init();

