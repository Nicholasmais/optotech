import React, { useEffect, useState } from 'react';
import styles from '../../../styles/Terms.module.scss';
import NavBar from '../../../components/NavBar';
import { useRouter } from 'next/router';
import ChangeArrows from '../../../components/ChangeArrows';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DownloadButton from '../../../components/DownloadButton';
import DpiCalculator from '../../../components/DpiCalculator';
import { useAuth } from '../../../contexts/AuthContext';

const api = require('../../../services/api');

const ResponsibilityComponentDpi = () => {
  const { authData, setAuthData } = useAuth();

  const router = useRouter();
  const [section, setSection] = useState(router?.query?.index || 0);
  const [isArrowFirst, setIsArrowFirst] = useState(true);
  const [isArrowLast, setIsArrowLast] = useState(router?.query?.index == 2 ? true : false);
  const [dpi, setDPI] = useState(authData?.user?.distancia || null)

  const toastConfig = {
    position: "top-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    closeButton: false
  };

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
    if (authData.user?.id){
      router.push("/meus-dados");
    }    
    else{
      router.push("/")
    }
  }
  
  const letterPx = (distance) => {
    return parseInt((5 * distance * Math.tan(Math.PI / 10800) * 1000 * dpi / 25.4 ));
  }

  const snellenTometers = (snellen) => {
    return snellen * 0.304
  }

  const handleChooseSize = async() => {
    await api.saveDpi({
      distancia: distancia
    }).then((res) => {
      toast.success("Sucesso ao salvar distância", toastConfig);
    }).catch((err) => {
      console.log(err);
      toast.error(err?.response?.data?.detail || "Erro ao salvar distância.", toastConfig);
    })
  }

  const [distancia, setDistancia] = useState(authData?.user?.distancia || 6);

  const content = {
    0: {
      title: "Instruções para Utilização do OptoTech (1 de 3)",
      list: [
        "Preparação:",
        [
          "Para a distância padrão do sistema, posicione-se a uma distância de aproximadamente 6 metros (20 pés) da tela do dispositivo. Isso é devido ao tamanho padrão da fonte (33 px)."
        ],
        "Leitura dos Optotipos:",
        [
          "Na tela, você verá uma série de letras em diferentes linhas. Começando pela linha inferior, tente ler as letras com atenção, e caso necessário, leia as linhas superiores até conseguir pelo menos metade das letras.",
          "Comece com o olho esquerdo, se for o caso, e depois repita o teste com o olho direito."
        ],
        "Interpretação dos Resultados:",
        [
          "O teste é baseado na notação '20/XX', onde o número superior (20) representa a distância padrão de 20 pés, que é usada para testar a visão.",
          "O número inferior (XX) indica a menor linha que você conseguiu ler corretamente. Por exemplo, se você conseguiu ler a linha que corresponde ao '20/40', isso significa que, à distância padrão de 20 pés (6 metros), você conseguiu ler letras que normalmente são lidas por pessoas com visão normal a 40 pés (12 metros).",
          "Quanto menor for o número após a barra, melhor é a sua acuidade visual. Se você conseguiu ler a linha '20/20', isso indica uma visão considerada normal."
        ]
      ],
    },
    1: {
      title: "Instruções para Utilização do OptoTech (2 de 3)",
      description: [
        "A precisão do teste OptoTech depende da calibração correta da DPI (dots per inch) do seu monitor. O usuário deve baixar um arquivo executável que irá realizar as medidas de seu monitor e registrará no OptoTech."
      ],
      list: [
        "Baixe o arquivo de calibração fornecido pelo OptoTech.",
        "Execute o arquivo baixado em seu computador.",
        "No programa de calibração, selecione a DPI desejada dentre as opções disponíveis, que são baseadas nas especificações do seu monitor.",
        "Insira o email cadastrado no OptoTech. Esta etapa é essencial para sincronizar os resultados da calibração com o seu perfil de usuário."
      ],
      downloadButton: <DownloadButton />
    },
    2: {
      title: "Instruções para Utilização do OptoTech (3 de 3)",
      description: [
        "A precisão dos testes no OptoTech é influenciada pela correta calibração da distância entre o usuário e o monitor. Embora o padrão Snellen seja de 6 metros (20 pés), o OptoTech permite a personalização da distância para acomodar diferentes ambientes, com um mínimo de 2 metros e máximo de 10 metros. Siga as instruções abaixo para calibrar a distância de forma adequada"      ],
      list: [
        "Digite a distância desejada entre 2 e 10 metros, considerando o espaço físico disponível.",        
      ],
      distance:(
        <>
          <label style={{"borderBottom":"1px solid black", "fontSize":"20px"}}> Distância configurada: {
                distancia
              }
              m
            </label>
            <div className={styles['font-size-input']}>             
              <input
                type="number"
                name="line"
                id="line"
                value={distancia}
                onChange={(e) => {
                  setDistancia(e.target.value);                                  
                }}
                min="2"
                max="10"
                step={`0.1`}
                className={styles['custom-input']}
              />
            </div>
            <button onClick={() => handleChooseSize()} style={{width:"240px"}}>Gravar distância</button>
        </>
      )
    },   
  };

  const currentSectionContent = content[section];

  useEffect(() =>{  
    const checkUser = async() => {
      await api.isAuth().then((res) => {
        setAuthData(res);
        if (!res.isAuth){
          router.push("/");
        }
      }).catch((err) => {
        router.push("/");
      });
    }        
    checkUser();    
  }, []);

  useEffect(() => {
    setDPI(authData?.user?.dpi || null);
  }, [authData])

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
            {currentSectionContent?.downloadButton ?
              (
                <div className={styles.formContainer}>
                  <DpiCalculator setDPI={setDPI} />                 
                </div>
              ) :
              (
                null
              )
            }
            {currentSectionContent?.distance ?
            (
              <div className={styles.formContainer}>
                {
                  currentSectionContent.distance
                }
              </div>
            ) :
            (
              null
            )
          }
          </>
        )}
        <ChangeArrows changeFunction={setIsTerm} isArrowFirst={isArrowFirst} isArrowLast={isArrowLast} elementId={"top-view"}></ChangeArrows>                                
      </div>
      <br></br>
    </>
  );
};

export default ResponsibilityComponentDpi;
