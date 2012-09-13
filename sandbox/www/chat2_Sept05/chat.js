var conn = new Strophe.Connection('http://localhost:8000/http-bind/');

function showLog(m) {
    $('#received').append(m + '\n');
}
function randName() {
    return Math.floor(Math.random() * 1000) + '';
}
function login(name) {
    name = name + '@localhost';
    $(document).trigger('connect', [name]);
    console.debug('login:' + name);
}

function checkStatus(status) {
    if(status == Strophe.Status.CONNECTED)
        $(document).trigger('connected')
    else if(status == Strophe.Status.DISCONNECTED)
        $(document).trigger('disconnected')
}

function myHandler(m) {
    var $m = $(m);
    var text = $m.find('body').text();
    if(text.substr(0, 2) == 'up') {
        var top = $('body').scrollTop();
        $('body').animate({
            scrollTop: top -50 
        }, 400);
    } else if(text.substr(0, 2) == 'dn') {
        var top = $('body').scrollTop();
        console.debug('scrolling', top)
        $('body').animate({
            scrollTop: top + 50 
        }, 400);
    }
    $('#received').append(text + '<br>');
    return true;
}
function send() {
    var to = ($('#to').val().concat("@localhost"));
    var msg = $('#message').val();

    console.debug('to=', to);
    console.debug('msg=', msg);
    
    //building stanza
    var stanza = $msg({to: to, type: 'chat'}).c('body').t(msg);
    
    //sending stanza
    conn.send(stanza);
};

function registerEvents() {
    /*
     * XMPP related events
     */
    $(document).bind({
        'connect': function(e, name) {
            conn.connect(name, '', checkStatus);
            conn.addHandler(myHandler, null, 'message');
        },
        'connected': function() {
            conn.send($pres());
        },
        'disconnected': function() {
            conn = null;
            showLog('disconnected');
        }
    });

    /*
     * UI events
     */
    $('#logout').click(function(e) {
        conn.disconnect();
    });
    $('#message').bind('keyup', function(e) {
        if(e.which == 13) {
            send()
            $(this).val('');
        }
    });
}


$(document).ready(function() {
    registerEvents();

    var name = randName();
    $('#name').text(name);
    login(name);

    /* Make Big List */
    var ul = $('<ul>').appendTo('body');
    var i;
    for(i=0; i < 200; i ++) {
        ul.append($('<li>').text('item:' + i));
    }
});
