import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var length = 3;

function Square(props) {
  const highlight = {
    backgroundColor: '#E55D87',
    color: '#FFF'
  };
  return (
    <button className="square" onClick={props.onClick} style={props.winningLine ?  highlight : null}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  
  renderSquare(i) {
    let winningLine = this.props.winner && this.props.winner.includes(i) ? true : false;
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winningLine = {winningLine}
      />
    );
  }

  render() {
    let boardSquares = [];
    for(let row = 0; row < length; row++){
      let boardRow = [];
      for(let col = 0; col < length; col++){
        boardRow.push(<span key={(row * length) + col}>{this.renderSquare((row * length) + col)}</span>);
      }
      boardSquares.push(<div className="board-row" key={row}>{boardRow}</div>);
    }

    return (
      <div>
        {boardSquares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          position: 0
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      ascending: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          position: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  sortHandleClick(){
    this.setState({
      ascending: !this.state.ascending
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const ascending = this.state.ascending;

    const moves = history.map((step, move) => {
      const desc = move ? ('Step ' + move + ' at (' + (Math.floor(step.position/length) + 1) + ', ' + (step.position%length + 1) + ')' ) : 'Restart';
      return (
        <ul key={move}>
          <button id='btnMove' onClick={() => this.jumpTo(move)}>{desc}</button>
        </ul>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
    } else if (Object.keys(history).length === (length*length+1)) {
      status = "The result being a draw.";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winner={winner && winner.winningLine}
          />
        </div>
        <div className="game-info">
          <div className='status'>
            {status}
          </div>
          <label class="toggle-button">
              <input type="checkbox" id='toggleButton' onChange={() => this.sortHandleClick()}/>
              <span class="slider"></span>
              <ol>{ascending ? moves : moves.reverse()}</ol>
          </label>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    // for (let j = 0; j < length; j++)
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningLine: lines[i]
      };
    }
  }
  return null;
}
