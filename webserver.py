from flask import Flask,render_template,request
 
app = Flask(__name__)
 
@app.route('/')
def post():
    return render_template('post.html')

@app.route('/data/', methods = ['POST', 'GET'])
def data():
    if request.method == 'GET':
        return f"The URL /data is accessed directly. Try going to '/form' to submit form"
    if request.method == 'POST':
        form_data = request.form
        print(form_data)
        return render_template('data.html',form_data = form_data)
 
 
app.run(host='localhost', port=5000)