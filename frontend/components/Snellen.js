import React, { useState } from 'react';
import styles from '../styles/Snellen.module.scss';

const Snellen = () => {
  const [activeRow, setActiveRow] = useState(0);

  const eLetterSize = 100;
  const snellen_letters = [
    {
      letters: ["E"],
      size: eLetterSize
    },
    {
      letters: ["F", "P"],
      size: eLetterSize * 0.8
    },
    {
      letters: ["T", "O", "Z"],
      size: eLetterSize * 0.6
    },
    {
      letters: ["L", "P", "E", "D"],
      size: eLetterSize * 0.4
    },
    {
      letters: ["P", "E", "C", "F", "D"],
      size: eLetterSize * 0.2
    }   
  ];
 
  const changeActiveRow = (increment) => {
    (increment < 0 && activeRow === 0) || (increment > 0 && activeRow === snellen_letters.length - 1) ?
      null : setActiveRow(activeRow + increment);
  }
 
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
        <div className={styles.row_to_read} style={{ fontSize: `${snellen_letters[activeRow].size}px` }}>
          <span>
            {snellen_letters[activeRow].letters}
          </span>
        </div>
        <div className={styles.preview}>
          <div className={styles.change_active_row}>
            <div onClick={() => {
              changeActiveRow(-1);
            }}>
            </div>
            <div onClick={() => {
              changeActiveRow(1);
            }}>
            </div>
          </div>
          <div className={styles.all_letters}>
            {
              snellen_letters.map((row, index) => (
                <div key={index} style={{ fontSize: `${40}px` }}>
                  {row.letters}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Snellen