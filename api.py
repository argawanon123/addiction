from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load
import pandas as pd
from category_encoders.binary import BinaryEncoder

api = Flask(__name__)
CORS(api)

model = load('decision_tree_model.joblib')

x= pd.read_csv("student_addiction_dataset_test.csv")
categorical_features = [
    'Experimentation',
    'Academic_Performance_Decline',
    'Social_Isolation',
    'Financial_Issues',
    'Physical_Mental_Health_Problems',
    'Legal_Consequences',
    'Relationship_Strain',
    'Risk_Taking_Behavior',
    'Withdrawal_Symptoms',
    'Denial_and_Resistance_to_Treatment'
]
encoder = BinaryEncoder()
x_encoded = encoder.fit_transform(x[categorical_features])

@api.post("/api/predict")
def predict_heart_failute():
    data = request.get_json()
    input_df = pd.DataFrame([data])

    input_encoded = encoder.transform(input_df[categorical_features])
    input_df = input_df.drop(categorical_features, axis=1)
    input_encoded = input_encoded.reset_index(drop=True)
    final_input = pd.concat([input_df, input_encoded], axis=1)

    prediction_probs = model.predict_proba(final_input)

    class_labels = model.classes_

    response = []
    for prob in prediction_probs:
        prob_dict = {}
        for k,v in zip(class_labels, prob):
            prob_dict[str(k)] = round(float(v) * 100, 2)
        response.append(prob_dict)
        
    return jsonify({"Prediction": response}), 200

if __name__ == '__main__':
    api.run(host='0.0.0.0', debug=True)
