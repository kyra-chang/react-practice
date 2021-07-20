import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" 
                onClick={props.setValue}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square value={this.props.squares[i]} setValue={() => this.props.onClick(i)}/>;
    }

    render() {
        const arr = [0, 1, 2];
        
        return (
            arr.map((index, _sth) => {
                return (
                    <div className="board-row">
                        {arr.map((colIndex, _sth) => {return (this.renderSquare(index * 3 + colIndex))})}
                    </div>
                );
            })
        );
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
            player: true,
            order: true
        }
    }

    getItem() {
        return this.state.player ? 'X' : 'O';
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const squares = history[history.length - 1].squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.getItem();
        this.setState({ 
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            player: !this.state.player
        });
    }

    jumpTo(i) {
        this.setState({ 
            stepNumber: i,
            player: (i % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const curr = history[this.state.stepNumber];
        const winner = calculateWinner(curr.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.getItem());
        }
        
        let moves = history.map((_step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return (
                <li key={move}>
                  <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        if (!this.state.order) {
            moves = moves.reverse();
        }
        const order = this.state.order ? 'ASC' : 'DESC';

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={curr.squares} onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div className="status">{status}</div>
                    <div><button onClick={() => this.setState({order: !this.state.order})}>{order}</button></div>
                    <ol>{moves}</ol>
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
        return lines[i];
      }
    }
    return null;
  }