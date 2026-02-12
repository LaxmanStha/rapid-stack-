<?php
/**
 * Main Entry Point
 * Routes requests to appropriate handlers
 * 
 * For development: php -S localhost:8000 index.php
 * For production: Configure your web server (Apache/Nginx) to point here
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// API routes
if (strpos($uri, '/api/') === 0) {
    $apiFile = __DIR__ . $uri;
    if (file_exists($apiFile)) {
        require $apiFile;
        exit;
    }
    
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'API endpoint not found']);
    exit;
}

// Static files
$publicPath = __DIR__ . '/public' . $uri;

// Serve index.html for root
if ($uri === '/' || $uri === '') {
    $publicPath = __DIR__ . '/public/index.html';
}

// Check if file exists in public directory
if (file_exists($publicPath) && !is_dir($publicPath)) {
    // Set appropriate content type
    $ext = pathinfo($publicPath, PATHINFO_EXTENSION);
    $mimeTypes = [
        'html' => 'text/html',
        'css'  => 'text/css',
        'js'   => 'application/javascript',
        'json' => 'application/json',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif'  => 'image/gif',
        'svg'  => 'image/svg+xml',
        'ico'  => 'image/x-icon',
        'woff' => 'font/woff',
        'woff2'=> 'font/woff2',
        'ttf'  => 'font/ttf',
    ];

    if (isset($mimeTypes[$ext])) {
        header('Content-Type: ' . $mimeTypes[$ext]);
    }

    readfile($publicPath);
    exit;
}

// Default: serve index.html (SPA fallback)
header('Content-Type: text/html');
readfile(__DIR__ . '/public/index.html');
