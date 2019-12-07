import React from 'react';
import LeftBar from "views/components/leftBar/leftBar";
import CurrentRoom from "views/components/currentRoom/current-room";
import DisconnectionAlert from "views/components/disconnectionAlert/disconnectionAlert";
function App() {
  return (
    <div className="app" role="main">
      {//<DisconnectionAlert />
      }
      <LeftBar />
      <CurrentRoom />

    </div>
  );
}

export default App;
