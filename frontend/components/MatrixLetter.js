import React, { useEffect, useState } from 'react';
import styles from '../styles/MatrixLetter.module.scss';
const api = require('../services/api');

const MatrixLetter = ({ letter, fontSize }) => {
  const [allLettersMatrices, setAllLettersMatrices] = useState({});
  const font = fontSize || 500;
  const letra = letter;
  const defaultMatrix = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ];
  const [matrix, setMatrix] = useState(defaultMatrix);

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        await api.MatrixLetter().then((res) => {
          setAllLettersMatrices(res);
          console.log(res[letra]);
          setMatrix(res[letra]);
        }).catch((err) => {
          console.log(err);
        });        
      } catch (err) {
        console.log(err);
      }
    }
    fetchMatrix();
  }, []);

  useEffect(() => {
    if (Object.keys(allLettersMatrices).length !== 0){      
      setMatrix(allLettersMatrices[letra]);
    }    
  }, [letter, fontSize]);
  
  return (
    <div className={styles["row-to-read"]}>
      <div className={styles.container} style={{ height: `${font}px`, width: `${font}px` }}>       
        {matrix.map((row, rowIndex) => {
          return(
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
