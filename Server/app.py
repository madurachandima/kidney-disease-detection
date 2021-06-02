from flask import Flask
from flask.globals import request
from flask.json import jsonify
import joblib as joblib


app = Flask(__name__)


@app.route('/result', methods=['POST'])
def hello():

    request_data = request.get_json()

    albumin = request_data['albumin']
    sugar = request_data['sugar']
    hemoglobin = request_data['hemoglobin']
    specific_gravity = request_data['specific_gravity']
    packed_cell_volume = request_data['packed_cell_volume']
    blood_urea = request_data['blood_urea']
    hypertension = request_data['hypertension']
    red_blood_cells = request_data['red_blood_cells']
    pus_cell = request_data['pus_cell']


    loadModel = joblib.load("Train_model.joblib")
#['age','al','sc','hemo','sg','pcv','bu','htn','rbc','pc','classification']
    y_pred = loadModel.predict(
        [[17.0, 1.010, 2.0, 1, 1, 53.0, 1.8, 9.6, 31, 0, ]])

    print(y_pred[0])

    response = [
        {'age': '2'}
    ]

    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
