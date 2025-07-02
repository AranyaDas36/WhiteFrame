import Room from '../models/Room.js';

const userCounts = {};

export function setupSocket(io) {
  io.on('connection', (socket) => {
    let currentRoom = null;

    socket.on('join-room', async ({ roomId }) => {
      if (currentRoom) socket.leave(currentRoom);
      currentRoom = roomId;
      socket.join(roomId);

      // Track user count
      userCounts[roomId] = (userCounts[roomId] || 0) + 1;
      io.to(roomId).emit('user-count', userCounts[roomId]);

      // Send existing drawing data
      const room = await Room.findOne({ roomId });
      if (room) {
        socket.emit('init-drawing', room.drawingData);
      }
    });

    socket.on('leave-room', ({ roomId }) => {
      socket.leave(roomId);
      if (userCounts[roomId]) {
        userCounts[roomId]--;
        io.to(roomId).emit('user-count', userCounts[roomId]);
      }
    });

    socket.on('cursor-move', ({ roomId, cursor }) => {
      socket.to(roomId).emit('cursor-move', { socketId: socket.id, cursor });
    });

    socket.on('draw-start', (data) => {
        socket.to(currentRoom).emit('draw-move', { data }); // wrap in { data }
    });

    socket.on('draw-move', async (data) => {
        socket.to(currentRoom).emit('draw-move', { data }); // wrap in { data }
        // Save to DB
      await Room.updateOne(
        { roomId: currentRoom },
        {
          $push: { drawingData: { type: 'stroke', data, timestamp: new Date() } },
          $set: { lastActivity: new Date() }
        }
      );
    });

    socket.on('draw-end', (data) => {
      socket.to(currentRoom).emit('draw-end', { socketId: socket.id, ...data });
    });

    socket.on('clear-canvas', async () => {
      socket.to(currentRoom).emit('clear-canvas');
      await Room.updateOne(
        { roomId: currentRoom },
        {
          $push: { drawingData: { type: 'clear', data: {}, timestamp: new Date() } },
          $set: { lastActivity: new Date() }
        }
      );
    });

    socket.on('disconnect', () => {
      if (currentRoom && userCounts[currentRoom]) {
        userCounts[currentRoom]--;
        io.to(currentRoom).emit('user-count', userCounts[currentRoom]);
      }
    });
  });
}