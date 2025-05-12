import React from "react";
import { getFighters } from "../../services/domainRequest/fightersRequest";
import NewFighter from "../newFighter";
import Fighter from "../fighter";
import FightArena from "../fightArena";
import WinnerModal from "../winnerModal"; // Додано імпорт
import { Button } from "@material-ui/core";
import "./fight.css";

class Fight extends React.Component {
  state = {
    fighters: [],
    fighter1: null,
    fighter2: null,
    isFighting: false,
    winner: null, // Додано новий стан
  };

  async componentDidMount() {
    const fighters = await getFighters();
    if (fighters && !fighters.error) {
      this.setState({ fighters });
    }
  }

  onFightStart = () => {
    const { fighter1, fighter2 } = this.state;
    if (fighter1 && fighter2) {
      this.setState({ isFighting: true });
    }
  };

  onFightEnd = (winner) => {
    this.setState({
      isFighting: false,
      winner, // Зберігаємо переможця в стані
    });
  };

  handleCloseModal = () => {
    this.setState({ winner: null }); // Скидаємо переможця
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
    const { fighter1, fighter2, isFighting } = this.state;

    // If we're fighting, render the FightArena instead of the fighter selection
    if (isFighting && fighter1 && fighter2) {
      return (
        <FightArena
          fighter1={fighter1}
          fighter2={fighter2}
          onFightEnd={this.onFightEnd}
        />
      );
    }

    // Otherwise render the fighter selection screen
    return (
      <div id="wrapper">
        <NewFighter onCreated={this.onCreate} />
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
        <WinnerModal
          fighter={this.state.winner}
          onClose={() => this.setState({ winner: null })}
        />
      </div>
    );
  }
}

export default Fight;
