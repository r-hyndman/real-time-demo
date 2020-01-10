let socketio = undefined;
let allTilesActive = false;
let deactivationTimer = 1000;
let activeTiles = {};

const initialise = (io) => {
  socketio = io;

  setInterval(() => {
    deactivateTile();
  }, deactivationTimer);
}

const run = (socket) => {
  // new socket connected, send active tiles
  socket.emit('activeTiles', activeTiles);

  if (allTilesActive) {
    // game is already completed, notify new socket
    socket.emit('gameCompleted');
  }

  // listen for 'activateTile' events
  socket.on('activateTile', tile => {
    // attach a tile id, add the tile to the active tile collection
    const key = `${tile.x},${tile.y}`;
    tile.id = key;

    if (!activeTiles.hasOwnProperty(key)) {
      activeTiles[key] = tile;

      // send the activated tile to all connected sockets
      socketio.emit('activateTile', tile);
    }
  });

  // listen for 'allTilesActive' events
  socket.on('allTilesActive', tileCount => {
    if (allTilesActive) {
      return;
    }

    // count the number of active tiles
    const totalTiles = Object.keys(activeTiles).length;

    // compare the count of active tiles to the data received
    if (totalTiles == tileCount) {
      // complete the game
      socketio.emit('gameCompleted');
      allTilesActive = true;
    }
  });

  // listen for 'resetGame' events
  socket.on('resetGame', () => {
    resetGame();
  });
};

const randomTile = () => {
  // find existing keys
  let keys = Object.keys(activeTiles);

  // get a random key
  const randomKey = keys[(keys.length * Math.random()) << 0];

  // return the random tile
  return activeTiles[randomKey];
}

const deactivateTile = () => {
  if (allTilesActive) {
    return;
  }

  let tile = randomTile();

  if (tile) {
    socketio.emit('deactivateTile', tile.id);
    delete activeTiles[tile.id];
  }
};

const resetGame = () => {
  allTilesActive = false;
  activeTiles = {};
  socketio.emit('resetGame');
};

module.exports = { initialise, run };
