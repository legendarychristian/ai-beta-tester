import json
import random
import os

def generate_random_demographics(filepath="backend/templates/demographics.json"):
    """
    Reads a JSON file containing demographic data, selects a random value from each field,
    and returns a dictionary of the selected values.
    """
    try:
        with open(os.path.abspath(filepath), 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: File '{filepath}' not found.")
        return None
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in '{filepath}'.")
        return None

    demographics = data.get("demographics", {})
    if not demographics:
        print("Error: 'demographics' key not found in JSON.")
        return None

    random_selections = {}
    for field, values in demographics.items():
        if values:
            random_selections[field] = random.choice(values)
        else:
            random_selections[field] = None # Or a default value, or skip.

    return random_selections

if __name__ == "__main__":
    random_demo = generate_random_demographics()
    if random_demo:
        print(json.dumps(random_demo, indent=2))