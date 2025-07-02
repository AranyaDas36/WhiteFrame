import React, { useState } from 'react';
import RoomJoin from './components/RoomJoin';
import Whiteboard from './components/Whiteboard';

function App() {
  const [roomId, setRoomId] = useState(null);

  return (
    <div>
      {!roomId ? (
        <RoomJoin onJoin={setRoomId} />
      ) : (
        <Whiteboard roomId={roomId} onLeave={() => setRoomId(null)} />
      )}
    </div>
  );
}

export default App;