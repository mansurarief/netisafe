from flask import Flask,render_template,request
import json
from detoxify import Detoxify


app = Flask(__name__)
model = Detoxify('original', device='cpu')

with open("data/user_data.json", "r") as file_handler:    
    userdata = json.load(file_handler)

preds = []
for post in userdata['posts']:
    preds.append(model.predict(post['message']))

logo_img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png' #'https://i.pravatar.cc/100'

@app.route('/')
def post():
    print(preds)
    return render_template('post.html', vars=userdata, logo_img=logo_img, preds=preds, zip=zip)

@app.route('/form')
def form():
    return render_template('form.html')    

@app.route('/data', methods = ['POST', 'GET'])
def data():
    if request.method == 'GET':
        return f"The URL /data is accessed directly. Try going to '/form' to submit form"
    if request.method == 'POST':
        form_data = request.form
        return render_template('data.html',form_data = form_data)
 
 
app.run(host='localhost', port=5000, debug=True)