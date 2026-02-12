import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';

const ScannerPage = () => {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopScan();
  }, []);

  const startScan = async () => {
    try {
      const scanner = new Html5Qrcode('reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (text) => {
          setResult(text);
          stopScan();
        },
        () => {}
      );
      setScanning(true);
      setError(null);
    } catch (err) {
      setError('Camera access denied. Please allow permissions.');
    }
  };

  const stopScan = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
      scannerRef.current.clear();
      setScanning(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const scanner = new Html5Qrcode('reader');
      const text = await scanner.scanFile(file, true);
      setResult(text);
    } catch {
      setError('No QR/barcode found in image.');
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    alert('Copied!');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 
                     rounded-lg transition"
        >
          ← Back
        </button>
        <h1 className="text-lg font-semibold">📷 Scanner</h1>
        <div className="w-16" />
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto p-6 space-y-5">

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 
                          text-red-300 px-4 py-3 rounded-xl text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Scanner Region */}
        <div className="rounded-2xl overflow-hidden border border-indigo-500/30 bg-black">
          <div id="reader" className="w-full" />
          {!scanning && !result && (
            <div className="py-20 text-center text-gray-500">
              <p className="text-5xl mb-3">📸</p>
              <p>Click "Start Scan" to begin</p>
            </div>
          )}
        </div>

        {/* Controls */}
        {!result && (
          <div className="flex gap-3">
            {!scanning ? (
              <button
                onClick={startScan}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 
                           rounded-xl font-semibold transition"
              >
                📷 Start Scan
              </button>
            ) : (
              <button
                onClick={stopScan}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 
                           rounded-xl font-semibold transition"
              >
                ⏹ Stop
              </button>
            )}

            <label className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 
                              rounded-xl font-semibold text-center cursor-pointer 
                              border border-dashed border-gray-600 transition">
              📁 Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-green-500/10 border border-green-500/30 
                          rounded-2xl p-5 space-y-4">
            <h3 className="text-lg font-semibold text-green-400">
              ✅ Scan Successful!
            </h3>

            <p className="bg-black/40 p-3 rounded-lg font-mono text-sm break-all">
              {result}
            </p>

            <div className="flex gap-3">
              <button
                onClick={copyResult}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 
                           rounded-lg text-sm font-medium transition"
              >
                📋 Copy
              </button>

              {result.startsWith('http') && (
                <a
                  href={result}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 
                             rounded-lg text-sm font-medium transition"
                >
                  🔗 Open Link
                </a>
              )}

              <button
                onClick={() => { setResult(null); setError(null); }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 
                           rounded-lg text-sm font-medium transition"
              >
                🔄 Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannerPage;