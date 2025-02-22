import os
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
import random 
from time import time
from tqdm import tqdm
from typing import Optional, List, Dict

load_dotenv()

client = genai.Client(api_key=os.environ["GEMINI_KEY"])

demographic_parameters = {
      "religion": [
        "Christianity",
        "Islam",
        "Judaism",
        "Hinduism",
        "Buddhism",
        "Atheism/Agnosticism/Non-religious",
        "Sikhism",
        "Other"
      ],
      "race": [
        "White",
        "Black or African American",
        "Asian",
        "American Indian or Alaska Native",
        "Native Hawaiian or Pacific Islander",
        "Multiracial",
        "Other"
      ],
      "sex": [
        "Male",
        "Female"
      ],
      "age": [
        "18-24",
        "25-34",
        "35-44",
        "45-54",
        "55-64",
        "65+"
      ],
      "political_affiliation": [
        "Democrat",
        "Republican",
        "Independent",
        "Libertarian",
        "Green Party",
        "Other",
        "Unaffiliated"
      ],
      "location": [
        "New York City",
        "Los Angeles",
        "Chicago",
        "Houston",
        "Dallas",
        "Washington, D.C.",
        "San Francisco",
        "Philadelphia",
        "Atlanta",
        "Boston"
      ],
      "income": [
        "<$25,000",
        "$25,000-$50,000",
        "$50,000-$75,000",
        "$75,000-$100,000",
        "$100,000-$1M",
        "$1M-$10M",
        "$10M-$100M"
      ],
      "sexual_orientation": [
        "Heterosexual",
        "Homosexual",
        "Bisexual",
        "Asexual",
        "Pansexual",
        "Queer",
        "Other"
      ],
      "marital_status": [
        "Married",
        "Single",
        "Divorced",
        "Widowed"
      ],
      "children": [
        "Yes",
        "No"
      ],
      "property_owner": [
        "Yes",
        "No"
      ],
      "industry": [
        "Technology",
        "Healthcare",
        "Finance",
        "Education",
        "Manufacturing",
        "Retail",
        "Construction",
        "Agriculture",
        "Service Industry",
        "Other"
      ]
    }

def create_persona():
    """Creates a persona for the user to use in the conversation"""
    persona = {}
    for key, values in demographic_parameters.items():
        persona[key] = random.choice(values)
    return persona

def run_conversation_with_persona(product_text, persona):
    seller_config = types.GenerateContentConfig(
        system_instruction = """You are a salesman selling a product for your client. 
        You will be talking to a potential customer and will be trying to convince them to buy the product. 
        You will be given a description of the product and the customer, and you will generate a response to the customer. 
        You will generate a response that is persuasive and convincing, and that will make the customer want to buy the product.
        The conversation is finished once the customer asks to purchase the product or states that they are not interested in the product.
        Do not hallucinate or make up information about the product, only use the information that is given to you.
        If the buyer says "finished", output "finished" and do not generate any more responses. 
        .""",
        max_output_tokens = 1000,
        temperature = 0.1,
        top_p = 0.5,
        top_k = 64,
    )

    local_buyer_config = types.GenerateContentConfig(
        system_instruction = f"""You are a potential customer where a salesman will try to convince you to buy a product.
        This is your persona: {persona}.
        Generate responses as if you are this persona.
        Once you clearly state that you want to buy the product, or that you are not interested in the product, the conversation is finished.
        When the conversation is finished, output "finished" and do not generate any more responses.
        """,
        temperature=0.1,
        top_p=0.5,
        top_k=64,
        max_output_tokens=1000,
    )
    seller_chat = client.chats.create(model='gemini-2.0-flash', config=seller_config)
    buyer_chat = client.chats.create(model='gemini-2.0-flash', config=local_buyer_config)

    response = seller_chat.send_message(
        message=f"[INFORMATION]: Product to sell: {product_text}. Customer: {persona}."
    )
    local_chat_history = [{"role": "seller", "parts": [response.text]}]

    for _ in range(10):
        response = buyer_chat.send_message(message=response.text)
        local_chat_history.append({"role": "buyer", "parts": [response.text]})
        if response.text.strip() == "finished":
            break

        response = seller_chat.send_message(message=response.text)
        local_chat_history.append({"role": "seller", "parts": [response.text]})
        if response.text.strip() == "finished":
            break
        
    # print("Chat Finished")

    return {"persona": persona, "chat_history": local_chat_history}


def run_all_personas_in_parallel(personas, product_text, product_image = None):
    import concurrent.futures
    results = []
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_to_persona = {
            executor.submit(run_conversation_with_persona, product_text, persona): persona for persona in personas
        }
        for future in tqdm(concurrent.futures.as_completed(future_to_persona), total=len(personas)):
            results.append(future.result())
    return results

def process_convo(product_info: str):
    personas = []
    
    for _ in range(int(os.environ["NUMBER_OF_PERSONAS"])):
        persona = create_persona()
        personas.append(persona)
        
    return run_all_personas_in_parallel(personas, product_info)