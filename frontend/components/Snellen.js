import React, { useEffect, useState } from 'react';
import styles from '../styles/Snellen.module.scss';
import MatrixLetter from './MatrixLetter';
import { toast } from 'react-toastify';
import ChangeArrows from './ChangeArrows';
import eye from '../assets/eye.png';
import hidden_eye from '../assets/hidden-eye.png';
const api = require('../services/api');

const Snellen = () => {
  const [activeRow, setActiveRow] = useState(3);
  const [activeCustomRow, setActiveCustomRow] = useState(0); // Linha ativa na visualização "Personalize"
  
  const letterPx = (distance, snellen_value, dpi = 96) => {
    return ( 0.0145 * snellen_value * distance * dpi / 25.4);
  }
  
  const distanceToRead = (snellen_value, font, dpi = 96) => {
    return (font * 25.4 / (0.0145*snellen_value*dpi));
  }

  const [customFontSize, setCustomFontSize] = useState(5.6); // Tamanho de fonte padrão
  const [customLetters, setCustomLetters] = useState([
    {
      letters: ["E"],
      snellen: 200,
      size: letterPx(6, 200),
    },
    {
      letters: ["F", "P"],
      snellen: 100,
      size: letterPx(6, 100),
    },
    {
      letters: ["T", "O", "Z"],
      snellen: 70,
      size: letterPx(6, 70),
    },
    {
      letters: ["L", "P", "E", "D"],
      snellen: 60,
      size: letterPx(6, 60),
    },
    {
      letters: ["P", "E", "C", "F", "D"],
      snellen: 40,
      size: letterPx(6, 40),
    },
    {
      letters: ["E", "D", "F", "C", "Z", "P"],
      snellen: 30,
      size: letterPx(6, 30),
    },
    {
      letters: ["F", "E", "L", "O", "P", "Z", "D"],
      snellen: 25,
      size: letterPx(6, 25),
    },
    {
      letters: ["D", "E", "F", "P", "O", "T", "E", "C"],
      snellen: 20,
      size: letterPx(6, 20),
    },
  ]);
  
  const [isSnellen, setIsSnellen] = useState(true);
  const snellen_letters = [
    {
      letters: ["E"],
      snellen: 200,
      size: letterPx(6, 200),
    },
    {
      letters: ["F", "P"],
      snellen: 100,
      size: letterPx(6, 100),
    },
    {
      letters: ["T", "O", "Z"],
      snellen: 70,
      size: letterPx(6, 70),
    },
    {
      letters: ["L", "P", "E", "D"],
      snellen: 60,
      size: letterPx(6, 60),
    },
    {
      letters: ["P", "E", "C", "F", "D"],
      snellen: 40,
      size: letterPx(6, 40),
    },
    {
      letters: ["E", "D", "F", "C", "Z", "P"],
      snellen: 30,
      size: letterPx(6, 30),
    },
    {
      letters: ["F", "E", "L", "O", "P", "Z", "D"],
      snellen: 25,
      size: letterPx(6, 25),
    },
    {
      letters: ["D", "E", "F", "P", "O", "T", "E", "C"],
      snellen: 20,
      size: letterPx(6, 20),
    },
  ];

  const [allLettersMatrix, setAllLettersMatrix] = useState({});

  const [isHiddenEye, setIsHiddenEye] = useState(false);

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
                <label> Distância recomendada: {distanceToRead(20,letterPx(6, 20)).toFixed(1)}m</label>
              </>
            ) : (
              <>
                <div className={styles.row_to_read} style={{ fontSize: `${customLetters[activeCustomRow].size}cm` }}>          
                  {customLetters[activeCustomRow].letters.map((letra, letraIndex) => 
                    <MatrixLetter letter={allLettersMatrix[letra]} fontSize={customLetters[activeCustomRow].size} key={`${letraIndex}-matrixLetter`}></MatrixLetter>                  
                  )}    
                </div>
                <label> Distância recomendada: {distanceToRead(20,letterPx(6, 20)).toFixed(1)}m</label>
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
                  <div key={index} style={{ fontSize: `${40}px`, color: index == activeRow ? `red` : "black", filter: !isHiddenEye ? "blur(5px)" : "none"}}>
                    {row.letters}
                  </div>
                ))
                :
                customLetters.map((row, index) => (
                  <div key={index} style={{ fontSize: `${40}px`, color: index == activeCustomRow ? `red` : "black", filter: !isHiddenEye ? "blur(5px)" : "none" }}>
                    {row.letters}
                  </div>
                ))
            }
            <div className={styles.eye} onClick={() => {setIsHiddenEye(!isHiddenEye)}}>
              {
              isHiddenEye ? 
                <img src={eye.src} alt="Eye" className={styles.eye} /> 
                :
                <img src={hidden_eye.src} alt="hidden_eye" className={styles.hidden_eye} />
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Snellen;
