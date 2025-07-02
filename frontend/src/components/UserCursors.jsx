import React from 'react';

const COLORS = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6'];

export default function UserCursors({ cursors, selfId }) {
  return (
    <>
      {Object.entries(cursors).map(([id, cursor], idx) =>
        id !== selfId && cursor ? (
          <div
            key={id}
            style={{
              position: 'absolute',
              left: cursor.x,
              top: cursor.y,
              pointerEvents: 'none',
              color: COLORS[idx % COLORS.length],
              fontWeight: 'bold',
              zIndex: 10
            }}
          >
            <span style={{ fontSize: 24 }}>⬤</span>
          </div>
        ) : null
      )}
    </>
  );
}