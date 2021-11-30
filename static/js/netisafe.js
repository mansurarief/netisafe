$(document).ready(function(){
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
function doneTyping() {
    var val1 = "The current user";
    var val2 = myInput.value;
   $.ajax({
    url: "/fetch_post",
    type: "get",
    data: {val1: val1, val2:val2},
    success: function(response) {
        alert(JSON.stringify(response))
    }           
      })
};
});

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

function showComment(post_id) {
  console.log(post_id);
  var commentboxComponent = document.getElementById("comments_for_"+post_id);
  if (commentboxComponent.style.display == 'none'){
    console.log('activate');
    commentboxComponent.style.display = 'block';
  } else {
    commentboxComponent.style.display = 'none';
    console.log('hide');
  }  
}

var rendered = '';

function render_comments(post_data){
  var template_comments = `
  <!-- comments begin-->                  
    <div class="post__comments">
      {{#comments}}
      <div class="comment">            
        <div class="comment__top">
          <img
            class="user__avatar post__avatar"
            src={{avatar_img}}
            alt=""
          />
          <div class="comment__main">
            <h3>{{user_fullname}}</h3>  
            <p class="netisafe" style="display:block;">{{message}}</p>     
          </div>
        </div>
        <div class="comment__options">
          <p>Like   &#183; Comment &#183; {{time_ago}}</p>
        </div> 
      <!---a comment ends -->
      </div>
      {{/comments}}
      <div class="comment">            
        <div class="comment__top">
          <img
            class="user__avatar post__avatar"
            src={{avatar_img}}
            alt=""
          />            
          <div class="comment__input">
              <input class="messageSender__input" id="post_comment_{{id}}" placeholder="What's on your mind?" type="text" />
              <button class="comment_button" onclick="post_comment({{id}})">Post comment</button>
          </div>      
        </div>                            
      </div>
      <!---a comment ends -->          
    </div>
    <!---comments ends -->
  `;   
  rendered = Mustache.render(template_comments, post_data);  
}

function post_comment(post_id){
  var new_comment = document.getElementById('post_comment_'+post_id).value
  var user_fullname = document.getElementById('user_fullname').value
  var avatar_img = document.getElementById('user_avatar_img').value
  console.log(post_id);
  $.ajax({
    url: "/add_comment",
    type: "get",
    data: {user_fullname: user_fullname, avatar_img:avatar_img, post_id:post_id, message:new_comment},
    success: function(response) {                           
      render_comments(response);
      document.getElementById("comments_for_"+post_id).innerHTML =rendered;
      document.getElementById('post_comment_'+post_id).value = "";
    },
   });
}

    
