from flask import Flask
from flask import jsonify
from flask_cors import CORS
from flask import request
import data_access as da
import utils
import sys

app = Flask(__name__)
CORS(app)

@app.route('/')
def check_server():
   return "Flask server is up :)"

@app.route('/getData',methods = ['GET'])
def get_data():
	response = {}
	response["medicines"] = da.get_medicines()
	response["categories"] = da.get_categories()
	response["patients"] = da.get_patient_list(utils.date_today())
	return jsonify(response)

@app.route('/patientListByDate',methods = ['POST'])
def patient_list_by_date():
	date = utils.date_selected(request.json["date"])
	return jsonify(da.get_patient_list(date))

@app.route('/getMedicineLog',methods = ['POST'])
def get_medicine_log():
	date = utils.date_selected(request.json["date"])
	mid = int(request.json["mid"])
	return jsonify(da.get_medicine_log(date, mid))

@app.route('/updateStock',methods = ['POST'])
def update_stock():
    return jsonify(da.update_stock(request.json))

@app.route('/addNewMedicine',methods = ['POST'])
def add_new_madicine():
	return jsonify(da.add_new_medicine(request.json))

@app.route('/newPatientLog',methods = ['POST'])
def new_patient_log():
	return jsonify(da.new_patient_log(request.json))

if __name__ == '__main__':
   app.run()