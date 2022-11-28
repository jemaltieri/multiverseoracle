import logo from './icon-512x512.png';
import './App.css';
import React, { useState } from 'react';

const FETCH_URL = 'https://qrng.anu.edu.au/API/jsonI.php?length=1024&type=uint8'

const MEGAMILLIONS = [
  {
      name: "White Balls",
      numPicks: 5,
      min: 1,
      max: 70
  },
  {
      name: "Mega Ball",
      numPicks: 1,
      min: 1,
      max: 25
  },
];

function GameDisplay({pickedGame}) {
  if (pickedGame == null) {
    return null
  }
  let headerCells = pickedGame.map((pool, i) => {
    if (!pool) {
      return null
    }
    if (pool.numPicks > 1) {
      return (
        <th
          colSpan={`${pool.numPicks}`}
          key={i}
        >{pool.name}</th>
      )
    } else {
      return (
        <th scope="col" key={i}>{pool.name}</th>
      )
    }
  })
  let flattenedPicks = pickedGame.map((pool) => {
    if (!pool) {
      return null
    }
    return pool.picks
  }).flat(1)
  let pickCells = flattenedPicks.map((pick, i) => {
    return <td key={i}>{pick}</td>
  });
  return (
    <table>
      <thead>
        <tr>
          {headerCells}
        </tr>
      </thead>
      <tbody>
        <tr>
          {pickCells}
        </tr>
        </tbody>
    </table>
  )
}

function ConsultButton({onClick, requestStarted, requestCompleted}) {
  let buttonText = "Consult Oracle";
  let isDisabled = false;
  if (requestCompleted) {
    buttonText = "Consult Again";
  } else if (requestStarted) {
    buttonText = "Consulting"
    isDisabled = true;
  }
  return (
    <button onClick={onClick} disabled={isDisabled}>{buttonText}</button>
  )
}

function Oracle() {
  const [requestStarted, updateRequestStarted] = useState(false);
  const [requestCompleted, updateRequestCompleted] = useState(false);
  const [pickedGame, updatePickedGame] = useState([]);

  function parsePicks(result) {
    let data = result.data;
    let d_i = 0;
    return MEGAMILLIONS.map(pool => {
      let picks = [];
      for (let i = 0; i < pool.numPicks; i++) {
        while (picks.includes(data[d_i]) || data[d_i] > pool.max || data[d_i] < pool.min) { //FIXME: guard against running out of data
          d_i++;
        }
        picks.push(data[d_i]);
        d_i++;
      }
      return {
        ...pool,
        picks: picks,
      }
    });
  }

  var onFetchResult = (result) => {
    updatePickedGame(parsePicks(result));
    updateRequestCompleted(true);
  }

  var onFetchError = (e) => {
    console.log("fetch error")
    console.log(e)
    updateRequestCompleted(true);
  }

  var fetchExternalNumbers = () => {
    updateRequestCompleted(false);
    updateRequestStarted(true);
    fetch(FETCH_URL)
    .then(res => res.json())
    .then(onFetchResult, onFetchError);
  }

  var handleConsult = (e) => {
    e.preventDefault();
    fetchExternalNumbers();
  }

  let pickDisplay = null;
  if (requestCompleted === true) {
    pickDisplay = (
      <GameDisplay pickedGame={pickedGame} />
    )
  }
  return (
    <form id="mainform">
      <ConsultButton 
        onClick={handleConsult}
        requestStarted={requestStarted}
        requestCompleted={requestCompleted} />
      {pickDisplay}
    </form>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Oracle />
      </header>
    </div>
  );
}

export default App;
