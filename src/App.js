import React, { useState } from 'react';

function Square({ value, onSquareClick, isSuccess }) {
  return (
    <button className={isSuccess ? "square green": "square"} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    console.log('clicked', i)
    if (calculateWinner(squares).length !== 0 || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner.join(', ');
  } else if (squares.every(element => element !== null)) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const boardRows = [];

  for (let row = 0; row < 3; row++) {
    const squaresRow = [];
    for (let col = 0; col < 3; col++) {
      let index = row * 3 + col;
      squaresRow.push(
        <Square
          key={col}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          isSuccess={winner.includes(index)}
        />
      );
    }
    boardRows.push(<div key={row} className="board-row">{squaresRow}</div>);
  }

  return (
    <div>
      <div className="status">{status}</div>
      {boardRows}
    </div>
  );
}


export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const [sortAscending, setSortAscending] = useState(true);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function MoveButton({title, index}) {
    return (<button onClick={() => jumpTo(index)}>{title}</button>);
  }
  
  function InfoLabel({title}) {
    return (<div>{title}</div>);
  }

  function handleSortToggle() {
    setSortAscending(!sortAscending);
  }
  
  const moves = history.map((squares, move) => {
    console.log('calulating move', move)
    
    let content;
    if (move === 0) {
      if (history.length === 1) {
        content = <InfoLabel title="Let's start the game" />;
      } else {
        content = <MoveButton title="Let's restart the game" index={move} />;
      }
    } else if (move === currentMove) {
      content = <InfoLabel title={'You are at move #' + move}/>;
    } else {
      content = <MoveButton title={'Go to move #' + move} index={move} />;
    }

    return (
      <li key={move}>
        {content}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={handleSortToggle}>Sort {sortAscending ? 'descending' : 'ascending'}</button>
        <ul>
          {sortAscending ? moves : moves.reverse()}
          </ul>
      </div>
    </div>
  );
}

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
      return [a,b,c];
    }
  }
  return [];
}
