
NetiSafe - Web plug-in to detoxify social networks
---------------------


### Description

This is a project originated from a course project at CMU. 

NetiSafe is an AI powered software solution empowers users to create healthier and more inclusive environments in digital platforms. 

Once turned on, the software will read all posts on the page, and process them with the ML algorithm. The system will detect toxic post from the feed, and provide toxicity scoring for the six categories (toxicity, severe toxicity, obscene, threat, insult and indentity hate) for the post. High scoring in certain categpries will be highlighted. A break down will also be provided on a word to word basis. If the post is deemed to be highly toxic, it will be filtered unless the user require to see it. The plug-in can be turn on or off at any time by the user. The model only works in English language now. 


### Open Testing

This project is now open for testing! 

We are doing a social engineering test with your support in order to bring more inclusivity and an across the board positive vibe to the digital media or communication platforms online. In this regard our product Netisafe needs some thorough testing. Please help us get valuable information on things which we might have overlooked or simply haven't thought of. Thank you so much for your time! 

Test Procedure: 

1) Please log on to this link for live testing on our Netisafeproduct: 
http://46.101.54.21:5000/ (Links to an external site.)

2) Visit the following link to give feedback. It's a short surveywhich won't take more than 2 mins:
https://forms.gle/eVQ2TvPVhginNLpf6

Instruction for use: While using Netisafe, remember to type your message on the ribbon, hit "post" button and once it's visible in the correct tile (always below the ribbon); just refresh your browser page. The same message will re-run with our models and you will see the magic!

We at Safedial.ai really appreciate your help in developing this product. Maybe if this works, you could become our premium version users free of cost for life!


### Installation

1. Clone the repo
   ```sh
   git clone git@github.com:mansurarief/safesocial.git
   ```

2. Go into the repo
   ```sh
   cd safesocial
   ```

3. Create new virtual environment (if you so prefer)
   ```sh
   virtualenv -p python3 venv  
   ```

3. Activate the new environment
   ```sh
   source venv/bin/activate
   ```

3. Install requirements
   ```sh
   pip install -r requirements.txt
   ```

4. Run the webserver
   ```sh
   python webserver.py
   ```
5. Visit the rendered page at: [http://localhost:5000/](http://localhost:5000/)

