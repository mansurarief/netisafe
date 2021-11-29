from flask import Flask,render_template,request, jsonify
import json
from detoxify import Detoxify
import datetime
import time
import numpy as np
import re
import torch
from lime.lime_text import LimeTextExplainer
import torch.nn.functional as F

app = Flask(__name__)
model = Detoxify('original', device='cpu')

#explainer
toxic_model = model.model
toxic_tokenizer= model.tokenizer
toxic_model.eval()
class_names= model.class_names

def predictor(texts):
    inputs = toxic_tokenizer(texts, return_tensors="pt", truncation=True, padding=True).to("cpu")
    out = toxic_model(**inputs)[0]
    scores = torch.sigmoid(out).cpu().detach().numpy()
    return scores

explainer = LimeTextExplainer(class_names=class_names)    


logo_img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png' #'https://i.pravatar.cc/100'

thres = {"exp":0.0001, "moderate": 0.1, "high": 0.7}

@app.route('/')


def post():
    with open("data/user_data.json", "r") as file_handler:    
        userdata = json.load(file_handler)

    userdata['posts'] = sorted(userdata['posts'], key=lambda d: d['timestamp'], reverse=True) 
    
    #add toxicity prediction to userdata
    for i, post in enumerate(userdata['posts']):
        pred_post = get_prediction(post['message'], model)

        #add into original data
        userdata['posts'][i]['pred'] = pred_post
        userdata['posts'][i]['pred_cat'] = categorical_prediction(pred_post)
        userdata['posts'][i]['pred_expl'] = get_explanation(post['message'])

        #add "other predictions" button
        userdata['posts'][i]['other_pred'] = other_prediction(pred_post)
        userdata['posts'][i]['other_pred_pos'] = other_prediction_button_position(pred_post)
        is_filtered = (np.array(list(pred_post.values())) > thres['high']).sum() > 0
        userdata['posts'][i]['is_filtered'] = is_filtered

        
        if post['has_comments']:
            for j, comment in enumerate(post['comments']):
                pred_post = get_prediction(comment['message'], model)
                userdata['posts'][i]['comments'][j]['pred'] = pred_post   
                userdata['posts'][i]['comments'][j]['pred_cat'] = categorical_prediction(pred_post)
                userdata['posts'][i]['comments'][j]['pred_expl'] = get_explanation(comment['message'])             
                userdata['posts'][i]['comments'][j]['id'] = str(i)+"_"+str(j)
                userdata['posts'][i]['comments'][j]['other_pred'] = other_prediction(pred_post)
                userdata['posts'][i]['comments'][j]['other_pred_pos'] = other_prediction_button_position(pred_post)
                is_filtered = (np.array(list(pred_post.values())) > thres['high']).sum() > 0
                userdata['posts'][i]['comments'][j]['is_filtered'] = is_filtered

    return render_template('post.html', vars=userdata, thres=thres, logo_img=logo_img, enumerate=enumerate, abs=abs)

@app.route('/form')
def form():
    return render_template('jquery_data.html')    

@app.route('/data', methods = ['POST', 'GET'])
def data():
    if request.method == 'GET':
        return f"The URL /data is accessed directly. Try going to '/form' to submit form"
    if request.method == 'POST':
        form_data = request.form
        return render_template('data.html',form_data = form_data)

 
 
@app.route('/calculate_result')
def calculate_result():
  a = int(request.args.get('val1'))
  b = int(request.args.get('val2'))
  return jsonify({"result":a+b})

@app.route('/fetch_result')
def fetch_result():
  a = request.args.get('val1')
  b = request.args.get('val2')
  return jsonify({"message":b})

@app.route('/fetch_post')
def fetch_post():
  user_fullname = request.args.get('val1')
  message = request.args.get('val2')
  now = datetime.datetime.now()
  uniq_id = str(time.time()).replace('.','')
  pred = get_prediction(message, model)

  out = {"id": uniq_id, 
        "message":message, 
        "user_fullname": user_fullname, 
        "avatar_img": 'https://i.pravatar.cc/100', 
        "date_text": now.strftime("%d %B %Y at %H:%M"), 
        "timestamp": str(datetime.datetime.timestamp(now)),
        "has_img": False,
        'other_pred' : bool(other_prediction(pred)),
        'other_pred_pos' : int(other_prediction_button_position(pred)),
        #'pred_expl': get_explanation(message),
        #'pred': pred,
        "post_img": '',
       "has_comments": False,
       "comments": []}

  with open("data/user_data.json", "r") as file_handler:    
    userdata = json.load(file_handler)       
  userdata['posts'].append(out)

  with open("data/user_data.json", "w") as file_handler:
    json.dump(userdata, file_handler)

  return jsonify(out)

def other_prediction(pred_post):
    out = (np.array(list(pred_post.values())) <=0.1).sum() < len(pred_post)
    return out

def other_prediction_button_position(pred_post, thres=0.1):
    if other_prediction(pred_post):
        out = np.argwhere(np.insert(np.diff((np.array(list(pred_post.values())) <=thres )+0), 0, 0)== 1).flatten()[0] 
    else:
        out=0

    return out

def get_prediction(message, model):

    #get crude prediction
    pred_post = model.predict(message)

    #apply rounding
    pred_post = {str(key): value.round(3) for key, value in pred_post.items()}

    #apply sorting
    pred_post = dict(sorted(pred_post.items(), key=lambda item: item[1], reverse=True))

    return pred_post


def get_categorical(score, neg=-0.001, very_low = 0.000001, low=0.00001, mod=0.0001, high=0.001):    
    if score >= high:
        out = "high"
    elif score >= mod:
        out = "moderate"
    elif score >= low:
        out = "low"
    elif score >= very_low:
        out = "verylow"
    elif score <= neg:
        out = "negative"
    else:
        out = "NA"
    return out

def categorical_prediction(pred, neg=0, very_low = 0.01, low=0.01, mod=thres['moderate'], high=thres['high']):    
    categories = []
    for score in pred.values():
        if score >= high:
            out = "high"
        elif score >= mod:
            out = "moderate"
        elif score >= low:
            out = "low"
        elif score >= very_low:
            out = "verylow"
        elif score <= neg:
            out = "negative"
        else:
            out = "NA"
        categories.append(out)

   
    return categories





def get_explanation(message):
    exp = explainer.explain_instance(message, predictor, num_features=10, num_samples=20)
    score_dict = dict(exp.as_list())
    final_out = []
    for word in re.split("\s|(?<!\d)['](?!\d)", message):
        clean_word = re.sub(r'[^\w\s]','',word)
        if clean_word  in score_dict.keys():
            final_out.append( (clean_word, np.round(score_dict[clean_word], 4), get_categorical(score_dict[clean_word])))
        elif clean_word != '':   
            final_out.append( (clean_word, 0, "NA"))        
    return final_out    

app.run(host='localhost', port=5000, debug=True)