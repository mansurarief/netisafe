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
import glob
import os


app = Flask(__name__)
model = Detoxify('original', device='cpu')
MODEL_VERSION = "0.0.1"
SAVE_PREDICTION = True


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
keymaps = {"low":"class_low", "moderate": "class_mod", "high": "class_high"}
#post_data = glob.glob("static/json/*.json")



@app.route('/')


def post():
    post_data = os.listdir("static/json/")
    with open("data/user_data_only.json", "r") as file_handler:    
        userdata = json.load(file_handler)
    return render_template('post_2.html', vars=userdata, post_data=post_data, thres=thres, logo_img=logo_img, enumerate=enumerate, abs=abs)

@app.route('/form')
def form():
    return render_template('jquery_data.html')    
 
 
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
        'other_pred' : bool(other_prediction(pred[0])),
        'other_pred_pos' : int(other_prediction_button_position(pred[0])),
        #'pred_expl': get_explanation(message),
        #'pred': pred,
        "post_img": '',
       "has_comments": False,
       "comments": []}

  with open("data/user_data_0.json", "r") as file_handler:    
    userdata = json.load(file_handler)       
  userdata['posts'].append(out)

  with open("data/user_data.json", "w") as file_handler:
    json.dump(userdata, file_handler)

  return jsonify(out)

@app.route('/add_comment')
def add_comment():
  user_fullname = request.args.get('user_fullname')
  avatar_img = request.args.get('avatar_img')
  post_id = request.args.get('post_id')
  message = request.args.get('message')  
  now = datetime.datetime.now()
  uniq_id = str(time.time()).replace('.','')
  pred_comment = get_prediction(message, model)
  out = {"id": uniq_id, 
        "post_id": post_id,
        "message":message, 
        "user_fullname": user_fullname, 
        "avatar_img": 'https://i.pravatar.cc/100', 
        "pred_expl":get_explanation(message),
        "pred": pred_comment[0],
        "filter_status": get_filter_status(pred_comment[0], uniq_id),
        "time_ago": "1 minute"}
  out['main_pred'], out['other_pred']  = separate_predictions(pred_comment[1])


  with open("static/json/post_"+post_id+".json", "r") as file_handler:    
    userdata = json.load(file_handler)       
  userdata['comments'].append(out)
  userdata['has_comments'] = bool(True)

  with open("static/json/post_"+post_id+".json", "w") as file_handler:    
    json.dump(userdata, file_handler)

  return jsonify(userdata)  

@app.route('/get_post')
def get_post():
  post_file = request.args.get('post_file')

  with open("static/json/"+post_file, "r") as file_handler:    
    userdata = json.load(file_handler)

  if "model_version" not in userdata.keys():
    userdata['model_version']=''

  #only run prediction if MODEL_VERSION is not current
  if userdata['model_version'] != MODEL_VERSION:
      pred_post = get_prediction(userdata['message'], model)
      userdata['pred'] = pred_post[1]
      userdata['main_pred'], userdata['other_pred']  = separate_predictions(pred_post[1])
      userdata['pred_expl'] = get_explanation(userdata['message'])
      is_filtered = (np.array(list(pred_post[0].values())) > thres['high']).sum() > 0
      userdata['is_filtered'] = bool(is_filtered)
      userdata['filter_status'] = get_filter_status(pred_post[0], userdata['id'])
      userdata['model_version'] = MODEL_VERSION

      if SAVE_PREDICTION:
        with open("static/json/"+post_file, "w") as file_handler:    
            json.dump(userdata, file_handler)

  return jsonify(userdata)  

def other_prediction(pred_post):
    out = (np.array(list(pred_post.values())) <=0.1).sum() < len(pred_post)
    return out

def other_prediction_button_position(pred_post, thres=0.1):
    if other_prediction(pred_post):
        out = np.argwhere(np.insert(np.diff((np.array(list(pred_post.values())) <=thres )+0), 0, 0)== 1).flatten()[0] 
    else:
        out=0
    return int(out)

@app.route('/new_post')
def new_post():
  user_fullname = request.args.get('val1')
  message = request.args.get('val2')
  avatar_img = request.args.get('val3')
  now = datetime.datetime.now()
  uniq_id = str(time.time()).replace('.','')

  out = {"id": uniq_id, 
        "message":message, 
        "user_fullname": user_fullname, 
        "avatar_img": avatar_img, 
        "date_text": now.strftime("%d %B %Y at %H:%M"), 
        "timestamp": datetime.datetime.timestamp(now),
        "has_img": bool(False),
        'other_pred' : [],
        'pred_expl':[],
        'pred': [],
        "filter_status": bool(False),
        'main_pred': [],
        "post_img": '',
       "has_comments": bool(False),
       "is_filtered": bool(False),
       "model_version": "",
       "comments": []}

  filename = "post_"+uniq_id+".json"

  with open("static/json/"+filename, "w") as file_handler:
    json.dump(out, file_handler)

  return filename 

def get_prediction(message, model):
    #get crude prediction
    pred_post = model.predict(message)
    
    #apply sorting
    pred_post = dict(sorted(pred_post.items(), key=lambda item: item[1], reverse=True))

    #apply rounding and formatting
    pred_post_dict = {str(key): float(np.round(value, 4)) for key, value in pred_post.items()}
    pred_post_list = [{"class": str(key), "score": float(np.round(value, 4)), "category":categorical_prediction(value)} for key, value in pred_post.items()]

    return [pred_post_dict, pred_post_list]

def get_filter_status(pred_post, id):
    flagged = (np.array(list(pred_post.values())) > thres['high']).sum() > 0
    if flagged:
        out = {"message": "Warning: Content filtered due to condescending remarks", "filtered_id":id}
    else:
        out = bool(False)
    return out
def get_explanation(message):
    exp = explainer.explain_instance(message, predictor, num_features=10, num_samples=20)
    score_dict = dict(exp.as_list())
    final_out = []
    for word in re.split("\s|(?<!\d)['](?!\d)", message):
        clean_word = re.sub(r'[^\w\s]','',word)
        if clean_word  in score_dict.keys():
            final_out.append( {'word': word, 'score': float(np.round(score_dict[clean_word], 4)), 'category':get_categorical(score_dict[clean_word])})
        elif clean_word != '':   
            final_out.append({'word': word, 'score': float(0), 'category': "NA"})        
    return final_out   

def separate_predictions(pred_post_list, cutoff=thres['moderate']):
    main_pred = []
    other_pred = []
    for item in pred_post_list:
        if item['score'] >= cutoff:
            main_pred.append(item)
        else:
            other_pred.append(item)
    return [main_pred, other_pred]

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

def categorical_prediction(score, neg=0, very_low = 0.01, low=0.01, mod=thres['moderate'], high=thres['high']):    
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

class CustomJSONizer(json.JSONEncoder):
    def default(self, obj):
        return super().encode(bool(obj)) \
            if isinstance(obj, np.bool_) \
            else super().default(obj) 

app.run(host='0.0.0.0', port=5000, debug=True)