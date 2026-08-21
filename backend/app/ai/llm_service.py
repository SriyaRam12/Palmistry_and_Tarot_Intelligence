from openai import OpenAI

client = OpenAI()


def generate_ai_reading(data):

    prompt = f"""
You are a professional palmistry assistant.

Based ONLY on the following analysis:

Palm Shape:
{data["classification"]}

Finger Analysis:
{data["finger_analysis"]}

Palm Lines:
{data["line_analysis"]}

Generate a concise palm reading with these sections:

1. Personality
2. Career
3. Relationships
4. Health
5. Strengths
6. Suggestions

Rules:
- Maximum 250 words.
- Use simple, friendly English.
- Do not repeat the numerical values.
- Do not make supernatural or guaranteed predictions.
- Base every statement only on the provided analysis.
"""

    response = client.responses.create(
        model="gpt-5.2",
        input=prompt,
        text={"verbosity": "low"}
    )

    return response.output_text