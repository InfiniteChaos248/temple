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

@app.route('/fetchMedicineReport',methods = ['POST'])
def fetch_medicine_report():
	return jsonify(da.fetch_medicine_report(request.json["mid"]))

@app.route('/admin/addCategory',methods = ['POST'])
def add_category():
	return jsonify(da.add_new_category(request.json))

@app.route('/admin/triggerJob1',methods = ['POST'])
def trigger_job_1():
	print('Admin endpoint triggerJob1', file=sys.stdout)
	access_code = request.json["access_code"]
	if access_code == "arjun":
		if da.generate_daily_starting_stock():
			return "Job completed"
	return "Invalid access code"

if __name__ == '__main__':
   app.run()