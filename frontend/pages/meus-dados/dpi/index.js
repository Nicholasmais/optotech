import React, { useState } from 'react';
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
  const [section, setSection] = useState(0);
  const [isArrowFirst, setIsArrowFirst] = useState(true);
  const [isArrowLast, setIsArrowLast] = useState(false);

  const setIsTerm = (increment) => {    
    const newRow = section + increment;
    if (newRow >= 0 && newRow < 2) {
      setSection(newRow);
      setIsArrowFirst(false);
      setIsArrowLast(false);
    }
    if (newRow <= 0){
      setIsArrowFirst(true);
    }
    if (newRow >= 1){
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

  const toastConfig = {
    position: "top-left", // Position of the toast
    autoClose: 3000,       // Auto close duration in milliseconds (set to false to disable auto close)
    hideProgressBar: false, // Show/hide the progress bar
    closeOnClick: true,     // Close the toast when clicked
    pauseOnHover: true,     // Pause auto close on hover
    draggable: true,        // Allow the toast to be dragged
    closeButton: false
  };

  const content = {
    0: {
      title: "Instruções para Utilização do OptoTech (1 de 2)",
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
      description: "Se você não conseguir se posicionar a 6 metros de distância da tela do dispositivo, o OptoTech oferece uma opção de personalização. Você pode ajustar o tamanho da fonte para uma distância possível e até mesmo mudar as letras para evitar memorização. Esta personalização permite que você faça o teste de acuidade visual de forma mais conveniente, adequando-o às suas necessidades."
    },
    1: {
      title: "Instruções para Utilização do OptoTech (2 de 2)",
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
   
  };

  const currentSectionContent = content[section];

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
                  <DpiCalculator/>
                  {
                    currentSectionContent.downloadButton
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
