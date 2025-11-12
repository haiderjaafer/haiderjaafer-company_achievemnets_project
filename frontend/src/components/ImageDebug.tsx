// components/ImageDebug.SIMPLE.tsx
'use client';

import { useEffect, useState } from 'react';
import { transformToCarouselItems, useCurrentMonthMedia } from '../lib/hooks/useMedia';


export const ImageDebugSimple = () => {
  const { data, isLoading, error } = useCurrentMonthMedia();
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebug = (message: string) => {
    console.log(message);
    setDebugInfo((prev) => [...prev, message]);
  };

  useEffect(() => {
    if (!data) return;

    addDebug(`✅ API Data loaded: ${data.data.length} items`);

    const items = transformToCarouselItems(data.data);
    addDebug(`✅ Transformed to carousel items: ${items.length} items`);

    items.forEach((item, idx) => {
      const rawPath = item.allPaths[0]?.file_path;
      const convertedUrl = item.imageUrl;

      addDebug(`---`);
      addDebug(`Item ${idx + 1}: ${item.title}`);
      addDebug(`Raw path: ${rawPath}`);
      addDebug(`Converted URL: ${convertedUrl}`);
      addDebug(`URL type: ${convertedUrl?.startsWith('/api/') ? 'Proxy (GOOD ✅)' : 'Direct (BAD ❌)'}`);
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="p-8 bg-slate-900 text-white">
        <p>Loading media data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-900 text-white">
        <p>Error loading media: {error.message}</p>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="p-8 bg-slate-900 text-white">
        <p>No media found</p>
      </div>
    );
  }

  const items = transformToCarouselItems(data.data);
  const firstItem = items[0];

  return (
    <div className="p-8 bg-slate-900 min-h-screen">
      {/* Debug Console Output */}
      <div className="mb-8 bg-black p-4 rounded-lg max-h-96 overflow-y-auto">
        <h2 className="text-white font-bold mb-4">Debug Console:</h2>
        <div className="space-y-1 text-xs font-mono text-green-400">
          {debugInfo.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>
      </div>

      {/* First Item Test */}
      {firstItem && (
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-white text-2xl font-bold mb-4">{firstItem.title}</h2>

          {/* Raw Path Info */}
          <div className="mb-6 bg-black p-4 rounded">
            <p className="text-gray-400 text-sm mb-2">Raw File Path:</p>
            <p className="text-yellow-300 text-xs break-all font-mono">
              {firstItem.allPaths[0]?.file_path}
            </p>
          </div>

          {/* Converted URL Info */}
          <div className="mb-6 bg-black p-4 rounded">
            <p className="text-gray-400 text-sm mb-2">Converted URL:</p>
            <p className="text-blue-300 text-xs break-all font-mono">
              {firstItem.imageUrl}
            </p>
            <p className={`text-xs mt-2 ${firstItem.imageUrl.startsWith('/api/') ? 'text-green-400' : 'text-red-400'}`}>
              {firstItem.imageUrl.startsWith('/api/') ? '✅ Using proxy (CORRECT)' : '❌ Direct path (WRONG)'}
            </p>
          </div>

          {/* Test Image Display */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-2">Test Image Display:</p>
            <div className="bg-black p-4 rounded">
              <img
                src={firstItem.imageUrl}
                alt={firstItem.title}
                className="max-w-md h-auto"
                onLoad={() => addDebug(`✅ Image loaded successfully!`)}
                onError={(e) => {
                  const error = e as any;
                  addDebug(`❌ Image failed to load`);
                  console.error('Image error:', error);
                }}
              />
            </div>
          </div>

          {/* Manual Fetch Test */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-2">Manual API Test:</p>
            <button
              onClick={async () => {
                try {
                  addDebug(`Testing fetch to: ${firstItem.imageUrl}`);
                  const response = await fetch(firstItem.imageUrl);
                  addDebug(`Status: ${response.status} ${response.statusText}`);
                  addDebug(`Content-Type: ${response.headers.get('content-type')}`);
                  addDebug(`Content-Length: ${response.headers.get('content-length')}`);

                  if (response.ok) {
                    const blob = await response.blob();
                    addDebug(`✅ Successfully fetched blob: ${blob.size} bytes`);
                  } else {
                    addDebug(`❌ Response not OK`);
                  }
                } catch (err) {
                  addDebug(`❌ Fetch error: ${err}`);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Test Fetch
            </button>
          </div>

          {/* All Paths */}
          <div>
            <p className="text-gray-400 text-sm mb-2">All Media Files ({firstItem.allPaths.length}):</p>
            <div className="space-y-2">
              {firstItem.allPaths.map((path, idx) => (
                <div key={path.id} className="bg-black p-2 rounded text-xs">
                  <p className="text-gray-300">{idx + 1}. {path.file_name}</p>
                  <p className="text-gray-500">Size: {(path.file_size / 1024).toFixed(2)} KB</p>
                  <p className="text-gray-500">Type: {path.mime_type}</p>
                  {path.is_primary && <p className="text-green-400">Primary ⭐</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};