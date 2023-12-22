import React from 'react';
import styles from '../styles/Loading.module.scss';

const Loading = ({ loading }) => {
  if (!loading) {
    return null;
  }
  return (
    <div className={styles["loading-spinner-container"]}>
      <div className={styles["loading-spinner"]}></div>
    </div>
  );
};

export default Loading;
