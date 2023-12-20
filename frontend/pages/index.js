import React, { useState } from 'react';
import styles from '../styles/Terms.module.scss';
import NavBar from '../components/NavBar';
import { useRouter } from 'next/router';
import ChangeArrows from '../components/ChangeArrows';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext';

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
  const [isArrowFirst, setIsArrowFirst] = useState(true);
  const [isArrowLast, setIsArrowLast] = useState(false);
  const [bodyLogin, setBodyLogin] = useState({});
  const [isCadastro, setIsCadastro] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoginEmailValid, setIsLoginEmailValid] = useState(true);
  const [isLoginPasswordValid, setIsLoginPasswordValid] = useState(true);
  const { authData } = useAuth();

  const setIsTerm = (increment) => {    
    const newRow = section + increment;
    if (newRow >= 0 && newRow < 3) {
      setSection(newRow);
      setIsArrowFirst(false);
      setIsArrowLast(false);
    }
    if (newRow <= 0){
      setIsArrowFirst(true);
    }
    if (newRow >= 2){
      setIsArrowLast(true);
    }
  }
  
  const goBack = async() => {
    if (authData?.isAuth){
      router.push('meus-dados/');
    }
    if (Object.keys(bodyLogin).length > 0){
      try {
        await api.login(bodyLogin).then((res) => {
          router.push('auth/');
        }
        ).catch((err) => {
          console.error(err);
          toast.error(err.response?.data?.detail || "Erro", toastConfig);  
        });
      } 
      catch (error) {
        console.error(error);
        toast.error(error.response?.data?.detail || "Erro", toastConfig);  
      }
    }
    else{
      router.push("/")
    }
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
        setBodyLogin({          
          email: email,
          password: password
        });
        }).catch((error) => {
        console.error(error);  
        toast.error(error.response?.data?.detail || "Erro", toastConfig);  
      });          
    }    
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const isEmailLoginValid = validateEmail(loginEmail);
    const isPasswordLoginValid = validatePassword(loginPassword);

    setIsLoginEmailValid(isEmailLoginValid);
    setIsLoginPasswordValid(isPasswordLoginValid);


    if (isEmailValid && isPasswordValid) {
        const body = {
          email: loginEmail,
          password: loginPassword
        };   
        try {
          await api.login(body).then((res) => {
            router.push('auth/');
          }).catch((err) => {
            toast.error(err.response?.data?.detail, toastConfig);  
          });
        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.detail || "Erro", toastConfig);  
        }
      }                  
  }

  const content = {
    0: {
      title: "Aplicação Para Teste de Encaminhamento Oftalmológico Usando Técnica de Optotipo.",
      description: [
        "OptoTech é uma plataforma online que oferece um teste de acuidade visual com base na tabela Snellen. Nossa plataforma permite que você realize o teste de acuidade visual e mantenha um registro de seus atendimentos anteriores.",
        "Antes de começar, é importante lembrar que o teste de acuidade visual online fornecido pelo OptoTech não substitui uma avaliação completa realizada por um oftalmologista ou profissional de saúde ocular licenciado. É uma ferramenta valiosa para obter uma noção geral da sua acuidade visual, mas outros fatores podem influenciar sua visão.",
        "Primeiramente, crie uma conta OptoTech a seguir:"
      ]
    },
    2: {
      form:{
        cadastro: {
          form: {
            onSubmit: handleFormSubmit,
            fields: [
              {
                label: "Nome:",
                type: "text",
                value: user,
                onChange: (e) => setUser(e.target.value),
                className: !isUserValid && isCadastro ? styles.invalid : "",
                errorMessage: !isUserValid && isCadastro
                  ? "Nome deve ter pelo menos 1 caractere"
                  : null,
              },
              {
                label: "Email:",
                type: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                className: !isEmailValid && isCadastro ? styles.invalid : "",
                errorMessage: !isEmailValid && isCadastro
                  ? "Email inválido"
                  : null,
              },
              {
                label: "Senha:",
                type: "password",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                className: !isPasswordValid && isCadastro ? styles.invalid : "",
                errorMessage: !isPasswordValid && isCadastro
                  ? "Senha deve ter pelo menos 6 caracteres"
                  : null,
              },
              {
                label: "Confirmar Senha:",
                type: "password",
                value: confirmPassword,
                onChange: (e) => setConfirmPassword(e.target.value),
                className: !isConfirmedPasswordValid && isCadastro ? styles.invalid : "",
                errorMessage: !isConfirmedPasswordValid && isCadastro
                  ? "As senhas não coincidem"
                  : null,
              },
            ],
          },
        },
        login: {
          form: {
            onSubmit: handleLoginSubmit,
            fields: [
              {
                label: "Email:",
                type: "email",
                value: loginEmail,
                onChange: (e) => setLoginEmail(e.target.value),
                className: !isLoginEmailValid && !isCadastro ? styles.invalid : "",
                errorMessage: !isLoginEmailValid && !isCadastro
                  ? "Email inválido"
                  : null,
              },
              {
                label: "Senha:",
                type: "password",
                value: loginPassword,
                onChange: (e) => setLoginPassword(e.target.value),
                className: !isLoginPasswordValid && !isCadastro ? styles.invalid : "",
                errorMessage: !isLoginPasswordValid && !isCadastro
                  ? "Senha deve ter pelo menos 6 caracteres"
                  : null,
              },
            ],
          },
        },
      }
    },
    1: {
      title: "Responsabilidades e Limitações",
      description: [
        "O teste de optotipo tabela Snellen é uma ferramenta valiosa para avaliar a acuidade visual aproximada. No entanto, é fundamental lembrar que este teste online não substitui uma avaliação completa realizada por um oftalmologista ou profissional de saúde ocular licenciado. A acuidade visual é apenas um aspecto da saúde ocular, e muitos outros fatores podem influenciar a visão.",
        "Ao utilizar este teste de optotipo tabela Snellen em nosso website, você concorda com as seguintes condições:"
      ],
      list: [
        "Limitações da Ferramenta: Este teste online é destinado apenas a fins informativos e não deve ser utilizado como uma substituição para um exame oftalmológico completo. Os resultados obtidos através deste teste podem não refletir com precisão o estado da sua visão e podem variar de acordo com diversos fatores, como iluminação, distância do dispositivo e qualidade do monitor.",
        "Recomendação para Consulta Profissional: Recomendamos enfaticamente que você consulte um oftalmologista ou um profissional de saúde ocular licenciado para uma avaliação completa e precisa da sua visão. Somente um profissional qualificado pode identificar problemas de visão, realizar testes especializados e fornecer orientação adequada com base no seu histórico de saúde ocular e outros fatores relevantes.",
        "Isenção de Responsabilidade: Não nos responsabilizamos por quaisquer consequências adversas decorrentes do uso deste teste de optotipo tabela Snellen. Você concorda em utilizar esta ferramenta por sua própria conta e risco.",
        "Ao prosseguir com o uso deste teste de optotipo tabela Snellen, você reconhece ter lido, entendido e concordado com os termos e condições acima mencionados. Lembre-se sempre de que a sua saúde ocular é uma prioridade e que um profissional de saúde ocular qualificado é a melhor fonte de orientação e diagnóstico precisos."
      ]
    }
  };

  const currentSectionContent = content[section];

  const checkCookies = async() => {
    await api.getCookies().then(res => {
      console.log(res);
    })
  }

  return (
    <>
      <ToastContainer />
      <NavBar goBack={goBack}></NavBar>      
      <div className={styles.responsibilityContainer}>
        {currentSectionContent && (
          <>
            {currentSectionContent.title && (
              <div className={styles.title}>{currentSectionContent.title}</div>
            )}
            {Array.isArray(currentSectionContent.description) && (
              currentSectionContent.description.map((paragraph, index) => (
                <p key={index} className={styles.description}>
                  {paragraph}
                </p>
              ))
            )}
            {currentSectionContent.form && (
              <form onSubmit={isCadastro ? currentSectionContent.form.cadastro.form.onSubmit : currentSectionContent.form.login.form.onSubmit} className={styles.form}>
                <div style={{"backgroundColor":"white", "padding":"2rem", "border":" 2px solid black"}}>
                  {isCadastro ? (
                    <>
                      {currentSectionContent.form.cadastro.form.fields.map((field, index) => (
                        <div key={index}>
                          <label>{field.label}</label>
                          <input
                            type={field.type}
                            value={field.value}
                            onChange={field.onChange}
                            className={field.className}
                          />
                          {field.errorMessage && (
                            <div className={styles.error}>{field.errorMessage}</div>
                          )}
                        </div>
                      ))}
                      <button type="submit">Cadastrar</button>
                      <button onClick={(e) => {setIsCadastro(false); e.preventDefault();}}>Já possui uma conta? Entrar</button>
                    </>
                  ) : (
                    <>
                      {currentSectionContent.form.login.form.fields.map((field, index) => (
                        <div key={index}>
                          <label>{field.label}</label>
                          <input
                            type={field.type}
                            value={field.value}
                            onChange={field.onChange}
                            className={field.className}
                          />
                          {field.errorMessage && (
                            <div className={styles.error}>{field.errorMessage}</div>
                          )}
                        </div>
                      ))}
                      <button type="submit">Entrar</button>
                      <button onClick={(e) => {setIsCadastro(true);e.preventDefault();}}>Criar uma conta</button>
                      <button onClick={(e) => {checkCookies()}}>checar cookis</button>

                    </>
                  )}
                </div>
              </form>
            )}
            {currentSectionContent.list && (
              <>
                <ol className={styles.list}>
                  {currentSectionContent.list.map((item, index) => (
                    <li key={index}>
                      {Array.isArray(item) ? (
                        <ul>
                          {item.map((subItem, subIndex) => (
                            <li key={subIndex}>{subItem}</li>
                          ))}
                        </ul>
                      ) : (
                        item
                      )}
                    </li>
                  ))}
                </ol>
              </>
            )}
            {currentSectionContent.downloadButton && (
              currentSectionContent.downloadButton
            )}
          </>
        )}
        <ChangeArrows changeFunction={setIsTerm} isArrowFirst={isArrowFirst} isArrowLast={isArrowLast} elementId={"top-view"}></ChangeArrows>                                
      </div>
      <br></br>
    </>
  );
};

export default ResponsibilityComponent;
