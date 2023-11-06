import React, { useEffect, useState } from 'react';
import styles from '../styles/MatrixLetter.module.scss';

const MatrixLetter = ({ letter, fontSize }) => {
  const font = fontSize || 500;
  const defaultMatrix = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ];
  const [matrix, setMatrix] = useState(defaultMatrix);

  useEffect(() => {
      letter ? setMatrix(letter) : setMatrix(defaultMatrix);      
  }, [letter]);

  return (
    <div className={styles["row-to-read"]}>
      <div className={styles.container} style={{ height: `${font}px`, width: `${font}px` }}>
        {matrix.map((row, rowIndex) => {
          return (
            <div className={styles.row} style={{ height: `${font / 5}px`, width: `${font}px` }} key={`${rowIndex}-row`}>
              {row.map((column, columnIndex) => (
                <div
                  className={styles.column}
                  style={{ backgroundColor: column ? "black" : "transparent", height: `${fontSize / 5}px`, width: `${fontSize / 5}px` }}
                  key={`${columnIndex}-column`}
                ></div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default MatrixLetter;
