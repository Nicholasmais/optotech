import React, { useState } from 'react';
import styles from '../styles/Terms.module.scss';
import NavBar from '../components/NavBar';
import { useRouter } from 'next/router';
import ChangeArrows from '../components/ChangeArrows';
import Calibration from '../components/Calibration';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const api = require('../services/api');

const ResponsibilityComponent = () => {
  const router = useRouter();
  const [section, setSection] = useState(0);
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUserValid, setIsUserValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmedPasswordValid, setIsConfirmedPasswordValid] = useState(true); 

  const setIsTerm = (increment) => {    
    const newRow = section + increment;
    if (newRow >= 0 && newRow < 5) {
      setSection(newRow);   
    }
  }

  const goBack = () => {
    router.push("/snellen");
  }

  const validateUser = (user) => {
    const regex = /^(?!\s*$).+/;
    return regex.test(user);
  }
  
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const toastConfig = {
    position: "top-left", // Position of the toast
    autoClose: 3000,       // Auto close duration in milliseconds (set to false to disable auto close)
    hideProgressBar: false, // Show/hide the progress bar
    closeOnClick: true,     // Close the toast when clicked
    pauseOnHover: true,     // Pause auto close on hover
    draggable: true,        // Allow the toast to be dragged
    closeButton: false
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isUserValid = validateUser(user);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    setIsUserValid(isUserValid);
    setIsEmailValid(isEmailValid);
    setIsPasswordValid(isPasswordValid);

    const passwordsMatch = password === confirmPassword;

    setIsConfirmedPasswordValid(passwordsMatch);

    if (isEmailValid && isPasswordValid && passwordsMatch) {
      const body = {
        user: user,
        email: email,
        password: password
      };
      await api.signup(body).then(async(res) => {        
        toast.success("Registro realizado com sucesso.", toastConfig); 
        const bodyLogin = {          
          email: email,
          password: password
        }; 
        try {
          await api.login(bodyLogin).then((res) => {
            router.push(res.url);
          }).catch((err) => {
            console.error(err);
            toast.error(err.response?.data.detail || "Erro", toastConfig);  
          });
        } catch (error) {
          console.error(error);
          toast.error(error.response?.data.detail || "Erro", toastConfig);  
        }
      }).catch((error) => {
        console.error(error);  
        toast.error(error.response.data.detail, toastConfig);  
      });
          
    }
    
  }

  return (
    <>
      <ToastContainer />
      <NavBar goBack={goBack}></NavBar>      
      <div className={styles.responsibilityContainer}>
        {section === 0 ? 
          <>
            <h2 className={styles.title}>Bem-Vindo ao OptoTech</h2>
            <p className={styles.description}>
              OptoTech é uma plataforma online que oferece um teste de acuidade visual com base na tabela Snellen. Nossa plataforma permite que você realize o teste de acuidade visual e mantenha um registro de seus atendimentos anteriores.
            </p>
            <p className={styles.description}>
              Antes de começar, é importante lembrar que o teste de acuidade visual online fornecido pelo OptoTech não substitui uma avaliação completa realizada por um oftalmologista ou profissional de saúde ocular licenciado. É uma ferramenta valiosa para obter uma noção geral da sua acuidade visual, mas outros fatores podem influenciar sua visão.
            </p>
            <p className={styles.description}>
              Siga as instruções a seguir para usar o OptoTech com eficácia:
            </p>
          </>
        : section === 1 ? (
          <>
            <h2 className={styles.title}>Instruções para Utilização do OptoTech (1 de 2)</h2>  
            <ol className={styles.list}>
              <li>Preparação:
                <ul>
                  <li>Para a distância padrão do sistema, posicione-se a uma distância de aproximadamente 6 metros (20 pés) da tela do dispositivo. Isso é devido ao tamanho padrão da fonte (33 px).</li>
                </ul>
              </li>
              <li>Posicionamento:
                <ul>
                  <li>Mantenha-se em uma posição reta e com a coluna ereta.</li>
                </ul>
              </li>         
              <li>Leitura dos Optotipos:
                <ul>
                  <li>Na tela, você verá uma série de letras em diferentes linhas. Começando pela linha inferior, tente ler as letras com atenção, e caso necessário, leia as linhas superiores até conseguir pelo menos metade das letras.</li>
                  <li>Comece com o olho esquerdo, se for o caso, e depois repita o teste com o olho direito.</li>
                </ul>
              </li>
              <li>Interpretação dos Resultados:
                <ul>
                  <li>O teste é baseado na notação "20/XX", onde o número superior (20) representa a distância padrão de 20 pés, que é usada para testar a visão.</li>
                  <li>O número inferior (XX) indica a menor linha que você conseguiu ler corretamente. Por exemplo, se você conseguiu ler a linha que corresponde ao "20/40", isso significa que, à distância padrão de 20 pés (6 metros), você conseguiu ler letras que normalmente são lidas por pessoas com visão normal a 40 pés (12 metros).</li>
                  <li>Quanto menor for o número após a barra, melhor é a sua acuidade visual. Se você conseguiu ler a linha "20/20", isso indica uma visão considerada normal.</li>
                </ul>
              </li>
            </ol>
            <p className={styles.description}>
              Se você não conseguir se posicionar a 6 metros de distância da tela do dispositivo, o OptoTech oferece uma opção de personalização. Você pode ajustar o tamanho da fonte para uma distância possível e até mesmo mudar as letras para evitar memorização. Esta personalização permite que você faça o teste de acuidade visual de forma mais conveniente, adequando-o às suas necessidades.
            </p>
          </>
        ) : section === 2 ? 
          <>
            <h2 className={styles.title}>Instruções para Utilização do OptoTech (2 de 2)</h2>  
            <p className={styles.description}>
              Além disso, é importante lembrar que a precisão do teste pode ser afetada pela DPI (dots per inch) do seu monitor. Recomendamos que os usuários façam uma calibração inicial para obter resultados mais precisos. Para realizar a calibração e calcular a DPI do seu monitor, certifique-se de criar um espaço para o componente de calibração fornecido pelo OptoTech.
            </p>
            <ol className={styles.list}>
              <li>OptoTech renderizará um quadrado preto de 100px na tela.</li>
              <li>Utilize uma régua física para medir o tamanho real do quadrado em milímetros. Esta medição é fundamental para calcular a DPI do seu monitor.</li>
              <li>Informe o tamanho medido em milímetros no componente de calibração do OptoTech.</li>
              <li>O OptoTech calculará automaticamente a DPI aproximada do seu monitor com base nas informações fornecidas.</li>
            </ol>
            <Calibration></Calibration>
          </>
          : section === 3 ? 
          <>
            <h2 className={styles.title}>Responsabilidades e Limitações</h2>
            <p className={styles.description}>
              O teste de optotipo Snellen Chart é uma ferramenta valiosa para avaliar a acuidade visual aproximada. No entanto, é fundamental lembrar que este teste online não substitui uma avaliação completa realizada por um oftalmologista ou profissional de saúde ocular licenciado. A acuidade visual é apenas um aspecto da saúde ocular, e muitos outros fatores podem influenciar a visão.
            </p>
            <p className={styles.description}>
              Ao utilizar este teste de optotipo Snellen Chart em nosso website, você concorda com as seguintes condições:
            </p>
            <ul className={styles.list}>
              <li>Limitações da Ferramenta: Este teste online é destinado apenas a fins informativos e não deve ser utilizado como uma substituição para um exame oftalmológico completo. Os resultados obtidos através deste teste podem não refletir com precisão o estado da sua visão e podem variar de acordo com diversos fatores, como iluminação, distância do dispositivo e qualidade do monitor.</li>
              <li>Recomendação para Consulta Profissional: Recomendamos enfaticamente que você consulte um oftalmologista ou um profissional de saúde ocular licenciado para uma avaliação completa e precisa da sua visão. Somente um profissional qualificado pode identificar problemas de visão, realizar testes especializados e fornecer orientação adequada com base no seu histórico de saúde ocular e outros fatores relevantes.</li>
              <li>Isenção de Responsabilidade: Não nos responsabilizamos por quaisquer consequências adversas decorrentes do uso deste teste de optotipo Snellen Chart. Você concorda em utilizar esta ferramenta por sua própria conta e risco.</li>
            </ul>
            <p className={styles.description}>
              Ao prosseguir com o uso deste teste de optotipo Snellen Chart, você reconhece ter lido, entendido e concordado com os termos e condições acima mencionados. Lembre-se sempre de que a sua saúde ocular é uma prioridade e que um profissional de saúde ocular qualificado é a melhor fonte de orientação e diagnóstico precisos.
            </p> 
          </>
          : section === 4 ? 
          <>
            <form onSubmit={handleFormSubmit} className={styles.form}>
              <div style={{"backgroundColor":"white", "padding":"2rem", "border":" 2px solid black"}}>
                <div>
                  <label>Nome:</label>
                  <input
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className={!isUserValid ? styles.invalid : ''}
                  />
                  {!isUserValid && (
                    <div className={styles.error}>Nome deve ter pelo menos 1 caractere</div>
                  )}
                </div>
                <div>
                  <label>Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={!isEmailValid ? styles.invalid : ''}
                  />
                  {!isEmailValid && (
                    <div className={styles.error}>Email inválido</div>
                  )}
                </div>
                <div>
                  <label>Senha:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={!isPasswordValid ? styles.invalid : ''}
                  />
                  {!isPasswordValid && (
                    <div className={styles.error}>Senha deve ter pelo menos 6 caracteres</div>
                  )}
                </div>
                <div>
                  <label>Confirmar Senha:</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={!isConfirmedPasswordValid ? styles.invalid : ''}
                  />
                  {!isConfirmedPasswordValid && (
                    <div className={styles.error}>As senhas não coincidem</div>
                  )}
                </div>
                <button type="submit">Cadastrar</button>
              </div>
            </form>
          </>
          : null
        }
        <ChangeArrows changeFunction={setIsTerm} elementId={"top-view"}></ChangeArrows>                                
      </div>
      <br></br>
    </>
  );
};

export default ResponsibilityComponent;
