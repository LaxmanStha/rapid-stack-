#!/usr/bin/env python3
"""
Medicine Barcode Scanner Backend
Provides API endpoints for barcode decoding and medicine information retrieval
"""

import os
import io
import base64
import requests
from flask import Flask, request, jsonify
from PIL import Image
import pyzbar.pyzbar as pyzbar
import cv2
import numpy as np

app = Flask(__name__)

# Medicine database with extended data
MEDICINE_DATABASE = {
    "8901020980123": {
        "name": "Paracetamol 500mg",
        "manufacturer": "Cipla Ltd.",
        "batchNumber": "P-202401",
        "expiryDate": "2025-12-31",
        "dosage": "500mg",
        "quantity": "10 tablets",
        "price": "₹25.00",
        "composition": "Paracetamol 500mg",
        "usage": "For pain relief and fever reduction",
        "sideEffects": "Nausea, vomiting, liver damage in overdose"
    },
    "8901020980454": {
        "name": "Amoxicillin 250mg",
        "manufacturer": "Sun Pharmaceutical",
        "batchNumber": "A-202403",
        "expiryDate": "2026-06-30",
        "dosage": "250mg",
        "quantity": "14 capsules",
        "price": "₹85.00",
        "composition": "Amoxicillin 250mg",
        "usage": "Antibiotic for bacterial infections",
        "sideEffects": "Diarrhea, nausea, allergic reactions"
    },
    "8901020980782": {
        "name": "Dolo 650",
        "manufacturer": "Micro Labs Ltd.",
        "batchNumber": "D-202402",
        "expiryDate": "2025-09-30",
        "dosage": "650mg",
        "quantity": "15 tablets",
        "price": "₹35.00",
        "composition": "Paracetamol 650mg",
        "usage": "For fever and pain relief",
        "sideEffects": "Liver damage in overdose"
    },
    "8901020981017": {
        "name": "Cetirizine 10mg",
        "manufacturer": "Dr. Reddy's Laboratories",
        "batchNumber": "C-202401",
        "expiryDate": "2026-03-31",
        "dosage": "10mg",
        "quantity": "10 tablets",
        "price": "₹45.00",
        "composition": "Cetirizine Hydrochloride 10mg",
        "usage": "Antihistamine for allergies",
        "sideEffects": "Drowsiness, dry mouth, dizziness"
    },
    "8901020981239": {
        "name": "Omeprazole 20mg",
        "manufacturer": "Ranbaxy Laboratories",
        "batchNumber": "O-202404",
        "expiryDate": "2026-08-31",
        "dosage": "20mg",
        "quantity": "14 capsules",
        "price": "₹95.00",
        "composition": "Omeprazole 20mg",
        "usage": "For acid reflux and ulcers",
        "sideEffects": "Headache, nausea, abdominal pain"
    },
    "125000": {
        "name": "Generic Medicine",
        "manufacturer": "Pharmaceutical Company",
        "batchNumber": "G-202401",
        "expiryDate": "2025-12-31",
        "dosage": "100mg",
        "quantity": "10 tablets",
        "price": "₹45.00",
        "composition": "Active Ingredient 100mg",
        "usage": "For general medical use",
        "sideEffects": "Mild side effects may occur"
    }
}

