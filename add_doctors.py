from flask import Flask, request, jsonify, render_template
import firebase_admin
from firebase_admin import credentials, firestore
import os
from difflib import SequenceMatcher

app = Flask(__name__)

# Ensure Firebase JSON key file exists
firebase_key_path = r"C:\Users\vaibh\OneDrive\Desktop\WELL_SYNC_3\Flask-Firebase-Template\well-sync-firebase.json"
if not os.path.exists(firebase_key_path):
    print("Error: Firebase JSON key file is missing!")
    exit()

# Initialize Firebase Admin SDK
try:
    cred = credentials.Certificate(firebase_key_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"Firebase initialization failed: {e}")
    exit()

# Function to check similarity between two strings
def is_similar(query, text, threshold=0.6):
    return SequenceMatcher(None, query, text).ratio() >= threshold

# Function to fetch doctors from Firestore based on user query
def fetch_docs_from_firestore(query):
    try:
        query = query.lower()
        docs_ref = db.collection("Doctors").stream()
        docs_list = []
        
        for doc in docs_ref:
            doc_dict = doc.to_dict()
            search_text = " ".join(str(value).lower() for value in doc_dict.values() if isinstance(value, str))
            
            if query in search_text or is_similar(query, search_text):
                docs_list.append(doc_dict)

        return docs_list
    except Exception as e:
        print(f"Error fetching Doctors: {e}")
        return []

# Route for Searching Doctors
@app.route("/search_docs")
def searchDOC():
    try:
        user_query = request.args.get("query", "").strip()
        if not user_query:
            return jsonify({"error": "No search query provided"}), 400  # Bad Request

        docs = fetch_docs_from_firestore(user_query)
        return jsonify(docs) if docs else jsonify([])
    except Exception as e:
        
        print(f"Error in searchDOC: {str(e)}")  # Print error for debugging
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

# Route for serving the Doctor Search page
@app.route("/connect_with_doctors")
def connect_with_doctors_2():
    return render_template("doc_search.html")

# Home Route (if required)
@app.route("/")
def home():
    return render_template("home.html")

if __name__ == "__main__":
    app.run(debug=True)
