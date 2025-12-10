from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv
import google.generativeai as genai
import os

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')
@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')

    if not user_message:
        return jsonify({"response": "Please provide a message."})
    
    try:
        #Use the fast gemini model
        model = genai.GenerativeModel('gemini-2.5-flash')      # <--- Remove .get
        response = model.generate_content(user_message)
        return jsonify({"reply": response.text})
    except Exception as e:
        return jsonify({"reply": f"Error: {str(e)}"})
    
if __name__ == '__main__':
    app.run(debug=True)

