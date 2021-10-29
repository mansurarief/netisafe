from flask import Flask,render_template,request, jsonify
import json
from detoxify import Detoxify
import datetime
import time

app = Flask(__name__)
model = Detoxify('original', device='cpu')

logo_img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png' #'https://i.pravatar.cc/100'

@app.route('/')
def post():
    with open("data/user_data.json", "r") as file_handler:    
        userdata = json.load(file_handler)

    preds = []
    for post in userdata['posts']:
        preds.append(model.predict(post['message']))

    return render_template('post.html', vars=userdata, logo_img=logo_img, preds=preds, zip=zip)

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
  a = request.args.get('val1')
  b = request.args.get('val2')
  now = datetime.datetime.now()
  date_text = now.strftime("%d %B %Y at %H:%M")
  pred = model.predict(b)
  uniq_id = str(time.time()).replace('.','')
  pred = {str(key): str(value.round(3)) for key, value in pred.items()}
  out = {"id": uniq_id, "message":b, "user_fullname": a, "avatar_img": 'https://i.pravatar.cc/100', "timestamp": date_text, "pred":pred}
  return jsonify(out)


app.run(host='localhost', port=5000, debug=True)