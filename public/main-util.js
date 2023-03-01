function read_local_storage(vartype,varname,defaultvalue) {
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
}

function save_local_storage(varname,varvalue) {
     window.localStorage.setItem(varname, varvalue);
}

var logconsole = 0;
MetaLog = {
     init: ()=> {
          logconsole = read_local_storage('int','logconsole','0');
     },
     log: (s)=> {
          if (console && (logconsole ==1)) console.log(s);
     },
     error: (s)=> {
          if (console && (logconsole ==1)) console.error(s);
     }
}
MetaLog.init();

var logpackets = 0;
PacketLog = {
     init: ()=> {
          logpackets = read_local_storage('int','logpackets','0');

     },
     log: (s)=> {
          if (console &&  (logpackets ==1)) console.log(s);
     },
     error: (s)=> {
          if (console &&  (logpackets ==1)) console.error(s);
     }
}
PacketLog.init();

var debugdroppedpackets = read_local_storage('bool','debugdroppedpackets','false');

var debugreorderedpackets = read_local_storage('bool','debugreorderedpackets','false');

var psign = read_local_storage('int','psign','0');

var saved_games = read_local_storage('string','savedGames','{"games":[]}');

