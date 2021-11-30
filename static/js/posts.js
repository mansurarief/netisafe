$(document).ready(function(){
  $('.messageSender').on('click', '.get_result', function(){
     var val1 = "The current user";
     var val2 = $("#user_post_msg").val();
     $.ajax({
      url: "/fetch_post",
      type: "get",
      data: {val1: val1, val2:val2},
      success: function(response) {            
        const PostItem = ({ id, message, user_fullname, avatar_img, date_text}) => `
        <!-- post starts -->
        <div class="post" id="${id}">
          <div class="post__top">
            <img
              class="user__avatar post__avatar"
              src=${avatar_img}
              alt=""
            />
            <div class="post__topInfo">
              <h3>${user_fullname}</h3>
              <p>${date_text}</p>
            </div>
          </div>

          <div class="post__bottom">
            <p>${message}</p>       
            <div id="badges-${id}"></div>
          </div>


          <div class="post__options">
            <div class="post__option">
              <span class="material-icons"> thumb_up </span>
              <p>Like</p>
            </div>

            <div class="post__option">
              <span class="material-icons"> chat_bubble_outline </span>
              <p>Comment</p>
            </div>

            <div class="post__option">
              <span class="material-icons"> near_me </span>
              <p>Share</p>
            </div>
          </div>

        </div>
        <!-- post ends -->
        `;

        $('.new_posts').html([response].map(PostItem).join('')); 
        var badge_id = 'badges-'+response.id;
        
        var badges_element = document.getElementById(badge_id);

        for(var key in response.pred){
          if (response.pred[key] > 0.7) {
            var badge_class = "badge-selected";
          } else if (response.pred[key] > 0.1) {
            var badge_class = "badge-common";
          } else {
            var badge_class = "badge-new-default";
          }
          

          badge_content = '<span class="'+badge_class+'" id="'+key+'-'+response.id+'">'+key+' : '+response.pred[key]+'</span>';

         badges_element.innerHTML = badges_element.innerHTML + badge_content;
        }
        


      },
     });
  });
});  