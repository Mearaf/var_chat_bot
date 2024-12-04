from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend requests

# Set your OpenAI API key
openai.api_key = "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"

@app.route("/", methods=["GET"])
def home():
    return "Welcome to the chatbot backend!"

@app.route("/chat", methods=["POST"])
def chat():
    # Extract the user's message from the request body
    user_message = request.json.get("message")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # Check if the message matches a predefined query
    if "pricing" in user_message.lower():
        return jsonify({"response": "Our diagnostic fee is $110, applied toward repair costs if service proceeds."})
    if "services" in user_message.lower():
        return jsonify({"response": "We specialize in appliance diagnostics, repair, and maintenance."})
    if "refrigerator not cooling" in user_message.lower():
        return jsonify({"response": "Make sure the thermostat is set correctly and check if the vents are blocked."})

    try:
        # Use the /v1/chat/completions endpoint
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Use gpt-4 if available
            messages=[
                {"role": "system", "content": "You are a helpful assistant for Virginia Appliance Repair. You provide information about the services offered, pricing, scheduling repairs, and basic troubleshooting tips for home appliances."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=250,
            temperature=0.7
        )
        # Extract the bot's response
        bot_reply = response["choices"][0]["message"]["content"].strip()

        return jsonify({"response": bot_reply})

    except openai.error.OpenAIError as e:
        # Handle OpenAI API errors
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
