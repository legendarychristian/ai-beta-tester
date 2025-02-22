import json
import pandas as pd


def analyze_demographics_with_defaults(convo_results):
    
    demographics = []
    
    for item in convo_results:
        demographics.append(item['persona'])
        
    df = pd.DataFrame(demographics)
    
    # # Load the demographic sample data
    # sample_file_path = "templates/random_demographics.json"
    # with open(sample_file_path, 'r') as f:
    #     sample_data = json.load(f)

    # # Convert to DataFrame
    # df = pd.DataFrame(sample_data)

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


def calculate_scores(eval_results):
    """
    Counts accept/fail decisions and keeps track of sentiment scores from a JSON file.
    
    Parameter:
    - eval_results (list)
      e.g., [{'decision': 'accept', 'sentiment_analysis': 7, 'reasoning': "The customer started..."}]
    
    Returns:
    - scores: list of dict
        e.g.: [{'accept_count': 3, 'reject_count': 2, 'sentiment_scores': [-2, 5, 3, 4, -3], 'average_score': 1.4}]
    """
    
    scores = {}
    accept_count = 0
    reject_count = 0
    sentiment_scores = []
    
    for item in eval_results:
        if 'accept' in item['decision']:
            accept_count += 1
        elif 'reject' in item['decision']:
            reject_count += 1
        sentiment_scores.append(item['sentiment_analysis'])
        average_score = sum(sentiment_scores) / len(sentiment_scores)

    scores['accept_count'] = accept_count
    scores['reject_count'] = reject_count
    scores['sentiment_scores'] = sentiment_scores
    scores['average_score'] = average_score
    return scores
        