import database as db
import utils
import sys
from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()
scheduler.start()

def get_medicines():
    meds = []
    for med in db.getc_medicine().find():
        meds.append(utils.make_medicine_dict(med))
    return meds

def get_categories():
    collection_category = db.getc_category()
    document = collection_category.find_one({"sid": 1})
    category_dict = document["categories"]
    return category_dict

def log_medicine(medicine_dict, io, pid):
    collection_log = db.getc_log()
    medicine_doc = utils.make_medicine_log_doc(medicine_dict, io, pid)
    insert = collection_log.insert_one(medicine_doc)
    if insert.acknowledged:
        return insert.inserted_id

def add_new_medicine(medicine_dict):
    collection_medicine = db.getc_medicine()
    document = collection_medicine.find_one({"mid": int(medicine_dict["mid"])})
    if document is None:
        insert = collection_medicine.insert_one(utils.make_medicine_doc(medicine_dict))
        if insert.acknowledged:
            medicine_id = insert.inserted_id
            medicine_dict["qty"] = medicine_dict["stock"]
            log_id = log_medicine(medicine_dict, True, -1)
            if log_id is not None:
                insert_new_daily_starting_stock(medicine_dict["mid"], 0)
                return {"code": 1, "message": "Added new medicine successfully"}
            else:
                collection_medicine.remove({"_id": medicine_id})
                return {"code": -6, "message": "Database insert unsuccessful"}
        else:
           return {"code": -6, "message": "Database insert unsuccessful"} 
    else:
        return {"code": -10, "message": "Medicine with same id or name already exists"}

def update_stock(medicine_dict):
    collection_medicine = db.getc_medicine()
    mid = int(medicine_dict["mid"])
    qty = int(medicine_dict["qty"])
    medicine_doc = collection_medicine.find_one({"mid": mid})
    if medicine_doc is not None:
        old_stock = medicine_doc["stock"]
        new_stock = old_stock + qty
        update = collection_medicine.update_one({"mid": mid}, { "$set": { "stock": new_stock } })
        if update.acknowledged:
            log_id = log_medicine(medicine_dict, True, -1)
            if log_id is not None:
                return {"code": 1, "message": "Stock updated successfully"}
            else:
                update = collection_medicine.update_one({"mid": mid}, { "$set": { "stock": old_stock } })
                return {"code": -6, "message": "Database insert unsuccessful"}
    else:
        return {"code": -10, "message": "No such medicine exists"}

def consume_stock(medicine):
    collection_medicine = db.getc_medicine()
    mid = int(medicine["mid"])
    qty = int(medicine["qty"])
    medicine_doc = collection_medicine.find_one({"mid": mid})
    old_stock = medicine_doc["stock"]
    if qty > old_stock:
        return -4
    if qty <= old_stock:
        new_stock = old_stock - qty
        update = collection_medicine.update_one({"mid": mid}, { "$set": { "stock": new_stock } })
        if update.acknowledged:
            return {"mid": mid, "old_stock": old_stock}

def get_patient_list(date):
    collection_patient = db.getc_patient()
    documents = collection_patient.find({"date": date})
    patient_list = []
    for patient in documents:
        patient_list.append(utils.make_patient_dict(patient))
    return patient_list

def get_medicine_log(date, mid):
    collection_log = db.getc_log()
    documents = collection_log.find({"date": date, "mid": mid})
    log_list = []
    for log in documents:
        log_list.append(utils.make_medicine_log_dict(log))
    return log_list

def new_patient_log(patient_dict):
    collection_patient = db.getc_patient()
    today = utils.date_today()
    patient_pid = int(patient_dict["num"])
    patient_name = patient_dict["name"]
    patient_age = int(patient_dict["age"])
    patient_address = patient_dict["address"]
    patient_contact = patient_dict["contact"]
    patient_diagnosis = patient_dict["diagnosis"]
    patient_gender = patient_dict["gender"]
    patient_medicine_list = patient_dict["medList"]
    document = collection_patient.find_one({"date": today, "id": patient_pid})
    if document is None:
        patient_doc = {}
        patient_doc["date"] = today
        patient_doc["id"] = patient_pid
        patient_doc["name"] = patient_name
        patient_doc["age"] = patient_age
        patient_doc["address"] = patient_address
        patient_doc["contact"] = patient_contact
        patient_doc["diagnosis"] = patient_diagnosis
        patient_doc["gender"] = patient_gender
        med_list = []
        for med in patient_medicine_list:
            med_list.append(utils.make_patient_log_medicine_doc(med, patient_pid))
        patient_doc["medicines"] = med_list
        # print(patient_doc, file=sys.stderr)
        insert = collection_patient.insert_one(patient_doc)
        if insert.acknowledged:
            inserted_patient_id = insert.inserted_id
            success_list = []
            success_log_list = []
            for medicine in med_list:
                success = consume_stock(medicine)
                if success is not None:
                    if success == -4:
                        rollback_unsuccessful_patient_log(success_list, success_log_list, inserted_patient_id)
                        return {"code": -4, "message": "Not enough stock for " + medicine["name"]}
                    success_list.append(success)
                    log_id = log_medicine(medicine, False, patient_pid)
                    if log_id is not None:
                        success_log_list.append(log_id)
                    else:
                        rollback_unsuccessful_patient_log(success_list, success_log_list, inserted_patient_id)
                        return {"code": -8, "message": "Database insert unsuccessful"} 
                else:
                    rollback_unsuccessful_patient_log(success_list, success_log_list, inserted_patient_id)
                    return {"code": -8, "message": "Database insert unsuccessful"}
            return {"code": 1, "message": "New patient logged successfully"}
        else:
            return {"code": -8, "message": "Database insert unsuccessful"}
    else:
        return {"code": -10, "message": "Invalid patient number"}

