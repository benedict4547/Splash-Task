import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  generateVal,
  speedStateVal,
  animStateVal,
  updateBalanceVal,
  setUsersRanking,
} from "../features/myStore";

function Start() {
  const dispatch = useDispatch();
  let [speedValue, setSpeedValue] = useState(0);
  let [generatedValue, setGeneratedValue] = useState(random(1, 9, 2));
  let [pointsValue, setPointsValue] = useState(50);
  let [multiplierValue, setMultiplierValue] = useState(1.0);
  let [autoplayersValue, setAutoplayersValue] = useState([]);

  // Import global value from Redux
  const animationShow = useSelector((state) => state.theStore.animShow);
  const userBalance = useSelector((state) => state.theStore.balance);

  function random(min, max, decimal) {
    return (Math.random() * (max - min + 1) + min).toFixed(decimal);
  }

  useEffect(() => {
    let autoplayersGuess = [];

    for (let i = 0; i < 5; i++) {
      autoplayersGuess.push({
        id: i,
        name: i === 0 ? "You" : `CPU ${i}`,
        point: "-",
        multiplier: "-",
        score: 0,
      });
    }

    setAutoplayersValue(autoplayersGuess);
    dispatch(setUsersRanking(autoplayersGuess));
  }, []);

  function generateAutoplayers() {
    let autoplayersGuess = [];

    autoplayersGuess.push({
      id: 0,
      name: "You",
      point: pointsValue,
      multiplier: multiplierValue,
      score: Math.round(pointsValue * multiplierValue),
    });

    // Generate guess for 4 bots
    for (let i = 0; i < 4; i++) {
      let p = random(1, 700, 0),
        m = random(1, 4, 2);

      autoplayersGuess.push({
        id: i + 1,
        name: `CPU ${i + 1}`,
        point: p,
        multiplier: m,
        score: Math.round(p * m),
      });
    }

    setAutoplayersValue(autoplayersGuess);
    dispatch(setUsersRanking(autoplayersGuess));
  }

  const startFunction = () => {
    if (0 > userBalance) {
      toast("Not enough points to start", {
        duration: 4000,
        style: {},
        className: "",
        icon: "⚠️",
        role: "status",
        ariaLive: "polite",
      });
      return false;
    }

    setGeneratedValue(random(1, 9, 2));
    dispatch(speedStateVal(speedValue));
    generateAutoplayers();
    dispatch(generateVal(generatedValue));
    dispatch(updateBalanceVal(userBalance - pointsValue));

    // Update the balance after drawing the chart
    setTimeout(updateBalance, 3000 + 1000 * speedValue);
  };

  function updateBalance() {
    // Remove disable from start button
    dispatch(animStateVal(false));

    if (generatedValue === multiplierValue) {
      dispatch(updateBalanceVal(userBalance + pointsValue));
    } else {
      dispatch(updateBalanceVal(userBalance - pointsValue));
    }
  }

  const pointsMinus = () => {
    if (pointsValue > 25) setPointsValue(pointsValue - 25);
  };

  const pointsPlus = () => {
    if (userBalance >= pointsValue + 25) setPointsValue(pointsValue + 25);
  };

  const multiplierMinus = () => {
    if (multiplierValue >= 1.25) setMultiplierValue(multiplierValue - 0.25);
  };

  const multiplierPlus = () => {
    if (10 >= multiplierValue + 0.25)
      setMultiplierValue(multiplierValue + 0.25);
  };

  return (
    <div className="start-section">
      <div className="row mb-3">
        <div className="col-12 col-md-6">
          <div className="card-box info-box toggle">
            <div className="toggle-title">Points</div>
            <div className="toggle-menu">
              <div className="toggle-minus option" onClick={pointsMinus}>
                ▼
              </div>
              <input
                type="number"
                className="toggle-input"
                min="0"
                max={userBalance}
                step="25"
                onChange={(e) => setPointsValue(e.target.value)}
                value={pointsValue}
              />
              <button className="toggle-plus option" onClick={pointsPlus}>
                ▲
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card-box info-box toggle">
            <div className="toggle-title">Multiplier</div>
            <div className="toggle-menu">
              <div className="toggle-minus option" onClick={multiplierMinus}>
                ▼
              </div>
              <input
                type="number"
                className="toggle-input"
                min="1"
                max="10"
                step="0.25"
                onChange={(e) => setMultiplierValue(e.target.value)}
                value={multiplierValue}
              />
              <button className="toggle-plus option" onClick={multiplierPlus}>
                ▲
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary start-button"
        onClick={startFunction}
        disabled={animationShow}
      >
        {animationShow ? "Started" : "Start"}
      </button>

      <div className="card-title mt-3">🏆 Current round</div>

      <div className="card-box round-box">
        <table className="ranking-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Point</th>
              <th>Multiplier</th>
            </tr>
          </thead>
          <tbody>
            {autoplayersValue.map((user, index) => (
              <tr key={user.id} className={index === 0 ? "my-result" : ""}>
                <td>{user.name}</td>
                <td>{user.point}</td>
                <td>{user.multiplier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card-title mt-3">⌛ Speed</div>

      <div className="card-box speed-box">
        <input
          type="range"
          className="speed"
          min="1"
          max="5"
          step="1"
          onChange={(e) => setSpeedValue(e.target.value)}
          value={speedValue}
        />

        <div className="speed-values">
          <div className={speedValue >= 1 ? "selected" : ""}>1x</div>
          <div className={speedValue >= 2 ? "selected" : ""}>2x</div>
          <div className={speedValue >= 3 ? "selected" : ""}>3x</div>
          <div className={speedValue >= 4 ? "selected" : ""}>4x</div>
          <div className={speedValue >= 5 ? "selected" : ""}>5x</div>
        </div>
      </div>
    </div>
  );
}

export default Start;
