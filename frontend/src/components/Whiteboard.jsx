import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';

const API_URL = 'https://whiteframe.onrender.com';

export default function Whiteboard({ roomId, onLeave }) {
  const [socket, setSocket] = useState(null);
  const [color, setColor] = useState('black');
  const [width, setWidth] = useState(4);
  const [userCount, setUserCount] = useState(1);
  const [cursors, setCursors] = useState({});
  const [drawingData, setDrawingData] = useState([]);
  const [selfId, setSelfId] = useState('');

  useEffect(() => {
    const s = io(API_URL);
    setSocket(s);

    s.on('connect', () => {
      setSelfId(s.id);
      s.emit('join-room', { roomId });
    });

    s.on('init-drawing', (data) => setDrawingData(data));
    s.on('user-count', setUserCount);

    s.on('cursor-move', ({ socketId, cursor }) => {
      setCursors(prev => ({ ...prev, [socketId]: cursor }));
    });

    return () => {
      s.emit('leave-room', { roomId });
      s.disconnect();
    };
  }, [roomId]);

  const handleCursorMove = (point) => {
    if (socket) socket.emit('cursor-move', { roomId, cursor: point });
    setCursors(prev => ({ ...prev, [selfId]: point }));
  };

  const handleClear = () => {
    if (socket) socket.emit('clear-canvas', { roomId });
    setDrawingData(prev => [...prev, { type: 'clear', data: {} }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
          <Toolbar color={color} setColor={setColor} width={width} setWidth={setWidth} onClear={handleClear} />
          <div className="flex items-center gap-4">
            <span className="inline-block bg-blue-100 text-blue-700 font-semibold px-4 py-1 rounded-full shadow">Users: {userCount}</span>
            <button onClick={onLeave} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-5 rounded-lg shadow transition">Leave Room</button>
          </div>
        </div>
        <DrawingCanvas
          socket={socket}
          roomId={roomId}
          color={color}
          width={width}
          onCursorMove={handleCursorMove}
          cursors={cursors}
          selfId={selfId}
          drawingData={drawingData}
          setDrawingData={setDrawingData}
        />
        <UserCursors cursors={cursors} selfId={selfId} />
      </div>
    </div>
  );
}