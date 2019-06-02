from pymongo import MongoClient

db_url = 'localhost'
port = 27017
db_name = 'temple_test'
# made new connection in individual getc method -> nit necessary so corrected now
client = MongoClient(db_url, port)
db = client[db_name]

def getc_medicine():
    return db.medicine

def getc_category(): 
    return db.static

def getc_patient():
    return db.patient

def getc_log():
    return db.log

def getc_daily_starting_stock():
    return db["daily_starting_stock"]