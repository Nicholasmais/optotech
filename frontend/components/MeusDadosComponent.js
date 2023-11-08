import React from 'react'
import styles from '../styles/MeusDados.module.scss'; // Importe os estilos corretos
import LoginForm from './LoginForm';
import Link from 'next/link';
import Loading from './Loading';

const MeusDadosComponent = ({setCurrent, isOpenForm, setIsOpenForm, user, email, loading}) => {
  return (
    <>
      <div className={styles['meus-dados-container']}>
        <h1 className={styles.header}>Meus Dados</h1>
        <div className={styles['user-info']}>          
          {user && (<p><strong>Nome:</strong> {user}</p>)}
          <div style={{"display":"flex", "justifyContent":"center", "position":"absolute", "width":"50%"}}>
            <Loading loading={loading}></Loading>
          </div>
          {email && (<p><strong>Email:</strong> {email}</p>)}
        </div>
        <div className={styles['button-container']}>
          <button className={styles['alterar-button']} onClick={() => setIsOpenForm(!isOpenForm)}>Alterar Dados</button>

          <button className={styles['alunos']} onClick={() => {setCurrent("alunos")}}>Alunos</button>

          <button className={styles['historico-btn']} onClick={() => {setCurrent("historico")}}>Histórico</button>

          <button className={styles['estatisticas-btn']} onClick={() => {setCurrent("estatisticas")}}>Estatisticas</button>

          <Link href="/snellen">
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