const map = {
    "heading-new": {
        "E": "Log New Patient",
        "T": "புதிய நோயாளி பதிவு"
    },
    "name": {
        "E": "Name",
        "T": "பெயர்"
    },
    "age": {
        "E": "Age",
        "T": "வயது"
    },
    "gender": {
        "E": "Gender",
        "T": "பாலினம்"
    },
    "male": {
        "E": "Male",
        "T": "ஆண்"
    },
    "female": {
        "E": "Female",
        "T": "பெண்"
    },
    "other": {
        "E": "Other",
        "T": "மற்ற"
    },
    "address": {
        "E": "Address",
        "T": "முகவரி"
    },
    "contact": {
        "E": "Contact Number",
        "T": "தொடர்பு எண்"
    },
    "diagnosis": {
        "E": "Diagnosis",
        "T": "கண்டுப்பிடிக்கப்பட்ட வியாதி"
    },
    "ok-button": {
        "E": "OK",
        "T": "சரி"
    },
    "cancel-button": {
        "E": "Cancel",
        "T": "ரத்து"
    },
    "add-medicine-button": {
        "E": "Add Medicine",
        "T": "மருந்து"
    },
    "medicine-id": {
        "E": "ID",
        "T": "மருந்து எண்"
    },
    "medicine-quantity": {
        "E": "Quantity",
        "T": "அளவு"
    },
    "stock": {
        "E": "Stock",
        "T": "சேகரிப்பு"
    },
    "submit-button": {
        "E": "Submit",
        "T": "பதிவு செய்"
    },
    "reset-button": {
        "E": "Reset",
        "T": "அழி"
    },
    "medicine-name": {
        "E": "Medicine Name",
        "T": "மருத்து பெயர்"
    },
    "medicine-english-name": {
        "E": "Medicine Name",
        "T": "மருத்து பெயர் (ஆங்கிலம்)"
    },
    "medicine-tamil-name": {
        "E": "Medicine Name (Tamil)",
        "T": "மருத்து பெயர்"
    },
    "heading-medicine": {
        "E": "Medicine",
        "T": "மருந்துகள்"
    },
    "medicine-category": {
        "E": "Category",
        "T": "வகை"
    },
    "heading-medicine-log": {
        "E": "Medicine Log",
        "T": "மருத்து பதிவு"
    },
    "heading-patient-log": {
        "E": "Patient Log",
        "T": "நோயாளி பதிவு"
    },
    "heading-update-stock": {
        "E": "Update Stock",
        "T": "சேகரிப்பு புதுப்பித்தல்"
    },
    "heading-medicine-report": {
        "E": "Medicine Report",
        "T": "மருந்து அறிக்கை"
    },
    "search-button": {
        "E": "Search",
        "T": "தேடு"
    },
    "today-button": {
        "E": "Today",
        "T": "இன்றைய பதிவு"
    },
    "date": {
        "E": "Date",
        "T": "தேதி"
    },
    "patient-number": {
        "E": "Patient Number",
        "T": "நோயாளி எண்"
    },
    "in-out": {
        "E": "Issued/Received",
        "T": "செலவு/வரவு"
    },
    "issued": {
        "E": "Issued",
        "T": "செலவு"
    },
    "received": {
        "E": "Received",
        "T": "வரவு"
    },
    "doctor": {
        "E": "Doctor",
        "T": "மருத்துவர்"
    },
    "message-no-log": {
        "E": "No medicines issued/received on this day",
        "T": "இந்த நாளில் மருந்து செலவு/வரவு இல்லை"
    },
    "medicine-given": {
        "E": "Medicine Given",
        "T": "கொடுக்கப்பட்ட மருந்துகள்"
    },
    "message-no-patients": {
        "E": "No patients seen today",
        "T": "இந்த நாளில் நோயாளிகள் பதிவு இல்லை"
    },
    "heading-add-new-medicine": {
        "E": "Add New Medicine",
        "T": "புதிய மருந்து"
    },
    "select-category": {
        "E": "Select Category",
        "T": "வகையை தேர்வு செய்க"
    }
}

export function getWord(key, language) {
    return map[key][language];
}