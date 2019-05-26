import datetime

def date_today():
    today = datetime.datetime.now()
    day = today.strftime("%a")
    month = today.strftime("%b")
    date = today.strftime("%d")
    year = today.strftime("%Y")
    today_string = day + ', ' + month + ' ' + date + ' ' + year
    return today_string

def date_selected(date):
    selected_date = datetime.datetime.strptime(date, "%Y-%m-%d")
    day = selected_date.strftime("%a")
    month = selected_date.strftime("%b")
    date = selected_date.strftime("%d")
    year = selected_date.strftime("%Y")
    selected_date_string = day + ', ' + month + ' ' + date + ' ' + year
    return selected_date_string

def make_medicine_dict(doc):
    med = {}
    med["mid"]=int(doc["mid"])
    med["name"]=doc["name"]
    med["stock"]=doc["stock"]
    med["category"]=doc["category"]
    return med

def make_patient_dict(doc):
    patient = {}
    patient["date"] = doc["date"]
    patient["id"]=int(doc["id"])
    patient["name"]=doc["name"]
    patient["age"]=doc["age"]
    patient["medList"] = doc["medicines"]
    return patient

def make_medicine_log_dict(doc):
    log = {}
    log["date"] = doc["date"]
    log["io"] = doc["io"]
    log["mid"] = doc["mid"]
    log["pid"] = doc["pid"]
    log["qty"] = doc["qty"]
    return log

def make_medicine_doc(dict):
    med = {}
    med["mid"] = int(dict["mid"])
    med["name"] = dict["name"]
    med["stock"] = int(dict["stock"])
    med["category"] = dict["category"]
    return med

def make_medicine_log_doc(dict, io, pid):
    med = {}
    med["date"] = date_today()
    med["mid"]=int(dict["mid"])
    med["pid"]=int(pid)
    med["qty"]=int(dict["qty"])
    med["io"] = io
    return med

def make_patient_log_medicine_doc(dict, pid):
    med = {}
    med["date"] = date_today()
    med["mid"]=int(dict["mid"])
    med["pid"]=int(pid)
    med["qty"]=int(dict["qty"])
    med["name"]=dict["name"]
    med["category"]=dict["category"]
    med["io"] = False
    return med