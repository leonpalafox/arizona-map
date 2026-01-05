'use client';

import { ArizonaMap } from '@/components/Map/ArizonaMap';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { Legend } from '@/components/Legend/Legend';

export default function Home() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

  if (!mapboxToken) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-700 mb-4">
            Mapbox token is not configured. Please set the NEXT_PUBLIC_MAPBOX_TOKEN environment variable.
          </p>
          <div className="bg-gray-50 p-4 rounded text-sm">
            <p className="font-mono text-xs mb-2">Create a .env.local file with:</p>
            <code className="block bg-gray-800 text-white p-2 rounded">
              NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
            </code>
          </div>
          <p className="text-gray-600 text-sm mt-4">
            Get a free token at{' '}
            <a
              href="https://account.mapbox.com/access-tokens/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 relative">
        <ArizonaMap mapboxToken={mapboxToken} />
        <Legend />
      </div>
    </div>
  );
}
