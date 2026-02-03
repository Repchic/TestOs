import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useStore } from '../store';

type View = 'clock' | 'timer' | 'stopwatch' | 'alarm';

export default function ClockApp() {
  const { isDarkMode } = useStore();
  const [view, setView] = useState<View>('clock');
  const [time, setTime] = useState(dayjs());
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [stopwatchActive, setStopwatchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      const interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerActive, timerSeconds]);

  useEffect(() => {
    if (stopwatchActive) {
      const interval = setInterval(() => {
        setStopwatchSeconds(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [stopwatchActive]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const worldCities = [
    { name: 'New York', offset: -5 },
    { name: 'London', offset: 0 },
    { name: 'Tokyo', offset: 9 },
    { name: 'Sydney', offset: 11 },
    { name: 'Paris', offset: 1 },
    { name: 'Dubai', offset: 4 },
  ];

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {(['clock', 'timer', 'stopwatch', 'alarm'] as View[]).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 py-3 capitalize ${
              view === v
                ? 'border-b-2 border-blue-500 font-semibold'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {view === 'clock' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-7xl font-light mb-2">{time.format('HH:mm:ss')}</div>
              <div className="text-2xl opacity-70">{time.format('dddd, MMMM D, YYYY')}</div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">World Clock</h3>
              <div className="grid grid-cols-2 gap-4">
                {worldCities.map(city => {
                  const cityTime = time.add(city.offset, 'hour');
                  return (
                    <div
                      key={city.name}
                      className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                    >
                      <div className="text-lg font-semibold">{city.name}</div>
                      <div className="text-3xl font-light">{cityTime.format('HH:mm')}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {view === 'timer' && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-8xl font-light mb-8">{formatTime(timerSeconds)}</div>
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setTimerSeconds(prev => prev + 60)}
                className={`px-4 py-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                +1 Min
              </button>
              <button
                onClick={() => setTimerSeconds(prev => prev + 300)}
                className={`px-4 py-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                +5 Min
              </button>
              <button
                onClick={() => setTimerSeconds(prev => prev + 600)}
                className={`px-4 py-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                +10 Min
              </button>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setTimerActive(!timerActive)}
                className="px-8 py-3 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                {timerActive ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={() => {
                  setTimerActive(false);
                  setTimerSeconds(0);
                }}
                className={`px-8 py-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {view === 'stopwatch' && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-8xl font-light mb-8">{formatTime(stopwatchSeconds)}</div>
            <div className="flex gap-4">
              <button
                onClick={() => setStopwatchActive(!stopwatchActive)}
                className="px-8 py-3 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                {stopwatchActive ? 'Stop' : 'Start'}
              </button>
              <button
                onClick={() => {
                  setStopwatchActive(false);
                  setStopwatchSeconds(0);
                }}
                className={`px-8 py-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {view === 'alarm' && (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="text-6xl mb-4">⏰</div>
              <div className="text-xl opacity-70">Alarm feature coming soon!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
