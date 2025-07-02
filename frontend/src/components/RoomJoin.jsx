import React, { useState } from 'react';

export default function RoomJoin({ onJoin }) {
  const [roomId, setRoomId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId.length >= 6 && roomId.length <= 8) {
      onJoin(roomId);
    } else {
      alert('Room code must be 6-8 alphanumeric characters');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-8 flex flex-col items-center w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-gray-700">Join a Whiteboard Room</h1>
        <input
          type="text"
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
          placeholder="Enter Room Code"
          minLength={6}
          maxLength={8}
          required
          className="text-xl p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full mb-4 transition"
        />
        <button type="submit" className="text-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition">Join</button>
      </form>
    </div>
  );
}