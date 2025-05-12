import React, { useState, useEffect } from "react";
import { fight } from "../../services/fightService";
import "./fightArena.css";

const FightArena = ({ fighter1, fighter2, onFightEnd }) => {
  const [health, setHealth] = useState({
    player1: fighter1.health,
    player2: fighter2.health,
  });

  const [damageText, setDamageText] = useState({
    player1: "",
    player2: "",
  });

  useEffect(() => {
    const handleFight = async () => {
      const winner = await fight(fighter1, fighter2, {
        onDamage: (attacker, damage, isCritical) => {
          const target = attacker === "player1" ? "player2" : "player1";
          setHealth((prev) => ({
            ...prev,
            [target]: Math.max(0, prev[target] - damage),
          }));

          setDamageText((prev) => ({
            ...prev,
            [target]: isCritical
              ? `Critical: ${damage.toFixed(1)}`
              : damage.toFixed(1),
          }));

          setTimeout(() => {
            setDamageText((prev) => ({ ...prev, [target]: "" }));
          }, 1000);
        },
      });

      onFightEnd(winner);
    };

    if (fighter1 && fighter2) handleFight();
  }, [fighter1, fighter2, onFightEnd]);

  if (!fighter1 || !fighter2) return null;

  return (
    <div className="arena___root">
      <div className="arena___fight-status">
        <div className="arena___fighter-indicator">
          <span className="arena___fighter-name">{fighter1.name}</span>
          <div className="arena___health-indicator">
            <div
              id="left-fighter-indicator"
              className="arena___health-bar"
              style={{ width: `${(health.player1 / fighter1.health) * 100}%` }}
            >
              {damageText.player1}
            </div>
          </div>
        </div>

        <div className="arena___fighter-indicator">
          <span className="arena___fighter-name">{fighter2.name}</span>
          <div className="arena___health-indicator">
            <div
              id="right-fighter-indicator"
              className="arena___health-bar"
              style={{ width: `${(health.player2 / fighter2.health) * 100}%` }}
            >
              {damageText.player2}
            </div>
          </div>
        </div>
      </div>

      <div className="arena___battlefield">
        <div className="arena___fighter arena___left-fighter">
          <img
            src="https://media.giphy.com/media/kdHa4JvihB2gM/giphy.gif"
            alt={fighter1.name}
            className="fighter-preview___img"
          />
        </div>
        <div className="arena___fighter arena___right-fighter">
          <img
            src="https://media.giphy.com/media/kdHa4JvihB2gM/giphy.gif"
            alt={fighter2.name}
            className="fighter-preview___img"
          />
        </div>
      </div>
    </div>
  );
};

export default FightArena;
