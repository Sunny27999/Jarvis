# app.py
from flask import Flask, render_template, request, jsonify
from transformers import pipeline
import wikipedia

app = Flask(__name__)
chatbot = pipeline("text-generation", model="gpt2")
last_topic = ""

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    global last_topic
    data = request.get_json()
    message = data.get("message", "").lower()

    if "who is" in message or "what is" in message:
        last_topic = message.replace("who is", "").replace("what is", "").strip()
        try:
            summary = wikipedia.summary(last_topic, sentences=2)
            return jsonify({"response": summary})
        except:
            return jsonify({"response": "I couldn't find info on that."})

    elif "where" in message and "born" in message and last_topic:
        try:
            page = wikipedia.page(last_topic)
            summary = page.summary
            return jsonify({"response": f"{last_topic} was born at {summary.split('born')[1].split(')')[0].strip()}"} )
        except:
            return jsonify({"response": "Couldn't fetch follow-up info."})

    else:
        result = chatbot(message, max_length=80, num_return_sequences=1)
        answer = result[0]['generated_text'].split(message)[-1].strip()
        return jsonify({"response": answer if answer else "I'm still learning."})

if __name__ == "__main__":
    app.run(debug=True)
