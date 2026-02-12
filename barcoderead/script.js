// Function to get medicine details from Python backend or external APIs
async function getMedicineDetailsFromAPI(barcode) {
    try {
        // First try our Python backend API
        try {
            const backendResponse = await fetch('http://localhost:5000/api/medicines/' + barcode);
            if (backendResponse.ok) {
                const data = await backendResponse.json();
                if (data.medicine) {
                    console.log('Medicine details from backend API');
                    return data.medicine;
                }
            }
        } catch (error) {
            console.log('Backend API not available, using fallback APIs');
        }

        // Try multiple API endpoints to get medicine data
        const apiEndpoints = [
            // Open Food Facts API (works for many products including medicines)
            `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
            // Open Products Database (alternative source)
            `https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`,
            // Barcode Lookup API (another option)
            `https://api.barcodelookup.com/v2/products?barcode=${barcode}&key=YOUR_API_KEY` // Replace with your API key
        ];

        for (let apiUrl of apiEndpoints) {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) continue;
                
                const data = await response.json();
                
                // Extract medicine details based on API response format
                if (apiUrl.includes('openfoodfacts')) {
                    if (data.status === 1) {
                        return parseOpenFoodFacts(data.product);
                    }
                } else if (apiUrl.includes('upcitemdb')) {
                    if (data.items && data.items.length > 0) {
                        return parseUpcItemDb(data.items[0]);
                    }
                } else if (apiUrl.includes('barcodelookup')) {
                    if (data.products && data.products.length > 0) {
                        return parseBarcodeLookup(data.products[0]);
                    }
                }
            } catch (error) {
                console.log(`API failed: ${apiUrl}`, error);
                continue;
            }
        }

        // If all APIs fail, use fallback medicine database
        const fallbackData = getFallbackMedicineData(barcode);
        if (fallbackData) {
            return fallbackData;
        }

        return null;
    } catch (error) {
        console.error('Error fetching medicine details:', error);
        return null;
    }
}

// Fallback medicine database for known barcodes
function getFallbackMedicineData(barcode) {
    const fallbackDatabase = {
        "8901020980123": {
            name: "Paracetamol 500mg",
            manufacturer: "Cipla Ltd.",
            batchNumber: "P-202401",
            expiryDate: "2025-12-31",
            dosage: "500mg",
            quantity: "10 tablets",
            price: "₹25.00",
            composition: "Paracetamol 500mg",
            usage: "For pain relief and fever reduction",
            sideEffects: "Nausea, vomiting, liver damage in overdose"
        },
        "8901020980454": {
            name: "Amoxicillin 250mg",
            manufacturer: "Sun Pharmaceutical",
            batchNumber: "A-202403",
            expiryDate: "2026-06-30",
            dosage: "250mg",
            quantity: "14 capsules",
            price: "₹85.00",
            composition: "Amoxicillin 250mg",
            usage: "Antibiotic for bacterial infections",
            sideEffects: "Diarrhea, nausea, allergic reactions"
        },
        "8901020980782": {
            name: "Dolo 650",
            manufacturer: "Micro Labs Ltd.",
            batchNumber: "D-202402",
            expiryDate: "2025-09-30",
            dosage: "650mg",
            quantity: "15 tablets",
            price: "₹35.00",
            composition: "Paracetamol 650mg",
            usage: "For fever and pain relief",
            sideEffects: "Liver damage in overdose"
        },
        "8901020981017": {
            name: "Cetirizine 10mg",
            manufacturer: "Dr. Reddy's Laboratories",
            batchNumber: "C-202401",
            expiryDate: "2026-06-30",
            dosage: "10mg",
            quantity: "10 tablets",
            price: "₹45.00",
            composition: "Cetirizine Hydrochloride 10mg",
            usage: "Antihistamine for allergies",
            sideEffects: "Drowsiness, dry mouth, dizziness"
        },
        "8901020981239": {
            name: "Omeprazole 20mg",
            manufacturer: "Ranbaxy Laboratories",
            batchNumber: "O-202404",
            expiryDate: "2026-06-30",
            dosage: "20mg",
            quantity: "14 capsules",
            price: "₹95.00",
            composition: "Omeprazole 20mg",
            usage: "For acid reflux and ulcers",
            sideEffects: "Headache, nausea, abdominal pain"
        },
        "125000": {
            name: "Generic Medicine",
            manufacturer: "Pharmaceutical Company",
            batchNumber: "G-202401",
            expiryDate: "2025-12-31",
            dosage: "100mg",
            quantity: "10 tablets",
            price: "₹45.00",
            composition: "Active Ingredient 100mg",
            usage: "For general medical use",
            sideEffects: "Mild side effects may occur"
        }
    };

    return fallbackDatabase[barcode];
}

