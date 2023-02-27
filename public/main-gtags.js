window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-SY5E4RP4NV');

function track_click_connect() {
     gtag('event', 'click_connect', {
          'event_category': 'game_main'
        });
}
function track_switch_chain() {
     gtag('event', 'click_switchchain', {
          'event_category': 'game_main'
        });
}
function track_click_play() {
     gtag('event', 'click_play', {
          'event_category': 'game_main'
        });
     
}
function track_create_game() {
gtag('event', 'host_click_creategame', {
     'event_category': 'main_game'
   });
}
function track_start_game() {
     gtag('event', 'host_click_startgame', {
          'event_category': 'main_game'
     });

}
function track_guest_ready() {
     gtag('event', 'guest_click_readygame', {
          'event_category': 'main_game'
     });

}
function track_guest_join() {
     gtag('event', 'guest_click_joingame', {
          'event_category': 'main_game'
        });
     
}
function track_guest_code() {
     gtag('event', 'guest_click_getcode', {
          'event_category': 'main_game'
        });
  
}