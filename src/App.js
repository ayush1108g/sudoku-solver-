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
  const [grid1, setGrid1] = useState(dgridMaker());
  const [warn, setIswarn] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

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
      return SudokuSolve(sudoku, nextRow, nextCol);
    }
    for (let val = 1; val <= 9; val++) {
      if (isSudokuSafe(sudoku, row, col, val)) {
        const updatedGrid = [...sudoku];
        updatedGrid[row][col].value = val;
        updatedGrid[row][col].isInitial = 1;
        // sudoku[row][col] = val;
        setGrid(updatedGrid);
        if (SudokuSolve(sudoku, nextRow, nextCol)) {
          return true;
        }
        updatedGrid[row][col].value = 0;
        setGrid1(updatedGrid);
        // sudoku[row][col] = 0;
      }
    }
    return false;
  }


  const solveHandler = () => {
    setGrid1(grid);


    if (checkIfData(grid1) && SudokuSolve(grid1, 0, 0)) {
      setReadOnly(true);
      console.log(grid1);
      console.log(grid);
      setGrid(grid1);
    }
  }
  const checkIfData = (grid1) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid1[i][j].value !== 0) {
          return true;
        }
      }
    }
    return false;
  }


  const handleChange = (val, i, j) => {
    console.log(isSudokuSafe(grid, i, j, val));
    const inputValue = parseInt(val, 10);
    const updatedGrid = [...grid];
    const isSafe = isSudokuSafe(grid, i, j, val);
    if (!isSafe) {
      setIswarn(true);
      setTimeout(() => {
        setIswarn(false);
      }, 1000);
    }
    if (!isNaN(inputValue) && inputValue >= 1 && inputValue <= 9 && isSafe) {
      setIswarn(false);
      updatedGrid[i][j].value = inputValue;
      updatedGrid[i][j].isInitial = 0;
    }
    else {
      updatedGrid[i][j].value = 0;
      updatedGrid[i][j].isInitial = 0;
    }
    setGrid(updatedGrid);
  }

  
  const resetHandler = () => {
    setGrid(dgridMaker());
    setGrid1(dgridMaker());
    setReadOnly(false);
    setIswarn(false);
    // console.log(grid);
    // console.log(grid1);
  }


  return (
    <div className="App">
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
                    type="number"
                    min="1"
                    max="9"
                    value={cell.value || ''}
                    readOnly={readOnly}
                    onChange={(event) =>
                      handleChange(event.target.value, rowIndex, columnIndex)
                    }
                    className={cell.isInitial === 0 ? 'normal-cell' : cell.isInitial === 1 ? 'changed-cell' : ''}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {warn ? <p className='invalid'>INVALID</p> : <p>   -   </p>}
      <div className='buttons'>
        <button onClick={resetHandler}>Reset</button>
        <button onClick={solveHandler}>Solve</button>
      </div>
    </div>
  );
}

export default App;