// Parse Open Food Facts API response
function parseOpenFoodFacts(product) {
    return {
        name: product.product_name || "Unknown Product",
        manufacturer: product.brands || product.manufacturer || "Unknown Manufacturer",
        batchNumber: product.lot_number || "Not Available",
        expiryDate: product.expiration_date || product.best_before_date || "Not Available",
        dosage: product.nutriments ? `${product.nutriments['energy-kcal']} kcal` : "Not Available",
        quantity: product.quantity || "Not Available",
        price: product.price || "Not Available",
        composition: product.ingredients_text || "Not Available",
        usage: product.usage_instructions || "Follow doctor's instructions",
        sideEffects: "Not specified"
    };
}

// Parse UPC Item DB API response
function parseUpcItemDb(item) {
    return {
        name: item.title || "Unknown Product",
        manufacturer: item.brand || item.manufacturer || "Unknown Manufacturer",
        batchNumber: "Not Available",
        expiryDate: "Not Available",
        dosage: item.size || "Not Available",
        quantity: item.quantity || "Not Available",
        price: item.lowest_recorded_price ? `₹${item.lowest_recorded_price}` : "Not Available",
        composition: "Not Available",
        usage: "Follow product instructions",
        sideEffects: "Not specified"
    };
}

// Parse Barcode Lookup API response
function parseBarcodeLookup(product) {
    return {
        name: product.title || "Unknown Product",
        manufacturer: product.manufacturer || "Unknown Manufacturer",
        batchNumber: "Not Available",
        expiryDate: "Not Available",
        dosage: product.description || "Not Available",
        quantity: "Not Available",
        price: product.price || "Not Available",
        composition: "Not Available",
        usage: "Follow doctor's instructions",
        sideEffects: "Not specified"
    };
}

// DOM elements
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const previewContainer = document.getElementById('previewContainer');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const success = document.getElementById('success');
const resultsSection = document.getElementById('resultsSection');
const medicineDetails = document.getElementById('medicineDetails');

// Initialize barcode reader
const codeReader = new ZXing.BrowserMultiFormatReader();

// File input change event
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            previewContainer.style.display = 'block';
            scanBarcode(e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Scan barcode from image
async function scanBarcode(imageData) {
    try {
        // Show loading indicator
        loading.classList.add('show');
        error.classList.remove('show');
        success.classList.remove('show');
        resultsSection.classList.remove('show');
        medicineDetails.innerHTML = '';

        // Create a temporary canvas to scan barcode
        const img = new Image();
        img.src = imageData;
        
        img.onload = async function() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                const result = await codeReader.decodeFromImageElement(img);
                console.log('Barcode detected:', result.text);
                
                // Show barcode detection message
                success.textContent = `Barcode successfully scanned: ${result.text}`;
                success.classList.add('show');
                
                // Get medicine details from API
                loading.textContent = 'Fetching medicine details...';
                const medicine = await getMedicineDetailsFromAPI(result.text);
                
                // Hide loading indicator
                loading.classList.remove('show');
                
                if (medicine) {
                    displayMedicineDetails(medicine);
                } else {
                    displayMedicineNotFound(result.text);
                }
            } catch (err) {
                console.error('Error decoding barcode:', err);
                loading.classList.remove('show');
                error.textContent = 'Error: Could not detect barcode in the image. Please try a clearer photo.';
                error.classList.add('show');
            }
        };
    } catch (err) {
        console.error('Error:', err);
        loading.classList.remove('show');
        error.textContent = 'Error: Failed to process the image. Please try again.';
        error.classList.add('show');
    }
}

// Display medicine details
function displayMedicineDetails(medicine) {
    resultsSection.classList.add('show');
    
    const details = [
        { label: 'Medicine Name', value: medicine.name },
        { label: 'Manufacturer', value: medicine.manufacturer },
        { label: 'Batch Number', value: medicine.batchNumber },
        { label: 'Expiry Date', value: medicine.expiryDate },
        { label: 'Dosage', value: medicine.dosage },
        { label: 'Quantity', value: medicine.quantity },
        { label: 'Price', value: medicine.price },
        { label: 'Composition', value: medicine.composition },
        { label: 'Usage', value: medicine.usage },
        { label: 'Side Effects', value: medicine.sideEffects }
    ];
    
    details.forEach(detail => {
        const row = document.createElement('tr');
        const labelCell = document.createElement('td');
        const valueCell = document.createElement('td');
        
        labelCell.textContent = detail.label;
        valueCell.textContent = detail.value;
        
        row.appendChild(labelCell);
        row.appendChild(valueCell);
        medicineDetails.appendChild(row);
    });
}

// Display medicine not found
function displayMedicineNotFound(barcode) {
    resultsSection.classList.add('show');
    
    const row = document.createElement('tr');
    const labelCell = document.createElement('td');
    const valueCell = document.createElement('td');
    
    labelCell.textContent = 'Error';
    valueCell.textContent = `Medicine with barcode ${barcode} not found in database.`;
    valueCell.colSpan = 2;
    valueCell.style.color = '#c62828';
    valueCell.style.fontWeight = 'bold';
    
    row.appendChild(labelCell);
    row.appendChild(valueCell);
    medicineDetails.appendChild(row);
}