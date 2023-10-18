import React, { useEffect, useState } from 'react';
import styles from '../styles/Snellen.module.scss';
import MatrixLetter from './MatrixLetter';
import { toast } from 'react-toastify';
import ChangeArrows from './ChangeArrows';
const api = require('../services/api');

const Snellen = () => {
  const [activeRow, setActiveRow] = useState(0);
  const [activeCustomRow, setActiveCustomRow] = useState(0); // Linha ativa na visualização "Personalize"
  const [customFontSize, setCustomFontSize] = useState(2.6); // Tamanho de fonte padrão
  const [customLetters, setCustomLetters] = useState([
    {
      letters: ["E"],
      size: customFontSize,
    },
    {
      letters: ["F", "P"],
      size: customFontSize * 0.8,
    },
    {
      letters: ["T", "O", "Z"],
      size: customFontSize * 0.8 * 0.8,
    },
    {
      letters: ["L", "P", "E", "D"],
      size: customFontSize * 0.8 * 0.8 * 0.8,
    },
    {
      letters: ["P", "E", "C", "F", "D"],
      size: customFontSize * 0.8 * 0.8 * 0.8 * 0.8,
    },
    {
      letters: ["E", "D", "F", "C", "Z", "P"],
      size: customFontSize * 0.8 * 0.8 * 0.8 * 0.8 * 0.8,
    },
    {
      letters: ["F", "E", "L", "O", "P", "Z", "D"],
      size: customFontSize * 0.8 * 0.8 * 0.8 * 0.8 * 0.8 * 0.8,
    },
    {
      letters: ["D", "E", "F", "P", "O", "T", "E", "C"],
      size: customFontSize * 0.8 * 0.8 * 0.8 * 0.8 * 0.8 * 0.8 * 0.8,
    }
  ]);
  
  const fontSize = 2.6;
  const [isSnellen, setIsSnellen] = useState(true);
  const snellen_letters = [
    {
      letters: ["E"],
      size: fontSize,
    },
    {
      letters: ["F", "P"],
      size: fontSize * 0.8,
    },
    {
      letters: ["T", "O", "Z"],
      size: fontSize * 0.8 * 0.8,
    },
    {
      letters: ["L", "P", "E", "D"],
      size: fontSize * 0.8 * 0.8 * 0.8,
    },
    {
      letters: ["P", "E", "C", "F", "D"],
      size: fontSize * 0.8 * 0.8 * 0.8 * 0.8,
    },
    {
      letters: ["E", "D", "F", "C", "Z", "P"],
      size: fontSize * 0.8 * 0.8 * 0.8 * 0.8 * 0.8,
    },
    {
      letters: ["F", "E", "L", "O", "P", "Z", "D"],
      size: fontSize * 0.8 * 0.8 * 0.8 * 0.8 * 0.8 * 0.8,
    },
    {
      letters: ["D", "E", "F", "P", "O", "T", "E", "C"],
      size: fontSize * 0.8 * 0.8 * 0.8 * 0.8 * 0.8 * 0.8 * 0.8,
    },
  ];

  const [allLettersMatrix, setAllLettersMatrix] = useState({});

  const changeActiveRow = (increment) => {
    if (isSnellen) {
      const newRow = activeRow + increment;
      if (newRow >= 0 && newRow < snellen_letters.length) {
        setActiveRow(newRow);   
      }
    } else {
      const newRow = activeCustomRow + increment;
      if (newRow >= 0 && newRow < customLetters.length) {
        setActiveCustomRow(newRow);
      }
    }
  }

  const feetToMeter = (feet) => {
    return feet / 3,281;
  }

  const distanceToRead = (font) => {
    return font * 6 / 2.6;
  }

//  6m supoe 26mm
useEffect(() => {
  setCustomLetters((prevCustomLetters) => {
    return prevCustomLetters.map((letter, index) => {
      if (index === 0) {
        return {
          ...letter,
          size: customFontSize,
        };
      } else {
        return {
          ...letter,
          size: prevCustomLetters[index - 1].size * 0.8,
        };
      }
    });
  });
}, [customFontSize]);


  useEffect(() => {
    const fetchAllLetters = async() => {
      await api.MatrixLetter().then((res) => {
        setAllLettersMatrix(res);
      }).catch((err) => {
        toast.error(err);
      })
    }
    fetchAllLetters();
  }, [])

  return (
    <>
      <div className={styles.switch}>
        <div className={styles.chart} onClick={() => setIsSnellen(true)}>
          <span>
            Snellen
          </span>
        </div>
        <div className={styles.personalize} onClick={() => setIsSnellen(false)}>
          <span>
            Personalize
          </span>
        </div>
      </div>
      <div className={styles.snellen}>            
          {
            isSnellen ? (
              <>
                <div className={styles.row_to_read} style={{ fontSize: `${snellen_letters[activeRow].size}cm` }}>          
                  {snellen_letters[activeRow].letters.map((letra, letraIndex) =>                   
                    <MatrixLetter letter={allLettersMatrix[letra]} fontSize={snellen_letters[activeRow].size} key={`${letraIndex}-matrixLetter`}></MatrixLetter>                  
                  )}
                </div>
                <label> Distância recomendada: {distanceToRead(fontSize).toFixed(1)}m</label>
              </>
            ) : (
              <>
                <div className={styles.row_to_read} style={{ fontSize: `${customLetters[activeCustomRow].size}cm` }}>          
                  {customLetters[activeCustomRow].letters.map((letra, letraIndex) => 
                    <MatrixLetter letter={allLettersMatrix[letra]} fontSize={customLetters[activeCustomRow].size} key={`${letraIndex}-matrixLetter`}></MatrixLetter>                  
                  )}              
                </div>
                <label> Distância recomendada: {distanceToRead(customFontSize).toFixed(1)}m</label>
              </>
            )
          }
        <div className={styles.base}>
          <div className={`${styles["custom-container"]}`}  style={{flex:"1", visibility: isSnellen ? "hidden" : "visible"}}>
          {customLetters.map((row, index) => (
            <div key={index} className={styles['custom-row']}>
              <label className={styles['custom-label']}>
                Linha {index + 1}:
                <input
                  type="text"
                  value={row.letters.join('')}
                  onChange={(e) => {
                    const newLetters = [...customLetters];
                    newLetters[index] = {
                      letters: e.target.value.toUpperCase().split(''),
                      size: customLetters[index].size,
                    };
                    setCustomLetters(newLetters);
                  }}
                  className={styles['custom-input']}
                />
              </label>
            </div>
          ))}
          <div className={styles['font-size-input']}>
            <label>
              Tamanho da fonte base (cm):
            </label>
            <input
              type="number"
              name="line"
              id="line"
              value={customFontSize}
              onChange={(e) => {
                setCustomFontSize(e.target.value);
              }}
              min="1"
              max="5"
              step="0.1"
              className={styles['custom-input']}
            />
          </div>
          </div>
          
          <ChangeArrows changeFunction={changeActiveRow}></ChangeArrows>

          <div className={styles.all_letters} style={{flex:"1"}}>
            {
              isSnellen ?
                snellen_letters.map((row, index) => (
                  <div key={index} style={{ fontSize: `${40}px`, color: index == activeRow ? `red` : "black" }}>
                    {row.letters}
                  </div>
                ))
                :
                customLetters.map((row, index) => (
                  <div key={index} style={{ fontSize: `${40}px`, color: index == activeCustomRow ? `red` : "black" }}>
                    {row.letters}
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Snellen;
