import os
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

def get_bot_response(user_message, pdf_text=""):

    try:
        response = client.chat.completions.create(
            model="qwen/qwen3-235b-a22b",

            messages=[
                {
                    "role": "system",
                    "content": """
You are NeuroLearn AI — a smart AI/ML/Generative AI learning assistant.

Your job:
- Explain AI, ML, LLMs, NLP, Deep Learning, and Generative AI concepts clearly.
- Keep answers short, structured, and student-friendly.
- Use bullet points when helpful.
- Avoid huge paragraphs.
- Do not make tables unless the user asks for a table.
- If PDF context is available, answer using that PDF context first.
- If the question is casual, reply naturally.
"""
                },

                {
                    "role": "user",
                    "content": f"""
PDF Context:
{pdf_text}

User Question:
{user_message}
"""
                }
            ]
        )

        return response.choices[0].message.content

    except Exception as e:
        return "API Error: " + str(e)