import React, { useRef, useEffect, useState } from 'react';

export default function DrawingCanvas({
  socket,
  roomId,
  color,
  width,
  onCursorMove,
  cursors,
  selfId,
  drawingData,
  setDrawingData
}) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);

  // Draw all strokes from drawingData
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawingData.forEach(cmd => {
      if (cmd.type === 'stroke') {
        drawStroke(ctx, cmd.data, false);
      } else if (cmd.type === 'clear') {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    });
  }, [drawingData]);

  // Handle remote draw events
  useEffect(() => {
    if (!socket) return;
    socket.on('draw-start', ({ data }) => setLastPoint(data.point));
    socket.on('draw-move', ({ data }) => {
        if (!data) return;
        setDrawingData(prev => [...prev, { type: 'stroke', data }]);
        setLastPoint(data.point);
      });
    socket.on('draw-end', () => setLastPoint(null));
    socket.on('clear-canvas', () => setDrawingData(prev => [...prev, { type: 'clear', data: {} }]));
    return () => {
      socket.off('draw-start');
      socket.off('draw-move');
      socket.off('draw-end');
      socket.off('clear-canvas');
    };
  }, [socket, setDrawingData]);

  const handlePointerDown = (e) => {
    setDrawing(true);
    const point = getPoint(e);
    setLastPoint(point);
    socket.emit('draw-start', { roomId, data: { point, color, width } });
  };

  const handlePointerMove = (e) => {
    if (!drawing) return;
    const point = getPoint(e);
    if (lastPoint) {
      const data = { from: lastPoint, to: point, color, width };
      setDrawingData(prev => [...prev, { type: 'stroke', data }]);
      socket.emit('draw-move', { roomId, ...data });
      setLastPoint(point);
    }
    onCursorMove(point);
  };

  const handlePointerUp = () => {
    setDrawing(false);
    setLastPoint(null);
    socket.emit('draw-end', { roomId });
  };

  function getPoint(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
      y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    };
  }

  function drawStroke(ctx, data, live = true) {
    if (!data || !data.from || !data.to) return;
    ctx.strokeStyle = data.color || 'black';
    ctx.lineWidth = data.width || 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(data.from.x, data.from.y);
    ctx.lineTo(data.to.x, data.to.y);
    ctx.stroke();
  }

  return (
    <div className="relative flex items-center justify-center w-full">
      <canvas
        ref={canvasRef}
        width={900}
        height={600}
        className="rounded-xl shadow-lg border border-gray-200 bg-gray-50 cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      />
      {/* Render user cursors */}
      {Object.entries(cursors).map(([id, cursor]) =>
        id !== selfId && cursor ? (
          <div
            key={id}
            className="absolute pointer-events-none z-10"
            style={{ left: cursor.x, top: cursor.y }}
          >
            <span className="text-pink-500 text-2xl drop-shadow">⬤</span>
          </div>
        ) : null
      )}
    </div>
  );
}