var index = {
	    connection:null,
	    showLog: function (msg){
		$('#received').append(msg + '\n');
		}
	    };
var conn = new Strophe.Connection('http://localhost:8000/http-bind/');
var myRand = Math.floor(Math.random()*10000);

//function random number display
this.randNum = function(){
   //var myRand = Math.floor(Math.random()*10000);
   $('#rand').append(myRand);
};

//log in function
this.login = function(){
   
   var newLogIn = (myRand.toString()).concat("@localhost"); 
   $(document).trigger('connect',{
        login_name: newLogIn 
     });
   console.debug('Login_ID: ' + newLogIn);
};

$(document).ready(function() {

  //random number
  randNum();

  //Log In 
  login();
  

  /*$('#login_btn').click(function(e){
     console.debug('click_finction');
     $(document).trigger('connect',{
        login_name: $('#login_id').val()
     });
   });*/

   $('#logout').click(function(e) {
       
       conn.disconnect();
       
     });

   $('#send_btn').click(function(e) {
       //var to = $('#to').val();
       var to = ($('#to').val().concat("@localhost"));
       var msg = $('#message').val();

       console.debug('to=', to);
       console.debug('msg=', msg);
	    
       //building stanza
       var stanza = $msg({
           to: to,
           type: 'chat'
            })
           .c('body')
           .t(msg);
	    
       //sending stanza
       conn.send(stanza);
    });

});

$(document).bind('connect', function (e, data){
   
   conn.connect(data.login_name, '', checkStatus);
   conn.addHandler(myHandler, null, 'message');
   

   function checkStatus(status) {
	if(status === Strophe.Status.CONNECTED) {
            console.debug('CONNECTED');
            $(document).trigger('connected');
	    }
        else if(status === Strophe.Status.DISCONNECTED){
            console.debug('DISCONNECTED:', status, Strophe.Status);
	    $(document).trigger('disconnected');	   
 	     }
	}//checkStatus
    index.connection = conn;

    function myHandler(msg) {
         console.debug('message received', msg);
         var $msg = $(msg);
         $('#received').append($msg.find('body').text(), $('<br>'));
	 return true;
         }
   
    

});

$(document).bind('connected', function() {
    index.connection.send($pres());
    index.showLog('Login successful');
});

$(document).bind('disconnected', function() {
    index.showLog('Connection logged out');
    index.connection = null;
});

