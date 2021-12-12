$(document).ready(function(){
  var avatar_img = document.getElementById('user_avatar_img').value;
  var user_fullname = document.getElementById('user_fullname').value;
});

var template_post = `
<!-- post starts -->
<div class="post">

  <div class="post__top">
    <img class="user__avatar post__avatar" src={{avatar_img}} alt=""/>
    <div class="post__topInfo">
      <h3>{{user_fullname}}</h3>
      <p>{{date_text}}</p>
    </div>
  </div>

  <div class="post__bottom">
    <p class="netisafe" style="display:none; padding:10px 0px;">{{message}}</p>
    {{#filter_status}}
    <!-- filtering starts -->
    <div class="netisafe filter_box">      
      <span class="post__warning">{{message}}</span>
      <div class="tooltip" >
        <span>Why?</span>
        <span style="font-size:x-small;" class="material-icons tooltip_icon">info</span>
        <span class="tooltiptext tooltip-top">We enable users to filter toxic contents from their social media and create a healthier digital platform. You can still show the content by clicking "Show post ..." button in the right if you so decide. </span>
      </div> 

      <label class="collapse" for="filter_{{filtered_id}}">Show post ... </label>
      <input id="filter_{{filtered_id}}" type="checkbox">
      
      <div class="post__filtered">
        <!-- explanation starts -->
        <div class="post__explanation">
          {{#pred_expl}}
          <div class="expl_word expl_score_{{category}}">
              <u>{{word}}</u>
              <div class="expl_score" style="display:none;">
                ({{category}})
              </div>
          </div>
          {{/pred_expl}}

          <div class="tooltip" >What is this? <span style="font-size:x-small;" class="material-icons tooltip_icon">info</span>
            <span class="tooltiptext tooltip-top">The contribution of each underlined word (if any) in the sentence/paragraph as a whole that drives toxicity score predicted by the AI model (red = high, blue = moderate, gray = low)</span>
          </div>        
        </div> <!-- explanation ends -->
      </div> 
    </div> <!-- filtering ends -->      
    {{/filter_status}}

    {{^filter_status}}        
    <!-- filtering starts -->      
    <div class="netisafe nonfilter_box post__filtered"> 
      <div class="post__explanation netisafe" style="display:block;">
        {{#pred_expl}}
        <div class="expl_word expl_score_{{category}}">
            <u>{{word}}</u>
            <div class="expl_score" style="display:none;">
              ({{category}})
            </div>
        </div>         
        {{/pred_expl}}        
        <div class="tooltip" >
          <span>What is this?</span>
          <span style="font-size:x-small;" class="material-icons tooltip_icon">info</span>
          <span class="tooltiptext">The contribution of each underlined word (if any) in the sentence/paragraph as a whole that drives toxicity score predicted by the AI model (red = high, blue = moderate, gray = low)</span>
        </div>  
      </div>
      <p></p>    
    </div><!-- filtering ends -->   
    {{/filter_status}}

    <div class="predictions netisafe" style="display:block;">
      {{#main_pred}}
      <span class="badge-{{category}}">
        {{class}} : {{category}}
      </span>
      {{/main_pred}}

      {{#other_pred}}
      <span class="badge-{{category}}">
        {{class}} : {{category}}
      </span>
      {{/other_pred}}

      <div class="tooltip" >
        <span>How Netisafe predicts these?</span>
        <span style="font-size:x-small;" class="material-icons tooltip_icon">info</span>
        <span class="tooltiptext tooltip-top">The system directly converts your post into a vector representation, passes it into a  pretrained machine learning model, and returns the score for each toxicity category. We do not store your social media posts in our system.</span>
      </div> 
    </div>

    <div class="post__options">
      <div class="post__option">
        <span class="material-icons"> thumb_up </span>
        <span>Like</span>
      </div>
      <div class="post__option">
        <a class="flex" onclick="showComment({{id}})">
          <span id=""class="material-icons"> chat_bubble_outline </span>
          <span>Comment</span>
        </a>
      </div>
      <div class="post__option">
        <span class="material-icons"> near_me </span>
        <span>Share</span>
      </div>
    </div><!-- post__options ends -->   
  </div><!-- post__bottom ends -->   

  <!-- comments begin-->          
  <div id="comments_for_{{id}}"  class="post__comments" style="display:block;">
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
          <p class="netisafe" style="display:none;">{{message}}</p>
          
          {{#filter_status}}
          <div class="netisafe filter_box"><!-- filtering starts-->          
            <span class="post__warning">{{message}}</span>

            <div class="tooltip" >
              <span>Why?</span>
              <span style="font-size:x-small;" class="material-icons tooltip_icon">info</span>
              <span class="tooltiptext">We enable users to filter toxic contents from their social media and create a healthier digital platform. You can still show the content by clicking "Show comment ..." button in the right if you so decide. </span>
            </div>

            <label class="collapse" for="filter_comment_{{filtered_id}}">Show comment ... </label>
            <input id="filter_comment_{{filtered_id}}" type="checkbox">

            <div class="post__filtered">
              <div class="post__explanation netisafe" style="display:block;">
                {{#pred_expl}}
                <div class="expl_word expl_score_{{category}}">
                    <u>{{word}}</u>
                    <div class="expl_score" style="display:none;">
                      ({{category}})
                    </div>
                </div>         
                {{/pred_expl}}
                <div class="tooltip" >
                  <span>What is this?</span>
                  <span style="font-size:x-small;" class="material-icons tooltip_icon">info</span>
                  <span class="tooltiptext tooltip-top">The contribution of each underlined word (if any) in the sentence/paragraph as a whole that drives toxicity score predicted by the AI model (red = high, blue = moderate, gray = low)</span>
                </div>  
              </div><!-- explanation ends-->          
            </div>
          </div><!-- filtering ends-->  
          {{/filter_status}}
          {{^filter_status}}
          <div class="netisafe nonfilter_box post__filtered"><!-- filtering starts-->          
            <div class="post__explanation netisafe" style="display:block;">
              {{#pred_expl}}
              <div class="expl_word expl_score_{{category}}">
                  <u>{{word}}</u>
                  <div class="expl_score" style="display:none;">({{category}})</div>
              </div>         
              {{/pred_expl}}

              <div class="tooltip" >What is this? <span style="font-size:x-small;" class="material-icons tooltip_icon">info</span>
                <span class="tooltiptext tooltip-top">The contribution of each underlined word (if any) in the sentence/paragraph as a whole that drives toxicity score predicted by the AI model (red = high, blue = moderate, gray = low)</span>
              </div>
            </div><!-- explanation ends-->  
          </div><!-- filtering ends-->  
          {{/filter_status}}                            
          <p></p>

          <div class="predictions netisafe" style="display:block;">
            {{#main_pred}}
            <span class="badge-{{category}}">
              {{class}} : {{category}}
            </span>
            {{/main_pred}}

            {{#other_pred}}
            <span class="badge-{{category}}">
              {{class}} : {{category}}
            </span>
            {{/other_pred}}

            <div class="tooltip">
              <span>How Netisafe predicts these?</span>
              <span style="font-size:x-small;" class="material-icons tooltip_icon">info</span>
              <span class="tooltiptext tooltip-top">The system directly converts your post into a vector representation, passes it into a  pretrained machine learning model, and returns the score for each toxicity category. We do not store your social media comments in our system.</span>
            </div>
          </div><!-- prediction ends-->                
        </div><!-- comment__main ends-->
      </div><!---comment__top ends -->       

      <div class="comment__options">
        <p>Like   &#183; Comment &#183; {{time_ago}}</p>
      </div> 

    </div><!---a comment ends -->
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
            <button class="comment_button netisafe_button" onclick="post_comment({{id}})">Post comment</button>
        </div>  
      </div><!---comment__top ends -->       
    </div><!---a comment ends --> 

  </div><!---comments ends -->
</div><!-- post ends -->
`;


function render_mustache(post_data){      
      rendered = Mustache.render(template_post, post_data) + rendered;
    }

    var rendered = '';

    function post_new_post() {
      var new_post = document.getElementById('user_post_msg').value
      var user_fullname = document.getElementById('user_fullname').value
      var avatar_img = document.getElementById('user_avatar_img').value

      $.ajax({
          url: "/new_post",
          type: "get",
          data: {val1: user_fullname, val2:new_post, val3: avatar_img},
          success: function(response) {   
            get_post(response);
            document.getElementById('user_post_msg').value = "";
          },
        });
    }

    function attach_post_to_target(post_data, target) {
      rendered = document.getElementById(target).innerHTML;
      render_mustache(post_data);
      document.getElementById(target).innerHTML = rendered;
    }

    function get_post(post_file) {    
      var post;    
      $.ajax({
        url: "/get_post",
        type: "get",
        data: {post_file: post_file},
        success: function(response) {
          attach_post_to_target(response, 'target');
        },
       });      
    }    