def rollback_unsuccessful_patient_log(medicine_list, log_list, patient_id):
    collection_patient = db.getc_patient()
    collection_medicine = db.getc_medicine()
    collection_log = db.getc_log()
    collection_patient.remove({"_id": patient_id})
    for log_id in log_list:
        collection_log.remove({"_id": log_id})
    for medicine in medicine_list:
        collection_medicine.update_one({"mid": medicine["mid"]}, { "$set": { "stock": medicine["old_stock"] } })

def fetch_medicine_report(mid):
    collection_starting_stock = db.getc_daily_starting_stock()
    collection_log = db.getc_log()
    starting_stock_dict = collection_starting_stock.find_one({"mid": int(mid)})
    logs = collection_log.find({"mid": mid})
    log_list = []
    if logs is not None:
        for log in logs:
            log_list.append(utils.make_medicine_log_dict(log))
    log_by_date = {}
    for log in log_list:
        date = log["date"]
        list_for_date = log_by_date.get(date)
        if list_for_date is None:
            list_for_date = []
            list_for_date.append(log)
            log_by_date[date] = list_for_date
        else:
            list_for_date.append(log)
            log_by_date[date] = list_for_date
    stock_by_date = starting_stock_dict["stock"]
    report_list = []
    for (date, stock) in stock_by_date.items():
        report = {}
        report["date"] = date
        opening = stock
        issued = 0
        received = 0
        balance = 0
        logs_for_date = log_by_date.get(date)
        if logs_for_date is not None:
            for log in logs_for_date:
                if log["io"]:
                    received = received + log["qty"]
                else:
                    issued = issued + log["qty"]
            balance = opening + received - issued
            report["opening"] = opening
            report["received"] = received
            report["issued"] = issued
            report["balance"] = balance
            report_list.append(report)
    return report_list

def insert_new_daily_starting_stock(mid, stock):
    collection_starting_stock = db.getc_daily_starting_stock()
    daily_stock_document = {}
    daily_stock_document["mid"] = int(mid)
    daily_stock = {}
    daily_stock[utils.date_today()] = int(stock)
    daily_stock_document["stock"] = daily_stock
    insert = collection_starting_stock.insert_one(daily_stock_document)
    if not insert.acknowledged:
        print('Error while inserting new daily starting stock - Medicine :', file=sys.stderr)
        print(medicine, file=sys.stderr)

@scheduler.scheduled_job(trigger="cron", hour=0, minute=20, id="1")
def generate_daily_starting_stock():
    print('Job triggered to generate daily starting stock', file=sys.stdout)
    collection_medicine = db.getc_medicine()
    collection_starting_stock = db.getc_daily_starting_stock()
    today = utils.date_today()
    print('Date : ' + today, file=sys.stdout)
    all_medicine = collection_medicine.find()
    for medicine in all_medicine:
        daily_stock_document = collection_starting_stock.find_one({"mid": medicine["mid"]})
        if daily_stock_document is None:
            insert_new_daily_starting_stock(medicine["mid"], medicine["stock"])
        else:
            daily_stock = daily_stock_document["stock"]
            if daily_stock is None:
                daily_stock = {}
            elif daily_stock.get(today) is not None:
                print('Entry already exists - Medicine :', file=sys.stderr)
                print(medicine, file=sys.stderr)
                continue
            daily_stock[today] = medicine["stock"]
            update = collection_starting_stock.update_one({"mid": medicine["mid"]}, { "$set": { "stock": daily_stock } })
            if not update.acknowledged:
                print('Error while updating daily starting stock - Medicine :', file=sys.stderr)
                print(medicine, file=sys.stderr)
    print('Job completed', file=sys.stdout)
    return True