import React, { useEffect, useState } from 'react';
import styles from '../styles/Snellen.module.scss';
import MatrixLetter from './MatrixLetter';

const Snellen = () => {
  const [activeRow, setActiveRow] = useState(1);
  const [activeCustomRow, setActiveCustomRow] = useState(0); // Linha ativa na visualização "Personalize"
  const [customFontSize, setCustomFontSize] = useState(100); // Tamanho de fonte padrão
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
      size: customFontSize * 0.6,
    },
    {
      letters: ["L", "P", "E", "D"],
      size: customFontSize * 0.4,
    },
    {
      letters: ["P", "E", "C", "F", "D"],
      size: customFontSize * 0.2,
    },
  ]);

  const fontSize = 100;
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
      size: fontSize * 0.6,
    },
    {
      letters: ["L", "P", "E", "D"],
      size: fontSize * 0.4,
    },
    {
      letters: ["P", "E", "C", "F", "D"],
      size: fontSize * 0.2,
    },
  ];

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
        return {
          ...letter,
          size: customFontSize * (1 - index * 0.2), 
        };
      });
    });
  }, [customFontSize]);

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
              <div className={styles.row_to_read} style={{ fontSize: `${snellen_letters[activeRow].size}px` }}>          
                {snellen_letters[activeRow].letters.map((letra, letraIndex) => 
                  <MatrixLetter letter={letra} fontSize={snellen_letters[activeRow].size} key={`${letraIndex}-matrixLetter`}></MatrixLetter>                  
                )}
              </div>
            ) : (
              <div className={styles.row_to_read} style={{ fontSize: `${customLetters[activeCustomRow].size}px` }}>          
                {customLetters[activeCustomRow].letters.map((letra, letraIndex) => 
                  <MatrixLetter letter={letra} fontSize={customLetters[activeCustomRow].size} key={`${letraIndex}-matrixLetter`}></MatrixLetter>                  
                )}              
              </div>
            )
          }
        <div className={styles.base}>
          <div className={styles.control} style={{flex:"1", visibility: isSnellen ? "hidden" : "visible"}}>
            {customLetters.map((row, index) => (
              <div key={index}>
                <label>
                  Linha {index + 1}:
                  <input
                    type="text"
                    value={row.letters.join("")}
                    onChange={(e) => {                    
                      const newLetters = [...customLetters];                      
                      newLetters[index] = {
                        letters:e.target.value.toUpperCase().split(""),
                        size: customLetters[index].size
                      };
                      setCustomLetters(newLetters);
                    }}
                  />
                </label>
              </div>
            ))}
            <div>
              <label>
                Tamanho da fonte base (px):
              </label>
              <input
                type="number"
                name="line"
                id="line"
                value={customFontSize}
                onChange={(e) => {
                    setCustomFontSize(e.target.value)
                  }
                }
                min="0"
                max="500"
                step="10"
              />
            </div>
          </div>
          <div className={styles.preview} style={{flex:"1"}}>
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
          </div>
          <div className={styles.all_letters} style={{flex:"1"}}>
            {
              isSnellen ?
                snellen_letters.map((row, index) => (
                  <div key={index} style={{ fontSize: `${40}px` }}>
                    {row.letters}
                  </div>
                ))
                :
                customLetters.map((row, index) => (
                  <div key={index} style={{ fontSize: `${40}px` }}>
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
