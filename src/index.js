import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={'square' + (props.highlight ? ' highlight' : '') + (!props.isAWinner && !props.value ? ' empty' : '')}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(id) {
    return (
      <Square
        id={id}
        key={id}
        value={this.props.squares[id]}
        highlight={this.props.highlight && this.props.highlight.includes(id)}
        isAWinner={!!this.props.highlight}
        onClick={() => this.props.onClick(id)}
      />
    );
  }

  render() {
    const jsx = [];
    let id = 0;
    for (let row = 1; row <= 3; row++) {
      const squares = [];
      for (let col = 1; col <= 3; col++) {        
        squares.push(this.renderSquare(id++));
      }
      jsx.push(<div className="board-row" key={row}>{squares}</div>);
    }

    return (<div>{jsx}</div>);
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      sortAsc: true,
    }
  }

  handleClick(id) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[id])
      return;
    squares[id] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        squareId: id
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  invertSort() {
    this.setState({sortAsc: !this.state.sortAsc});
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((entry, move) => {
      const textGoToMove = move ?
        `Go to move #${move} ${createRowColStr(entry.squareId)}` :
        'Go to game start';
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={this.state.stepNumber === move ? 'bold' : ''}
          >
            {textGoToMove}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;

    } else if (this.state.stepNumber === 9) {
      status = 'Draw! Everyone loses.'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            highlight={winner ? winner.winningSquares : null}
            onClick={id => this.handleClick(id)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="history">
            <div className="sort">
              <button onClick={() => this.invertSort()}>
                {this.state.sortAsc ? '???' : '???'}
              </button>
            </div>
            <ol className={this.state.sortAsc ? 'asc' : 'desc'}>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningSquares: lines[i],
      };
    }
  }
  return null;
}

function createRowColStr(squareId) {
  const row = 1+ Math.floor(squareId / 3);
  const col = 1+ squareId % 3;
  return `(${row}, ${col})`;
}