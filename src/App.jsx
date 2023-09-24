import './App.css';
import { useState } from 'react';

const dgridMaker = () => {
  const dgrid = [];
  for (let row = 0; row < 9; row++) {
    dgrid[row] = [];
    for (let col = 0; col < 9; col++) {
      const cellValue = 0;
      const isInitial = 0;

      dgrid[row][col] = {
        value: cellValue,
        isInitial: isInitial,
      };
    }
  }
  return dgrid;
}

function App() {
  const [grid, setGrid] = useState(dgridMaker());
  // const [grid1, setGrid1] = useState(dgridMaker());
  const [readOnly, setReadOnly] = useState(false);
  const [errormsg, setErrormsg] = useState('   -   ');


  function isSudokuSafe(sudoku, row, col, dat) {
    let data = parseInt(dat);
    for (let i = 0; i < 9; i++) {
      if ((i !== col && sudoku[row][i].value === data) || (i !== row && sudoku[i][col].value === data)) {
        return false;
      }
    }
    const m = Math.floor(row / 3) * 3;
    const n = Math.floor(col / 3) * 3;
    for (let i = m; i < m + 3; i++) {
      for (let j = n; j < n + 3; j++) {
        if (i !== row && j !== col && sudoku[i][j].value === data) {
          return false;
        }
      }
    }
    return true;
  }


  function SudokuSolve(sudoku, row, col) {
    if (row === 9 && col === 0) {
      return true;
    }

    let nextRow = row;
    let nextCol = col + 1;
    if (col + 1 === 9) {
      nextRow += 1;
      nextCol = 0;
    }

    if (sudoku[row][col].value !== 0) {
      const x = SudokuSolve(sudoku, nextRow, nextCol);
      // console.log(x,row,col);
      return x;
    }


    for (let val = 1; val <= 9; val++) {
      if (isSudokuSafe(sudoku, row, col, val)) {
        sudoku[row][col].value = val;
        sudoku[row][col].isInitial = 1;
        if (SudokuSolve(sudoku, nextRow, nextCol)) {
          return true;
        }

        sudoku[row][col].value = 0;
        sudoku[row][col].isInitial = 0;
      }
    }

    return false;
  }

  const solveHandler = () => {
    const copiedGrid = JSON.parse(JSON.stringify(grid));
    const copiedGrid2 = JSON.parse(JSON.stringify(grid));
    const isData = checkIfData(copiedGrid);
    const checkifsolvable = SudokuSolve(copiedGrid2, 0, 0);
    console.log(checkifsolvable);
    if (isData) {
      if (checkifsolvable === true) {
        setReadOnly(true);
        setGrid(copiedGrid2);
      }
      else {
        setErrormsg('Cannot be solved');
        setTimeout(() => {
          setErrormsg('   -   ');
        }, 4000);
        console.log("Cannot be solved!");
      }
    }
  }

  const checkIfData = (gridx) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (gridx[i][j].value !== 0) {
          return true;
        }
      }
    }
    return false;
  }


  const handleChange = (val, i, j) => {
    // console.log(isSudokuSafe(grid, i, j, val));
    const inputValue = parseInt(val, 10);
    const updatedGrid = [...grid];
    const isSafe = isSudokuSafe(grid, i, j, val);
    if (!isSafe) {
      setErrormsg('Invalid');
      setTimeout(() => {
        setErrormsg('   -   ');
      }, 1000);
    }
    if (!isNaN(inputValue) && inputValue >= 0 && inputValue <= 9 && isSafe) {
      updatedGrid[i][j].value = inputValue;
      updatedGrid[i][j].isInitial = 0;
    }
    else {
      updatedGrid[i][j].value = 0;
      updatedGrid[i][j].isInitial = 0;
    }
    setGrid(updatedGrid);
  }

  const randGenerator = () => {
    const randGrid = dgridMaker();
    let count = 8;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (count > 0) {
          let val = Math.floor(Math.random() * 5) % 10;
          if (val >= 9) { val = 0; }
          if (isSudokuSafe(randGrid, i, j, val)) {
            randGrid[i][j].value = val;
            count--;
          }
          else {
            randGrid[i][j].value = 0;
          }
        }
      }
    }
    if (SudokuSolve(randGrid,0,0)) {
      console.log(randGrid);
      for (let i = 0; i < 9; i++) {
        let count=5;
        for (let j = 0; j < 9; j++) {
          let val = Math.floor(Math.random() * 50) % 10;
          if (val >= 9) { val = 0; }
          if (val !== 0 && count > 0 && (j%2)===(j+val)%2) {
            randGrid[i][j].value = 0;
            count--;
          }
          else {
            randGrid[i][j].isInitial = 2;
          }
        }
      }
    }
    setReadOnly(false);
    setGrid(randGrid);
  }


  const resetHandler = () => {
    setGrid(dgridMaker());
    // setGrid1(dgridMaker());
    setReadOnly(false);
  }


  return (
    <div className="App">
      <br />
      <header className="App-header">
        <h1>Sudoku Solver</h1>
      </header>
      <br /> <br />
      <table className="sudoku-grid">
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <td key={columnIndex} className={`${rowIndex % 3 === 0 ? 'darker-top ' : ''
                  }${columnIndex % 3 === 0 ? 'darker-left ' : ''
                  }${rowIndex === 8 ? 'darker-bottom ' : ''
                  }${columnIndex === 8 ? 'darker-right ' : ''
                  }`}
                >
                  <input
                    id={rowIndex + columnIndex + rowIndex * (columnIndex + 1) + (rowIndex * 11) + (columnIndex * 29 * 123)}
                    type="number"
                    min="1"
                    max="9"
                    value={cell.value || ''}
                    readOnly={readOnly || cell.isInitial===2}
                    onChange={(event) =>
                      handleChange(event.target.value, rowIndex, columnIndex)
                    }
                    className={cell.isInitial === 0 ? 'black-cell' : cell.isInitial === 1 ? 'blue-cell' : cell.isInitial ===2 ? 'pink-cell' : ''}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {<p className='invalid'>{errormsg}</p>}
      <div className='buttons'>
        <button onClick={resetHandler}>Reset</button>
        <button onClick={randGenerator}>PLAY</button>
        <button onClick={solveHandler}>Solve</button>
      </div>
    </div>
  );
}

export default App;
