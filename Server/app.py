from os import replace
from flask import Flask
from flask.globals import request
from flask.json import jsonify
import joblib as joblib
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)


@app.route('/getresult', methods=['POST'])
def Response():
    request_data = request.get_json()
    response = ""
    message = ""
    statusCode = ""
    ckdStatus = ""

    try:
        loadModel = joblib.load("Train_model.joblib")

        age = request_data['age']
        specific_gravity = request_data['specific_gravity']
        albumin = request_data['albumin']
        red_blood_cells = request_data['red_blood_cells']
        pus_cell = request_data['pus_cell']
        blood_urea = request_data['blood_urea']
        serum_creatinine = request_data['serum_creatinine']
        hemoglobin = request_data['hemoglobin']
        packed_cell_volume = request_data['packed_cell_volume']
        hypertension = request_data['hypertension']

        if (age and specific_gravity and albumin and
            red_blood_cells and pus_cell and blood_urea and
                serum_creatinine and hemoglobin and packed_cell_volume and hypertension):
            # 1 - Not CKD
            # 0 - CKD

            # 1 - YES
            # 0-NO

            # [age	sg	al	rbc	pc	bu	sc	hemo	pcv	htn]
            try:
                y_pred = loadModel.predict(
                    [[age, specific_gravity, albumin, red_blood_cells, pus_cell, blood_urea, serum_creatinine, hemoglobin, packed_cell_volume, hypertension]])

                if(y_pred[0] == 1):
                    ckdStatus = "Not CKD"
                elif(y_pred[0] == 0):
                    ckdStatus = "CKD"

                message = 'Success..'
                statusCode = 200

            except:
                message = 'Only accept numaric values'
                statusCode = 406

        else:
            message = 'Not Acceptable..'
            statusCode = 406

    except:
        message = 'Internal Server Error....'
        statusCode = 500

    response = [
        {
            'message': message,
            'status': statusCode,
            'data': {
                'ckd status': ckdStatus
            },
        }
    ]
    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
