import { useState } from 'react';
import { useStore } from '../store';

export default function MapsApp() {
  const { isDarkMode } = useStore();
  const [location, setLocation] = useState('New York, NY');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(searchQuery);
    }
  };

  const popularLocations = [
    'New York, NY',
    'San Francisco, CA',
    'London, UK',
    'Tokyo, Japan',
    'Paris, France',
    'Sydney, Australia',
  ];

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className={`p-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search for a location..."
            className={`flex-1 px-4 py-2 rounded border ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300'
            } outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto">
          {popularLocations.map(loc => (
            <button
              key={loc}
              onClick={() => setLocation(loc)}
              className={`px-3 py-1 rounded whitespace-nowrap text-sm ${
                location === loc
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative">
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=-74.0060,40.7128,-73.9352,40.7589&layer=mapnik&marker=40.7128,-74.0060`}
          className="w-full h-full border-0"
          title="Map"
        />
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
          <div className="flex items-start gap-3">
            <div className="text-3xl">📍</div>
            <div>
              <div className="font-semibold">{location}</div>
              <div className="text-sm opacity-70 mt-1">
                Interactive map showing the selected location
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
