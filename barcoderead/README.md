# Medicine Barcode Scanner

A web application that reads barcodes from medicine photos and displays detailed information in a table format. Features both browser-based scanning and a Python backend for robust decoding and medicine information retrieval.

## Features

- **Barcode Scanning**: Upload a photo of a medicine barcode and instantly get details
- **Dual Decoding System**: Browser-based ZXing library and Python backend with pyzbar for better accuracy
- **Medicine Database**: Contains sample data for common medicines with fallback support
- **Real-time API Lookup**: Integration with Open Food Facts and UPC Item DB APIs
- **Responsive Design**: Works on desktop and mobile devices
- **User-Friendly Interface**: Clean, modern design with intuitive controls
- **Real-time Feedback**: Loading indicators and error handling

## Technologies Used

### Frontend
- **HTML5**: Structure and layout
- **CSS3**: Styling with gradients and animations
- **JavaScript (ES6+)**: Barcode decoding and UI interactions
- **ZXing Library**: Browser-based barcode scanning functionality
- **Bootstrap-like Design**: Modern, responsive interface

### Backend
- **Python 3**: Backend API development
- **Flask**: Lightweight web framework
- **pyzbar**: Barcode decoding library
- **OpenCV**: Image processing for better barcode detection
- **Pillow**: Image manipulation
- **Requests**: API communication

## How to Use

### Option 1: Browser-only (No installation)
1. Open `index.html` in a web browser
2. Click the "Upload Photo" button to select an image with a medicine barcode
3. The application will automatically scan and decode the barcode
4. View detailed medicine information in the table

### Option 2: Full Application with Python Backend
1. **Install Python Requirements**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the Backend Server**:
   ```bash
   python backend.py
   ```

3. **Open the Application**: Launch `index.html` in a web browser

4. **Upload and Scan**: Follow the same steps as the browser-only version

## Supported Barcode Formats

The application supports all major barcode formats including:
- EAN-13 (13-digit European Article Number)
- UPC-A (12-digit Universal Product Code)
- Code 128, Code 39
- QR Codes (if using QR code formats)
- Data Matrix

## Medicine Database

The application includes sample data for common medicines:
- Paracetamol 500mg
- Amoxicillin 250mg  
- Dolo 650
- Cetirizine 10mg
- Omeprazole 20mg
- Generic Medicine (for testing with barcode "125000")

## Adding New Medicines

To add new medicines to the database:

1. Open `script.js` (for browser fallback)
2. Update the `getFallbackMedicineData()` function
3. Or update `backend.py` (for Python backend)
4. Use the barcode as the key
5. Include all required properties

Example:
```javascript
"1234567890123": {
    name: "New Medicine",
    manufacturer: "Pharmaceutical Company",
    batchNumber: "N-202405",
    expiryDate: "2026-12-31",
    dosage: "100mg",
    quantity: "30 tablets",
    price: "₹150.00",
    composition: "Active Ingredient 100mg",
    usage: "Usage instructions",
    sideEffects: "Possible side effects"
}
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Limitations

- Browser-only mode requires internet connection to load ZXing library
- Works best with clear, well-lit photos of barcodes
- Limited to the medicines in the predefined database
- APIs may have rate limits and CORS restrictions

## Future Enhancements

- Integration with real pharmaceutical databases
- Camera access for live scanning
- Batch scanning multiple barcodes
- Printing and export functionality
- Medicine expiry alerts
- Search and filter capabilities
- Offline support with local storage

## API Documentation

The Python backend provides the following API endpoints:

### GET /api/medicines/<barcode>
Get medicine details by barcode

```bash
curl "http://localhost:5000/api/medicines/8901020980123"
```

### GET /api/medicines
Get all medicines in database

```bash
curl "http://localhost:5000/api/medicines"
```

### POST /api/scan
Scan barcode from image

```bash
curl -X POST http://localhost:5000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_encoded_image_data"}'
```

## Installation

1. Download or clone the repository
2. For browser-only use: Open `index.html` in a web browser
3. For full functionality: Install Python requirements and run the backend

No additional installation or server setup required!