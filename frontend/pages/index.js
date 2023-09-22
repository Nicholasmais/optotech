import styles from '../styles/Home.module.scss';
import React, { useState } from 'react';

export default function Home() {
  const [activeRow, setActiveRow] = useState(0);

  const snellen_letters = [
    {
      letters: ["E"],
      size:88
    },
    {
      letters: ["F", "P"],
      size:68
    },
    {
      letters: ["T", "O", "Z"],
      size:48
    },
    {
      letters: ["L", "P", "E", "D"],
      size:28
    },
    {
      letters: ["P", "E", "C", "F", "D"],
      size:12
    }
  ];

  const changeActiveRow = (increment) => {
    (increment < 0 && activeRow === 0) || (increment > 0 && activeRow === snellen_letters.length - 1) ?
      null :  setActiveRow(activeRow + increment);
  }
  console.log(activeRow);

  return (
    <>
      <div className={styles.switch}>
        <div className={styles.chart}>
          <span>
            Snellen
          </span>
        </div>
        <div className={styles.personalize}>
          <span>
            Personalize
          </span>
        </div>        
      </div>
      <div className={styles.snellen}>
        <div className={styles.row_to_read} style={{fontSize:`${snellen_letters[activeRow].size}px`}}>
          <span>
            {snellen_letters[activeRow].letters}
          </span>
        </div>
        <div className={styles.all_letters}>
          {
            snellen_letters.map((row, index) => (
              <div key={index} style={{fontSize:`${row.size}px`}}>
                {row.letters}
              </div>
            )
          )}  
        </div>
        <div className={styles.change_active_row}>
          <button onClick={() => {
              changeActiveRow(-1);            
            }}>
            Anterior
          </button>
          <button onClick={() => {
              changeActiveRow(1);
            }}>
            Próximo
          </button>
        </div>
      </div>
    </>
  );
}
