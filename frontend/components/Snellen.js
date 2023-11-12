import React, { useEffect, useState } from 'react';
import styles from '../styles/Snellen.module.scss';
import MatrixLetter from './MatrixLetter';
import Loading from './Loading';
import { toast } from 'react-toastify';
import ChangeArrows from './ChangeArrows';
import eye from '../assets/eye.png';
import hidden_eye from '../assets/hidden-eye.png';
import { useAuth  } from '../contexts/AuthContext';

const api = require('../services/api');

const Snellen = () => {
  const { authData, setAuthData } = useAuth();

  const [activeRow, setActiveRow] = useState(7);
  const [activeCustomRow, setActiveCustomRow] = useState(7); // Linha ativa na visualização "Personalize"
  const [loading, setLoading] = useState(true);
  const dpi = authData?.user?.dpi || 96;

  const letterPx = (distance) => {
    return (5 * distance * Math.tan(Math.PI / 10800) * 1000 * dpi / 25.4 );
  }
  
  const distanceToRead = (pixel) => {
    return (pixel * 25.4) / (5 * Math.tan(Math.PI / 10800) * 1000 * dpi);
  }

  const snellenTometers = (snellen) => {
    return snellen * 0.304
  }

  const [baseFont, setBaseFont] = useState(letterPx(snellenTometers(20)));

  const [customLetters, setCustomLetters] = useState([
    {
      letters: ["E"],
      snellen: 200,
      size: letterPx(snellenTometers(200)),
    },
    {
      letters: ["F", "P"],
      snellen: 100,
      size: letterPx(snellenTometers(100)),
    },
    {
      letters: ["T", "O", "Z"],
      snellen: 70,
      size: letterPx(snellenTometers(70)),
    },
    {
      letters: ["L", "P", "E", "D"],
      snellen: 60,
      size: letterPx(snellenTometers(60)),
    },
    {
      letters: ["P", "E", "C", "F", "D"],
      snellen: 40,
      size: letterPx(snellenTometers(40)),
    },
    {
      letters: ["E", "D", "F", "C", "Z", "P"],
      snellen: 30,
      size: letterPx(snellenTometers(30)),
    },
    {
      letters: ["F", "E", "L", "O", "P", "Z", "D"],
      snellen: 25,
      size: letterPx(snellenTometers(25)),
    },
    {
      letters: ["D", "E", "F", "P", "O", "T", "E", "C"],
      snellen: 20,
      size: letterPx(snellenTometers(20)),
    },
    {
      letters: ["L", "E", "F", "O", "B", "F", "C", "T"],
      snellen: 15,
      size: letterPx(snellenTometers(20)),
    },
  ]);
  
  const [isSnellen, setIsSnellen] = useState(true);
  const snellen_letters = [
    {
      letters: ["E"],
      snellen: 200,
      size: letterPx(snellenTometers(200)),
    },
    {
      letters: ["F", "P"],
      snellen: 100,
      size: letterPx(snellenTometers(100)),
    },
    {
      letters: ["T", "O", "Z"],
      snellen: 70,
      size: letterPx(snellenTometers(70)),
    },
    {
      letters: ["L", "P", "E", "D"],
      snellen: 60,
      size: letterPx(snellenTometers(60)),
    },
    {
      letters: ["P", "E", "C", "F", "D"],
      snellen: 40,
      size: letterPx(snellenTometers(40)),
    },
    {
      letters: ["E", "D", "F", "C", "Z", "P"],
      snellen: 30,
      size: letterPx(snellenTometers(30)),
    },
    {
      letters: ["F", "E", "L", "O", "P", "Z", "D"],
      snellen: 25,
      size: letterPx(snellenTometers(25)),
    },
    {
      letters: ["D", "E", "F", "P", "O", "T", "E", "C"],
      snellen: 20,
      size: letterPx(snellenTometers(20)),
    },
    {
      letters: ["L", "E", "F", "O", "B", "F", "C", "T"],
      snellen: 15,
      size: letterPx(snellenTometers(20)),
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
    const fetchAllLetters = async() => {
      await api.MatrixLetter().then((res) => {
        setAllLettersMatrix(res);
        setLoading(false);
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
                <div className={styles.row_to_read} style={{ fontSize: `${snellen_letters[activeRow].size}px` }}>          
                  <Loading loading={loading}></Loading>    
                  {snellen_letters[activeRow].letters.map((letra, letraIndex) =>                   
                    <MatrixLetter letter={allLettersMatrix[letra]} fontSize={snellen_letters[activeRow].size} key={`${letraIndex}-matrixLetter`}></MatrixLetter>                  
                  )}
                </div>
              </>
            ) : (
              <>
                <div className={styles.row_to_read} style={{ fontSize: `${customLetters[activeCustomRow].size}px` }}>          
                  <Loading loading={loading}></Loading>    
                  {customLetters[activeCustomRow].letters.map((letra, letraIndex) => 
                    <MatrixLetter letter={allLettersMatrix[letra]} fontSize={customLetters[activeCustomRow].size} key={`${letraIndex}-matrixLetter`}></MatrixLetter>                  
                  )}    
                </div>
              </>
            )
          }
        <div className={styles.base}>          
          <div className={`${styles["custom-container"]}`}  style={{flex:"1"}}>        
          <label style={{"borderBottom":"1px solid black"}}> Distância recomendada: { isSnellen ?
            distanceToRead(letterPx(snellenTometers(20))).toFixed(1) :
            distanceToRead(baseFont).toFixed(1)}
            m
          </label>
          {customLetters.map((row, index) => (
            <div key={index} className={styles['custom-row']} style={{visibility: isSnellen ? "hidden" : "visible"}}>
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
          <div className={styles['font-size-input']} style={{visibility: isSnellen ? "hidden" : "visible"}}>
            <label>
              Tamanho da fonte base (px):
            </label>
            <input
              type="number"
              name="line"
              id="line"
              value={parseInt(baseFont)}
              onChange={(e) => {
                setBaseFont(e.target.value);
                const newLetters = customLetters.map((row, index) => {            
                  const newSize = e.target.value * row.size / baseFont;
                  return {
                    letters: row.letters,
                    size: newSize,
                  };
                });
                setCustomLetters(newLetters);
              }}
              min="11"
              max="55"
              step={`1`}
              className={styles['custom-input']}
            />
          </div>
          </div>
          
          <ChangeArrows changeFunction={changeActiveRow} maxInput={snellen_letters.length}></ChangeArrows>
          
          <div className={styles.all_letters} style={{flex:"1"}}>
            {
              isSnellen ?
                snellen_letters.map((row, index) => (                  
                  <div key={index} style={{ fontSize: `${40}px`, color: index == activeRow ? `red` : "black","display":"flex", "flexDirection":"row"}}>
                    <div style={{"position":"absolute", "right":"0", "filter":"none !important"}}>
                      {index+1}
                    </div>
                    <div style={{"display":"flex", "flexDirection":"column", filter: !isHiddenEye ? "blur(5px)" : "none"}}>
                      {row.letters}
                    </div>                    
                  </div>
                ))
                :
                customLetters.map((row, index) => (
                  <div key={index} style={{ fontSize: `${40}px`, color: index == activeCustomRow ? `red` : "black","display":"flex", "flexDirection":"row"}}>
                    <div style={{"position":"absolute", "right":"0", "filter":"none !important"}}>
                      {index+1}
                    </div>
                    <div style={{"display":"flex", "flexDirection":"column", filter: !isHiddenEye ? "blur(5px)" : "none"}}>
                      {row.letters}
                    </div>                    
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
