import React from 'react'
import styles from '../styles/ChangeArrow.module.scss';

const ChangeArrows = ({changeFunction}) => {
  return (
    <div className={styles.preview} style={{flex:"1"}}>
      <div className={styles.change_active_row}>
        <div onClick={() => {
          changeFunction(-1);
        }}>
        </div>
        <div onClick={() => {
          changeFunction(1);
        }}>
        </div>
      </div>
    </div>
  )
}

export default ChangeArrows