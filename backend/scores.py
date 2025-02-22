# %%
import json

# %%
def calculate_scores(filepath):
    """
    Counts accept/fail decisions and keeps track of sentiment scores from a JSON file.
    
    Parameter:
    - filepath: str, path to the JSON file containing responses
    
    Returns:
    - scores: dict, containing the following
        e.g.: {'accept_count': 3, 'reject_count': 2, 'sentiment_scores': [-2, 5, 3, 4, -3]}
    """
    
    scores = {}
    accept_count = 0
    reject_count = 0
    sentiment_scores = []

    with open('templates/sample_responses.json', 'r') as f:
        data = json.load(f)
        for response in data:
            if 'Fund' in response['decision']: # TODO: change to 'Accept
                accept_count += 1
            elif 'Pass' in response['decision']: # TODO: change to 'reject
                reject_count += 1
            sentiment_scores.append(response['sentiment_analysis'])
    
    scores['accept_count'] = accept_count
    scores['reject_count'] = reject_count
    scores['sentiment_scores'] = sentiment_scores
    return scores

# %%
print(calculate_scores('templates/sample_responses.json'))

# %%
