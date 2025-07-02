import express from 'express';
import Room from '../models/Room.js';

const router = express.Router();

// POST /api/rooms/join
router.post('/join', async (req, res) => {
  const { roomId } = req.body;
  if (!roomId || typeof roomId !== 'string') {
    return res.status(400).json({ error: 'Invalid roomId' });
  }
  let room = await Room.findOne({ roomId });
  if (!room) {
    room = new Room({ roomId });
    await room.save();
  }
  res.json({ roomId: room.roomId });
});

// GET /api/rooms/:roomId
router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;
  const room = await Room.findOne({ roomId });
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json(room);
});

export default router;