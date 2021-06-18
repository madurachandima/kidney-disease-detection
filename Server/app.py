from os import replace
from flask import Flask
from flask.globals import request
from flask_cors import CORS
from flask.json import jsonify
import joblib as joblib

app = Flask(__name__)
CORS(app)


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
        blood_pressure = request_data['blood_pressure']
        sodium = request_data['sodium']

        if (age and specific_gravity and albumin and red_blood_cells
                and pus_cell and blood_urea and serum_creatinine and hemoglobin
                and packed_cell_volume and hypertension and blood_pressure
                and sodium):
            # 1 - Not CKD
            # 0 - CKD

            # 1 - YES
            # 0-NO

            # [age	sg	al	rbc	pc	bu	sc	hemo	pcv	htn]
            #['age','sg','al','rbc','pc','bu','sc','hemo','pcv','htn','sod','bp']
            try:
                y_pred = loadModel.predict([[
                    age, blood_pressure, specific_gravity, albumin,
                    red_blood_cells, pus_cell, blood_urea, serum_creatinine,
                    sodium, hemoglobin, packed_cell_volume, hypertension
                ]])

                if (y_pred[0] == 1):
                    ckdStatus = "Not CKD"
                elif (y_pred[0] == 0):
                    ckdStatus = "CKD"

                message = 'Success..'
                statusCode = 200

            except Exception as e:
                message = 'Only accept numaric values'
                statusCode = 406
                print(e)

        else:
            message = 'Not Acceptable..'
            statusCode = 406

    except Exception as e:
        message = 'Internal Server Error....'
        statusCode = 500
        print(e)

    response = [{
        'message': message,
        'status': statusCode,
        'data': {
            'ckd_status': ckdStatus
        },
    }]
    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