def decode_barcode(image):
    """
    Decode barcode from image using pyzbar library
    """
    try:
        # Convert PIL Image to OpenCV format
        open_cv_image = np.array(image) 
        # Convert RGB to BGR 
        open_cv_image = open_cv_image[:, :, ::-1].copy()
        
        # Preprocess image for better barcode detection
        gray = cv2.cvtColor(open_cv_image, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Decode barcodes
        barcodes = pyzbar.decode(thresh)
        
        if barcodes:
            # Return the first barcode found
            return barcodes[0].data.decode('utf-8')
        else:
            # Try with different preprocessing if first attempt fails
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            _, thresh2 = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            barcodes2 = pyzbar.decode(thresh2)
            if barcodes2:
                return barcodes2[0].data.decode('utf-8')
        
        return None
    except Exception as e:
        print(f"Error decoding barcode: {e}")
        return None

def get_medicine_details(barcode):
    """
    Get medicine details from database or external APIs
    """
    try:
        # Check local database first
        if barcode in MEDICINE_DATABASE:
            return MEDICINE_DATABASE[barcode]
        
        # Try external APIs if not in local database
        # Open Food Facts API
        openfoodfacts_url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
        response = requests.get(openfoodfacts_url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 1:
                product = data.get('product', {})
                return {
                    "name": product.get('product_name', 'Unknown Product'),
                    "manufacturer": product.get('brands', product.get('manufacturer', 'Unknown Manufacturer')),
                    "batchNumber": product.get('lot_number', 'Not Available'),
                    "expiryDate": product.get('expiration_date', product.get('best_before_date', 'Not Available')),
                    "dosage": product.get('nutrition_grades_tags', 'Not Available'),
                    "quantity": product.get('quantity', 'Not Available'),
                    "price": product.get('price', 'Not Available'),
                    "composition": product.get('ingredients_text', 'Not Available'),
                    "usage": product.get('usage_instructions', 'Follow doctor\'s instructions'),
                    "sideEffects": "Not specified"
                }
        
        # UPC Item DB API
        upcitemdb_url = f"https://api.upcitemdb.com/prod/trial/lookup?upc={barcode}"
        response = requests.get(upcitemdb_url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('items'):
                item = data['items'][0]
                return {
                    "name": item.get('title', 'Unknown Product'),
                    "manufacturer": item.get('brand', item.get('manufacturer', 'Unknown Manufacturer')),
                    "batchNumber": 'Not Available',
                    "expiryDate": 'Not Available',
                    "dosage": item.get('size', 'Not Available'),
                    "quantity": item.get('quantity', 'Not Available'),
                    "price": item.get('lowest_recorded_price', 'Not Available'),
                    "composition": 'Not Available',
                    "usage": 'Follow product instructions',
                    "sideEffects": "Not specified"
                }
        
        return None
    except Exception as e:
        print(f"Error fetching medicine details: {e}")
        return None

@app.route('/api/scan', methods=['POST'])
def scan_barcode():
    """
    API endpoint for barcode scanning
    """
    try:
        # Get image data from request
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({"error": "No image data provided"}), 400
        
        # Decode base64 image
        image_data = data['image'].split(',')[1]
        img_bytes = base64.b64decode(image_data)
        img = Image.open(io.BytesIO(img_bytes))
        
        # Decode barcode
        barcode = decode_barcode(img)
        if not barcode:
            return jsonify({"error": "No barcode detected"}), 400
        
        # Get medicine details
        medicine = get_medicine_details(barcode)
        if not medicine:
            return jsonify({"error": f"Medicine with barcode {barcode} not found"}), 404
        
        return jsonify({
            "barcode": barcode,
            "medicine": medicine
        })
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/medicines/<barcode>', methods=['GET'])
def get_medicine(barcode):
    """
    API endpoint to get medicine details by barcode
    """
    medicine = get_medicine_details(barcode)
    if medicine:
        return jsonify({"barcode": barcode, "medicine": medicine})
    else:
        return jsonify({"error": f"Medicine with barcode {barcode} not found"}), 404

@app.route('/api/medicines', methods=['GET'])
def get_all_medicines():
    """
    API endpoint to get all medicines in database
    """
    return jsonify({"medicines": list(MEDICINE_DATABASE.items())})

if __name__ == '__main__':
    # Check if required packages are installed
    try:
        import pyzbar
        import cv2
        import numpy
        import PIL
    except ImportError as e:
        print(f"Required package not installed: {e}")
        print("Please install required packages with:")
        print("pip install flask pyzbar opencv-python pillow numpy requests")
    
    app.run(host='0.0.0.0', port=5000, debug=True)