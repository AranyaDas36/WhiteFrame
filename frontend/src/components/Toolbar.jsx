import React from 'react';

const COLORS = [
  { name: 'Black', value: 'black', class: 'bg-black' },
  { name: 'Red', value: 'red', class: 'bg-red-500' },
  { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
];

export default function Toolbar({ color, setColor, width, setWidth, onClear }) {
  return (
    <div className="flex gap-6 items-center mb-4 bg-white rounded-lg shadow px-6 py-3">
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-700">Color:</span>
        <div className="flex gap-2">
          {COLORS.map(c => (
            <button
              key={c.value}
              type="button"
              className={`w-7 h-7 rounded-full border-2 ${c.class} ${color === c.value ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'}`}
              onClick={() => setColor(c.value)}
              aria-label={c.name}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-700">Width:</span>
        <input
          type="range"
          min={2}
          max={16}
          value={width}
          onChange={e => setWidth(Number(e.target.value))}
          className="accent-blue-500 w-28"
        />
        <span className="w-8 text-center font-mono text-gray-600">{width}</span>
      </div>
      <button
        onClick={onClear}
        className="ml-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded-lg shadow transition"
      >
        Clear Canvas
      </button>
    </div>
  );
}