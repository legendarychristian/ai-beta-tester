import json
import random
import os

def generate_random_demographics(filepath="backend/templates/demographics.json"):
    """
    Reads a JSON file containing demographic data, selects a random value from each field,
    and returns a dictionary of the selected values.
    
    Parameter:
    - filepath: str, path to the JSON file containing demographic data
    
    Returns:
    - demographics: dict, containing randomly selected values from each field in the JSON file
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

    selected_demographics = {}
    for field, values in demographics.items():
        if values:
            selected_demographics[field] = random.choice(values)
        else:
            selected_demographics[field] = None # Or a default value, or skip.

    return selected_demographics


if __name__ == "__main__":
    random_demo = generate_random_demographics()
    all_demographics = []
    
    for i in range(10):
        random_demo = generate_random_demographics()
        if random_demo:
            print(json.dumps(random_demo, indent=2))
            all_demographics.append(random_demo)
        
    # save the data to a file
    with open('backend/templates/random_demographics.json', 'w') as f:
        json.dump(all_demographics, f, indent=2)
        
        