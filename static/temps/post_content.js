var template_post = `
<!-- post starts -->
<div class="post">

  <div class="post__top">
    <img class="user__avatar post__avatar" src={% raw %}{{avatar_img}}{% endraw %} alt=""/>
    <div class="post__topInfo">
      <h3>{% raw %}{{user_fullname}}{% endraw %}</h3>
      <p>{% raw %}{{date_text}}{% endraw %}</p>
    </div>
  </div>

  <div class="post__bottom">
    <p class="netisafe" style="display:none;">{% raw %}{{message}}{% endraw %}</p>
    {% raw %}{{#filter_status}}{% endraw %}
    <!-- filtering starts -->
    <div class="netisafe filter_box">      
      <span class="post__warning">{% raw %}{{message}}{% endraw %}</span>
      <div class="tooltip" >
        <span>Why?</span>
        <span style="font-size:x-small;" class="material-icons tooltip_icon">info</span>
        <span class="tooltiptext">We enable users to filter toxic contents from their social media and create a healthier digital platform. You can still show the content by clicking "Show post ..." button in the right if you so decide. </span>
      </div> 

      <label class="collapse" for="filter_{% raw %}{{filtered_id}}{% endraw %}">Show post ... </label>
      <input id="filter_{% raw %}{{filtered_id}}{% endraw %}" type="checkbox">
      
      <div class="post__filtered">
        <!-- explanation starts -->
        <div class="post__explanation">
          {% raw %}{{#pred_expl}}{% endraw %}
          <div class="expl_word expl_score_{% raw %}{{category}}{% endraw %}">
              <u>{% raw %}{{word}}{% endraw %}</u>
              <div class="expl_score" style="display:none;">
                ({% raw %}{{category}}{% endraw %})
              </div>
          </div>
          {% raw %}{{/pred_expl}}{% endraw %}

          <div class="tooltip" >What is this? <span style="font-size:x-small;" class="material-icons tooltip_icon">info</span>
            <span class="tooltiptext">The contribution of each underlined word (if any) in the sentence/paragraph as a whole that drives toxicity score predicted by the AI model (red = high, blue = moderate, gray = low)</span>
          </div>        
        </div> <!-- explanation ends -->
      </div> 
    </div> <!-- filtering ends -->      
    {% raw %}{{/filter_status}}{% endraw %}

    {% raw %}{{^filter_status}}{% endraw %}        
    <!-- filtering starts -->      
    <div class="netisafe nonfilter_box post__filtered"> 
      <div class="post__explanation netisafe" style="display:block;">
        {% raw %}{{#pred_expl}}{% endraw %}
        <div class="expl_word expl_score_{% raw %}{{category}}{% endraw %}">
            <u>{% raw %}{{word}}{% endraw %}</u>
            <div class="expl_score" style="display:none;">
              ({% raw %}{{category}}{% endraw %})
            </div>
        </div>         
        {% raw %}{{/pred_expl}}{% endraw %}        
        <div class="tooltip" >
          <span>What is this?</span>
          <span style="font-size:x-small;" class="material-icons tooltip_icon">info</span>
          <span class="tooltiptext">The contribution of each underlined word (if any) in the sentence/paragraph as a whole that drives toxicity score predicted by the AI model (red = high, blue = moderate, gray = low)</span>
        </div>  
      </div>
      <p></p>    
    </div><!-- filtering ends -->   
    {% raw %}{{/filter_status}}{% endraw %}

    <div class="predictions netisafe" style="display:block;">
      {% raw %}{{#main_pred}}{% endraw %}
      <span class="badge-{% raw %}{{category}}{% endraw %}">
        {% raw %}{{class}}{% endraw %} : {% raw %}{{category}}{% endraw %}
      </span>
      {% raw %}{{/main_pred}}{% endraw %}

      {% raw %}{{#other_pred}}{% endraw %}
      <span class="badge-{% raw %}{{category}}{% endraw %}">
        {% raw %}{{class}}{% endraw %} : {% raw %}{{category}}{% endraw %}
      </span>
      {% raw %}{{/other_pred}}{% endraw %}

      <div class="tooltip" >
        <span>How Netisafe predicts these?</span>
        <span style="font-size:x-small;" class="material-icons tooltip_icon">info</span>
        <span class="tooltiptext">The system directly converts your post into a vector representation, passes it into a  pretrained machine learning model, and returns the score for each toxicity category. We do not store your social media posts in our system.</span>
      </div> 
    </div>

    <div class="post__options">
      <div class="post__option">
        <span class="material-icons"> thumb_up </span>
        <span>Like</span>
      </div>
      <div class="post__option">
        <a class="flex" onclick="showComment({% raw %}{{id}}{% endraw %})">
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
  <div id="comments_for_{% raw %}{{id}}{% endraw %}"  class="post__comments" style="display:block;">
    {% raw %}{{#comments}}{% endraw %}
    <div class="comment">            
      <div class="comment__top">
        <img
          class="user__avatar post__avatar"
          src={% raw %}{{avatar_img}}{% endraw %}
          alt=""
        />
    
        <div class="comment__main">
          <h3>{% raw %}{{user_fullname}}{% endraw %}</h3>  
          <p class="netisafe" style="display:none;">{% raw %}{{message}}{% endraw %}</p>
          
          {% raw %}{{#filter_status}}{% endraw %}
          <div class="netisafe filter_box"><!-- filtering starts-->          
            <span class="post__warning">{% raw %}{{message}}{% endraw %}</span>

            <div class="tooltip" >
              <span>Why?</span>
              <span style="font-size:x-small;" class="material-icons tooltip_icon">info</span>
              <span class="tooltiptext">We enable users to filter toxic contents from their social media and create a healthier digital platform. You can still show the content by clicking "Show comment ..." button in the right if you so decide. </span>
            </div>

            <label class="collapse" for="filter_comment_{% raw %}{{filtered_id}}{% endraw %}">Show comment ... </label>
            <input id="filter_comment_{% raw %}{{filtered_id}}{% endraw %}" type="checkbox">

            <div class="post__filtered">
              <div class="post__explanation netisafe" style="display:block;">
                {% raw %}{{#pred_expl}}{% endraw %}
                <div class="expl_word expl_score_{% raw %}{{category}}{% endraw %}">
                    <u>{% raw %}{{word}}{% endraw %}</u>
                    <div class="expl_score" style="display:none;">
                      ({% raw %}{{category}}{% endraw %})
                    </div>
                </div>         
                {% raw %}{{/pred_expl}}{% endraw %}
                <div class="tooltip" >
                  <span>What is this?</span>
                  <span style="font-size:x-small;" class="material-icons tooltip_icon">info</span>
                  <span class="tooltiptext">The contribution of each underlined word (if any) in the sentence/paragraph as a whole that drives toxicity score predicted by the AI model (red = high, blue = moderate, gray = low)</span>
                </div>  
              </div><!-- explanation ends-->          
            </div>
          </div><!-- filtering ends-->  
          {% raw %}{{/filter_status}}{% endraw %}
          {% raw %}{{^filter_status}}{% endraw %}
          <div class="netisafe nonfilter_box post__filtered"><!-- filtering starts-->          
            <div class="post__explanation netisafe" style="display:block;">
              {% raw %}{{#pred_expl}}{% endraw %}
              <div class="expl_word expl_score_{% raw %}{{category}}{% endraw %}">
                  <u>{% raw %}{{word}}{% endraw %}</u>
                  <div class="expl_score" style="display:none;">({% raw %}{{category}}{% endraw %})</div>
              </div>         
              {% raw %}{{/pred_expl}}{% endraw %}

              <div class="tooltip" >What is this? <span style="font-size:x-small;" class="material-icons tooltip_icon">info</span>
                <span class="tooltiptext">The contribution of each underlined word (if any) in the sentence/paragraph as a whole that drives toxicity score predicted by the AI model (red = high, blue = moderate, gray = low)</span>
              </div>
            </div><!-- explanation ends-->  
          </div><!-- filtering ends-->  
          {% raw %}{{/filter_status}}{% endraw %}                            
          <p></p>

          <div class="predictions netisafe" style="display:block;">
            {% raw %}{{#main_pred}}{% endraw %}
            <span class="badge-{% raw %}{{category}}{% endraw %}">
              {% raw %}{{class}}{% endraw %} : {% raw %}{{category}}{% endraw %}
            </span>
            {% raw %}{{/main_pred}}{% endraw %}

            {% raw %}{{#other_pred}}{% endraw %}
            <span class="badge-{% raw %}{{category}}{% endraw %}">
              {% raw %}{{class}}{% endraw %} : {% raw %}{{category}}{% endraw %}
            </span>
            {% raw %}{{/other_pred}}{% endraw %}

            <div class="tooltip">
              <span>How Netisafe predicts these?</span>
              <span style="font-size:x-small;" class="material-icons tooltip_icon">info</span>
              <span class="tooltiptext">The system directly converts your post into a vector representation, passes it into a  pretrained machine learning model, and returns the score for each toxicity category. We do not store your social media comments in our system.</span>
            </div>
          </div><!-- prediction ends-->                
        </div><!-- comment__main ends-->
      </div><!---comment__top ends -->       

      <div class="comment__options">
        <p>Like   &#183; Comment &#183; {% raw %}{{time_ago}}{% endraw %}</p>
      </div> 

    </div><!---a comment ends -->
    {% raw %}{{/comments}}{% endraw %} 

    <div class="comment">            
      <div class="comment__top">
        <img
          class="user__avatar post__avatar"
          src={{vars['avatar_img']}}
          alt=""
        /> 
                 
        <div class="comment__input">
            <input class="messageSender__input" id="post_comment_{% raw %}{{id}}{% endraw %}" placeholder="What's on your mind?" type="text" />
            <button class="comment_button netisafe_button" onclick="post_comment({% raw %}{{id}}{% endraw %})">Post comment</button>
        </div>  
      </div><!---comment__top ends -->       
    </div><!---a comment ends --> 

  </div><!---comments ends -->
</div><!-- post ends -->
`;