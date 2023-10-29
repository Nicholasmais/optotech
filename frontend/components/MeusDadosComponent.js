import React from 'react'
import styles from '../styles/MeusDados.module.scss'; // Importe os estilos corretos
import LoginForm from './LoginForm';
import Link from 'next/link';

const MeusDadosComponent = ({setCurrent, isOpenForm, setIsOpenForm, user, email}) => {
  return (
    <>
      <div className={styles['meus-dados-container']}>
        <h1 className={styles.header}>Meus Dados</h1>

        <div className={styles['user-info']}>
          <p><strong>Nome:</strong> {user}</p>
          <p><strong>Email:</strong> {email}</p>
        </div>

        <div className={styles['button-container']}>
          <button className={styles['alterar-button']} onClick={() => setIsOpenForm(!isOpenForm)}>Alterar Dados</button>

          <Link href="/atendimento">
            <button className={styles['iniciar-button']}>Iniciar Atendimento</button>
          </Link>

          <button className={styles['alunos']} onClick={() => {setCurrent("alunos")}}>Alunos</button>

          <button className={styles['historico-btn']} onClick={() => {setCurrent("historico")}}>Histórico</button>

          <Link href="/">
            <button className={styles.backButton}>Voltar</button>
          </Link>
        </div>

        <hr />
        
        {isOpenForm && (
          <LoginForm isMeusDados={true} userObj={{ user: user, email: email }} setIsOpenForm={setIsOpenForm} isOpenForm={isOpenForm}></LoginForm>
        )}
      </div>
    </>
  )
}

export default MeusDadosComponent