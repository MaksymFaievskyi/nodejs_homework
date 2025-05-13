import React, { useState, useEffect } from "react";
import {
  getFights,
  getFightById,
} from "../../services/domainRequest/fightRequest";
import { getFighterById } from "../../services/domainRequest/fightersRequest";
import "./fightHistory.css";

const FightHistory = () => {
  const [fights, setFights] = useState([]);
  const [selectedFight, setSelectedFight] = useState(null);
  const [fighter1Name, setFighter1Name] = useState("");
  const [fighter2Name, setFighter2Name] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFights = async () => {
      try {
        const data = await getFights();
        setFights(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFights();
  }, []);

  const handleSelectFight = async (fightId) => {
    try {
      const fight = await getFightById(fightId);
      setSelectedFight(fight);

      const fighter1 = await getFighterById(fight.fighter1);
      const fighter2 = await getFighterById(fight.fighter2);
      setFighter1Name(fighter1.name);
      setFighter2Name(fighter2.name);
    } catch (err) {
      setError(err.message);
    }
  };

  const getWinnerName = (fight) => {
    if (!fight || !fight.winner) return "N/A";
    return typeof fight.winner === "string"
      ? fight.winner
      : fight.winner.name || "Unknown";
  };

  if (loading) return <div className="loading">Loading fights history...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="fight-history">
      <h2>Fight History</h2>

      <div className="history-container">
        <div className="fights-list">
          {fights.map((fight, index) => (
            <div
              key={fight.id}
              className={`fight-item ${
                selectedFight?.id === fight.id ? "active" : ""
              }`}
              onClick={() => handleSelectFight(fight.id)}
            >
              <p>Fight #{index}</p>
              <span>{new Date(fight.createdAt).toLocaleDateString()}</span>
              {fight.winner && (
                <span className="winner-badge">
                  Winner: {getWinnerName(fight)}
                </span>
              )}
            </div>
          ))}
        </div>

        {selectedFight && (
          <div className="fight-details">
            <h3>Fight Details</h3>
            <div className="fighters-info">
              <div>
                <h4>Fighter 1:</h4>
                <p>{fighter1Name}</p>
              </div>
              <div>
                <h4>Fighter 2:</h4>
                <p>{fighter2Name}</p>
              </div>
              {selectedFight.winner && (
                <div className="winner-info">
                  <h4>Winner:</h4>
                  <p>{getWinnerName(selectedFight)}</p>
                </div>
              )}
            </div>

            <div className="fight-log">
              <h4>Fight Log:</h4>
              {Array.isArray(selectedFight.log) ? (
                <ul>
                  {selectedFight.log.map((entry, index) => (
                    <li key={index}>{entry}</li>
                  ))}
                </ul>
              ) : (
                <p>No log entries available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FightHistory;
