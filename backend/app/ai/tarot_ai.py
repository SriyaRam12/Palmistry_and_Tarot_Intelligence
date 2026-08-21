from openai import OpenAI

client = OpenAI()

def generate_tarot_reading(card):

    prompt = f"""
You are an experienced Tarot Reader.

Card: {card["name"]}

Orientation:
{card["orientation"]}

Meaning:
{card["meaning"]}

Love:
{card["love"]}

Career:
{card["career"]}

Health:
{card["health"]}

Generate an encouraging and personalized tarot reading.

Keep it under 180 words.
"""

    response = client.responses.create(
        model="gpt-5.2",
        input=prompt,
        text={"verbosity": "low"}
    )

    return response.output_text