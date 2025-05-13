import React from "react";
import { getFighters } from "../../services/domainRequest/fightersRequest";
import {
  createFight,
  updateFight,
} from "../../services/domainRequest/fightRequest"; // Import fight API functions
import NewFighter from "../newFighter";
import Fighter from "../fighter";
import FightArena from "../fightArena";
import WinnerModal from "../winnerModal";
import FightHistory from "../fightHistory";
import { Button } from "@material-ui/core";
import "./fight.css";

class Fight extends React.Component {
  state = {
    fighters: [],
    fighter1: null,
    fighter2: null,
    isFighting: false,
    winner: null,
    showHistory: false,
    currentFightId: null,
  };

  async componentDidMount() {
    const fighters = await getFighters();
    if (fighters && !fighters.error) {
      this.setState({ fighters });
    }
  }

  onFightStart = async () => {
    const { fighter1, fighter2 } = this.state;
    if (fighter1 && fighter2) {
      try {
        const fightData = {
          fighter1: fighter1.id,
          fighter2: fighter2.id,
          log: [],
        };

        const response = await createFight(fightData);
        if (response && response.id) {
          this.setState({
            isFighting: true,
            currentFightId: response.id,
          });
        } else {
          console.error("Failed to create fight record");
          this.setState({ isFighting: true });
        }
      } catch (error) {
        console.error("Error creating fight record:", error);
        this.setState({ isFighting: true });
      }
    }
  };

  onFightEnd = async (winner, fightLog) => {
    try {
      const updatedFight = await updateFight(this.state.currentFightId, {
        log: fightLog,
        winner: winner,
      });

      this.setState({
        isFighting: false,
        winner,
        currentFight: updatedFight,
      });
    } catch (error) {
      console.error("Failed to update fight:", error);
      this.setState({
        isFighting: false,
        error: "Failed to save fight results",
      });
    }
  };

  handleCloseModal = () => {
    this.setState({ winner: null });
  };

  toggleHistory = () => {
    this.setState((prevState) => ({
      showHistory: !prevState.showHistory,
    }));
  };

  onCreate = (fighter) => {
    this.setState({ fighters: [...this.state.fighters, fighter] });
  };

  onFighter1Select = (fighter1) => {
    this.setState({ fighter1 });
  };

  onFighter2Select = (fighter2) => {
    this.setState({ fighter2 });
  };

  getFighter1List = () => {
    const { fighter2, fighters } = this.state;
    if (!fighter2) {
      return fighters;
    }
    return fighters.filter((it) => it.id !== fighter2.id);
  };

  getFighter2List = () => {
    const { fighter1, fighters } = this.state;
    if (!fighter1) {
      return fighters;
    }
    return fighters.filter((it) => it.id !== fighter1.id);
  };

  render() {
    const { fighter1, fighter2, isFighting, showHistory } = this.state;

    if (isFighting && fighter1 && fighter2) {
      return (
        <FightArena
          fighter1={fighter1}
          fighter2={fighter2}
          onFightEnd={this.onFightEnd}
        />
      );
    }

    return (
      <div id="wrapper">
        <div className="header-actions">
          <NewFighter onCreated={this.onCreate} />
        </div>

        <div id="figh-wrapper">
          <Fighter
            selectedFighter={fighter1}
            onFighterSelect={this.onFighter1Select}
            fightersList={this.getFighter1List() || []}
          />
          <div className="btn-wrapper">
            <Button
              onClick={this.onFightStart}
              variant="contained"
              color="primary"
              disabled={!fighter1 || !fighter2}
            >
              Start Fight
            </Button>
          </div>
          <Fighter
            selectedFighter={fighter2}
            onFighterSelect={this.onFighter2Select}
            fightersList={this.getFighter2List() || []}
          />
        </div>

        <div className="history-section">
          <Button
            variant="contained"
            color="secondary"
            onClick={this.toggleHistory}
          >
            {showHistory ? "Hide History" : "Show Fight History"}
          </Button>

          {showHistory && <FightHistory className="history-container" />}
        </div>

        <WinnerModal
          fighter={this.state.winner}
          onClose={() => this.setState({ winner: null })}
        />
      </div>
    );
  }
}

export default Fight;
