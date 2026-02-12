<?php
/**
 * Test API Response Script
 * This script will test the signup API and display the raw response
 */
?>
<!DOCTYPE html>
<html>
<head>
    <title>API Response Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .section {
            background: white;
            padding: 20px;
            margin: 10px 0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .btn {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        }
        .btn:hover {
            background: #0056b3;
        }
        .result {
            margin: 10px 0;
            padding: 10px;
            border-radius: 4px;
            white-space: pre-wrap;
            font-family: monospace;
            font-size: 14px;
        }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
        pre {
            margin: 0;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h1>API Response Test</h1>
    
    <div class="section">
        <h2>Test Signup API</h2>
        <form id="testForm">
            <input type="text" id="name" placeholder="Name" value="Test User" required>
            <input type="email" id="email" placeholder="Email" value="newtest@example.com" required>
            <input type="password" id="password" placeholder="Password" value="password123" required>
            <button type="submit" class="btn">Test Signup API</button>
        </form>
        
        <div class="section">
            <h3>Raw Response:</h3>
            <div id="rawResponse" class="result info"></div>
        </div>
        
        <div class="section">
            <h3>Decoded Response:</h3>
            <div id="decodedResponse" class="result info"></div>
        </div>
    </div>

    <script>
        document.getElementById('testForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const rawDiv = document.getElementById('rawResponse');
            const decodedDiv = document.getElementById('decodedResponse');
            
            rawDiv.textContent = 'Loading...';
            decodedDiv.textContent = '';
            
            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };
            
            try {
                const response = await fetch('http://localhost/RSB/api/signup.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                // Get raw response text
                const rawText = await response.text();
                rawDiv.textContent = rawText;
                rawDiv.className = 'result ' + (response.ok ? 'success' : 'error');
                
                // Try to decode JSON
                try {
                    const decoded = JSON.parse(rawText);
                    decodedDiv.textContent = JSON.stringify(decoded, null, 2);
                    decodedDiv.className = 'result success';
                } catch (jsonError) {
                    decodedDiv.textContent = 'JSON Parse Error: ' + jsonError.message;
                    decodedDiv.className = 'result error';
                }
                
            } catch (error) {
                rawDiv.textContent = 'Error: ' + error.message;
                rawDiv.className = 'result error';
            }
        });
    </script>
</body>
</html>
