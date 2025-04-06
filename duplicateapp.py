import os
import streamlit as st
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from deep_translator import GoogleTranslator

# Load API key from environment file
load_dotenv(dotenv_path="api.env")
api_key = os.getenv("GOOGLE_API_KEY")

# Debugging API key
st.write(f"🔑 GOOGLE_API_KEY: {'✅ Loaded' if api_key else '❌ Not Found'}")

if not api_key:
    st.error("❌ Google API Key not found. Please check your .env file.")
    st.stop()

# Streamlit UI Title
st.title("🔍 Multilingual RAG-Based Medical AI using Gemini 1.5 Pro")

# Load the PDF document
pdf_path = "LADA.pdf"
if not os.path.exists(pdf_path):
    st.error(f"❌ File not found: {pdf_path}. Please check the path and try again.")
    st.stop()

st.write("📄 Loading medical PDF data...")
loader = PyPDFLoader(pdf_path)
data = loader.load()
st.write("✅ PDF Loaded Successfully!")

# Split the document into chunks
st.write("🔄 Splitting document into chunks...")
text_splitter = RecursiveCharacterTextSplitter(chunk_size=300)
docs = text_splitter.split_documents(data)
st.write(f"✅ Document split into {len(docs)} chunks!")

# Create vector store with embeddings
st.write("📥 Creating vector store with Gemini embeddings...")

vectorstore = Chroma.from_documents(
    documents=docs,
    embedding=GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=api_key),
    persist_directory="./chroma_db"
)

retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={
        "k": 10,  # Number of relevant docs to retrieve
        "filter": {"category": "medical"}  # Ensures only medical documents are retrieved
    }
)

st.write("✅ Vector store created and persisted!")

# Initialize Gemini model
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.7, google_api_key=api_key)

# Initialize chat history in session state if not already present
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# Add a "Clear Chat History" button
if st.button("🗑️ Clear Chat History"):
    st.session_state.chat_history = []
    st.success("Chat history cleared!")

# Translation functions
def translate_text(text, dest_lang="en"):
    """Translate text to the specified language."""
    return GoogleTranslator(source="auto", target=dest_lang).translate(text)

# Predefined medical keywords to filter responses
medical_keywords = ["disease", "treatment", "diagnosis", "symptoms", "medicine", "doctor", "hospital"]

# Language selection
user_lang = st.selectbox("🌍 Choose your language:", ["en", "hi", "bn", "gu", "mr", "ur", "ml","kn","te"], index=0)

# Chat input for user query
query = st.chat_input("💬 Ask a medical question based on the document:")

if query:
    # Display user message in chat
    with st.chat_message("user"):
        st.write(f"💬 **You:** {query}")

    # Translate query to English for processing
    translated_query = translate_text(query, dest_lang="en")

    # Define medical-specific prompt
    system_prompt = (
        "You are a specialized AI for medical analysis. "
        "Use only the retrieved medical knowledge to answer. "
        "If the retrieved documents do not contain relevant information, say: "
        "'I do not have enough medical data on this topic.'\n\n"
        "{context}"
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])

    # Create retrieval-augmented generation (RAG) chain
    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)

    # Get the response
    response = rag_chain.invoke({"input": translated_query})
    answer = response.get("answer", "⚠️ No answer found!")

    # Translate AI response back to user's selected language
    translated_answer = translate_text(answer, dest_lang=user_lang)

    # Store query and response in session state
    st.session_state.chat_history.append({"query": query, "answer": translated_answer})

    # Display AI response in chat
    with st.chat_message("assistant"):
        if any(keyword in answer.lower() for keyword in medical_keywords):
            st.write(f"🏥 **Medical Analysis:** {translated_answer}")
        else:
            st.write(f"⚠️ **Non-Medical Response:** {translated_answer}")

# Display chat history
st.write("## 📜 Chat History")
for chat in st.session_state.chat_history:
    with st.chat_message("user"):
        st.write(f"💬 **You:** {chat['query']}")
    with st.chat_message("assistant"):
        st.write(f"✅ **Answer:** {chat['answer']}")