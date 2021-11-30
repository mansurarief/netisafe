
NetiSafe - Web plug-in to detoxify social networks
---------------------


### Description

This is a project originated from a course project at CMU. 

NetiSafe is an AI powered software solution empowers users to create healthier and more inclusive environments in digital platforms. 

The system will detect toxic post from the feed, and provide toxicity scoring for the six categories (toxicity, severe toxicity, obscene, threat, insult and indentity hate) for the post. High scoring in certain categpries will be highlighted. A break down will also be provided on a word to word basis. If the post is deemed to be highly toxic, it will be filtered unless the user require to see it. The plug-in can be turn on or off at any time by the user. 


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

