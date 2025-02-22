import json
import pandas as pd


# Function to analyze demographics and ensure all categories are present
def analyze_demographics_with_defaults():
    
    # Load the demographic sample data
    sample_file_path = "templates/random_demographics.json"
    with open(sample_file_path, 'r') as f:
        sample_data = json.load(f)

    # Convert to DataFrame
    df = pd.DataFrame(sample_data)

    # Load the possible values JSON
    possible_values_file_path = "templates/demographics.json"
    with open(possible_values_file_path, 'r') as f:
        possible_values = json.load(f)["demographics"]
    
    analysis_result = {}
    total_entries = len(df)

    for column, possible_categories in possible_values.items():
        counts = df[column].value_counts().to_dict()
        percentages = {key: round((counts.get(key, 0) / total_entries) * 100, 2) for key in possible_categories}

        analysis_result[column] = {
            "raw_counts": {key: counts.get(key, 0) for key in possible_categories},
            "percentages": percentages
        }
    return analysis_result

# Save to file
# output_file = "templates/demographic_analysis_complete.json"
# with open(output_file, "w") as f:
#     f.write(analyze_demographics_with_defaults())
