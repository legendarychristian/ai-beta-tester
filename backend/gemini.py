# %%
import os
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_KEY"))

# %%
from util import generate_random_demographics
persona = generate_random_demographics(filepath="templates/demographics.json")

def get_agent_configs(persona): 
    seller_config = types.GenerateContentConfig(
        system_instruction = """You are a salesman selling a product for your client. 
        You will be talking to a potential customer and will be trying to convince them to buy the product. 
        You will be given a description of the product and the customer, and you will generate a response to the customer. 
        You will generate a response that is persuasive and convincing, and that will make the customer want to buy the product.
        The conversation is finished once the customer expresses interest in buying the product or states that they are not interested in the product.
        Do not hallucinate or make up information about the product, only use the information that is given to you.
        Do not try to actually sell the product once the customer has expressed interest in buying the product, and end the conversation.
        If the conversation is finished, output "finished" and do not generate any more responses. 
        .""",
        max_output_tokens = 500,
        temperature = 0.1,
        top_p = 0.5,
        top_k = 64,
    )

    buyer_config = types.GenerateContentConfig(
        system_instruction = f"""You are a potential customer where a salesman who will be trying to convince you to buy a product. 
        This is your persona, which you will base your responses off of: {persona}.
        You will generate a response to the seller that mimics how the persona would respond.
        If the conversation is finished, output "finished" and do not generate any more responses. 
        .""",
        max_output_tokens = 500,
        temperature = 0.1,
        top_p = 0.5,
        top_k = 64,
    )
    
    return seller_config, buyer_config

def agent_conversation(seller_config, buyer_config):
    seller_chat = client.chats.create(model='gemini-2.0-flash', config = seller_config)
    buyer_chat = client.chats.create(model='gemini-2.0-flash', config = buyer_config)

    response = seller_chat.send_message(
        message = f"[INFORMATION]: The product is a new type of phone that has a foldable screen and a long battery life. The price is $1500. Customer: {persona}",
    )

    chat_history = []
    chat_history.append({"role": "seller", "content": response.text})
    print(f"Seller: {response.text}")
    print("-------")

    for _ in range(10):
        response = buyer_chat.send_message(
            message = response.text,
        )
        print(f"Buyer: {response.text}")
        print("--------")
        chat_history.append({"role": "buyer", "content": response.text})
        if response.text.strip() == "finished":
            break
        response = seller_chat.send_message(
            message = response.text,
        )
        print(f"Seller: {response.text}")
        print("--------")
        chat_history.append({"role": "seller", "content": response.text})
        if response.text.strip() == "finished":
            break

    return chat_history

if __name__ == "__main__":
    persona = generate_random_demographics(filepath="templates/demographics.json")
    seller_config, buyer_config = get_agent_configs(persona)
    chat_history = agent_conversation(seller_config, buyer_config)
    print(chat_history)
    print("Conversation finished.")