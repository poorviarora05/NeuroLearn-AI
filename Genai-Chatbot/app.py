from flask import Flask, render_template, request, jsonify
from chatbot import get_bot_response
import os
import PyPDF2

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

uploaded_pdf_text = ""

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    global uploaded_pdf_text

    user_message = request.json.get("message")
    bot_response = get_bot_response(user_message, uploaded_pdf_text)

    return jsonify({"response": bot_response})

@app.route("/upload", methods=["POST"])
def upload_pdf():
    global uploaded_pdf_text

    if "pdf" not in request.files:
        return jsonify({"message": "No PDF file uploaded."})

    file = request.files["pdf"]

    if file.filename == "":
        return jsonify({"message": "No file selected."})

    if file and file.filename.endswith(".pdf"):
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(file_path)

        text = ""

        with open(file_path, "rb") as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)

            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

        uploaded_pdf_text = text[:6000]

        return jsonify({"message": "PDF uploaded successfully. You can now ask questions from this PDF."})

    return jsonify({"message": "Please upload a valid PDF file."})

if __name__ == "__main__":
    app.run(debug=True)