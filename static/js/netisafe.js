
//setup before functions
var typingTimer;                //timer identifier
var doneTypingInterval = 5000;  //time in ms (5 seconds)
var myInput = document.getElementById('user_post_msg');

//on keyup, start the countdown
myInput.addEventListener('keyup', () => {
    clearTimeout(typingTimer);
    if (myInput.value) {
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
});

//user is "finished typing," do something
function doneTyping () {
    var val1 = "The current user";
    var val2 = myInput.value;
   $.ajax({
    url: "/fetch_post",
    type: "get",
    data: {val1: val1, val2:val2},
    success: function(response) {
        alert(JSON.stringify(response))
    }           
      });
}

function toggleNetisafe() {

var netisafeComponent = document.getElementsByClassName('netisafe');

for (var i = 0; i < netisafeComponent.length; i ++) {
  if (netisafeComponent[i].style.display == 'none'){
    console.log('activate');
    netisafeComponent[i].style.display = 'block';
  } else {
    netisafeComponent[i].style.display = 'none';
    console.log('hide');
  }
}
}

