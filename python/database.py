from pymongo import MongoClient

db_url = 'localhost'
port = 27017
db_name = 'temple_test'

def getc_medicine():
    client = MongoClient(db_url, port)
    db = client[db_name]
    medicine_collection = db.medicine
    return medicine_collection

def getc_category():
    client = MongoClient(db_url, port)
    db = client[db_name]
    category_collection = db.static
    return category_collection

def getc_patient():
    client = MongoClient(db_url, port)
    db = client[db_name]
    patient_collection = db.patient
    return patient_collection

def getc_log():
    client = MongoClient(db_url, port)
    db = client[db_name]
    log_collection = db.log
    return log_collection