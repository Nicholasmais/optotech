import React, { useState } from 'react';
import styles from '../../styles/Terms.module.scss';
import NavBar from '../../components/NavBar';
import { useRouter } from 'next/router';
import ChangeArrows from '../../components/ChangeArrows';

const ResponsibilityComponent = () => {
  const router = useRouter();
  const [isTerm, setIsTerm] = useState(-1);
  const goBack = () => {
    router.push("/");
  }

  return (
    <>
      <NavBar goBack={goBack}></NavBar>      
      <div className={styles.responsibilityContainer}>
        {isTerm < 0 ? 
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
              <li>Risco de Autodiagnóstico: A autodiagnóstico com base em testes online pode levar a interpretações equivocadas e ações inadequadas. O uso inadequado dessas informações pode resultar em atraso de diagnóstico e tratamento de condições oftalmológicas potencialmente sérias.</li>
              <li>Isenção de Responsabilidade: Não nos responsabilizamos por quaisquer consequências adversas decorrentes do uso deste teste de optotipo Snellen Chart. Você concorda em utilizar esta ferramenta por sua própria conta e risco.</li>
            </ul>
            <p className={styles.note}>
              Ao prosseguir com o uso deste teste de optotipo Snellen Chart, você reconhece ter lido, entendido e concordado com os termos e condições acima mencionados. Lembre-se sempre de que a sua saúde ocular é uma prioridade e que um profissional de saúde ocular qualificado é a melhor fonte de orientação e diagnóstico precisos.
            </p> 
          </>
        :
        <>
          <h2 className={styles.title}>Instruções para Utilização do OptoTech</h2>
          <p className={styles.description}>
            Este teste foi desenvolvido para ajudá-lo a ter uma noção geral da sua acuidade visual, mas lembre-se de que ele não substitui uma avaliação profissional feita por um oftalmologista. Aqui estão as etapas simples para realizar o teste:
          </p>
          <ol className={styles.list}>
            <li>Preparação:
              <ul>
                <li>Certifique-se de estar em um ambiente bem iluminado, preferencialmente com luz natural ou iluminação adequada.</li>
                <li>Para a distância padrão do sistema, posicione-se a uma distância de aproximadamente 6 metros (20 pés) da tela do dispositivo. Isso é devido ao tamanho padrão da fonte (57 px).</li>
              </ul>
            </li>
            <li>Posicionamento:
              <ul>
                <li>Mantenha-se em uma posição reta e com a coluna ereta.</li>
              </ul>
            </li>
            <li>Tampar os Olhos:
              <ul>
                <li>Se você estiver realizando o teste em apenas um olho, tampe o olho que não está sendo testado com uma mão. Isso ajuda a evitar que o olho não testado influencie os resultados.</li>
              </ul>
            </li>
            <li>Leitura dos Optotipos:
              <ul>
                <li>Na tela, você verá uma série de letras em diferentes linhas. Começando pela linha superior, tente ler as letras com atenção.</li>
                <li>Comece com o olho esquerdo, se for o caso, e depois repita o teste com o olho direito.</li>
              </ul>
            </li>
            <li>Interpretação dos Resultados:
              <ul>
                <li>O teste é baseado na notação "20/XX", onde o número superior (20) representa a distância padrão de 20 pés, que é usada para testar a visão.</li>
                <li>O número inferior (XX) indica a menor linha que você conseguiu ler corretamente. Por exemplo, se você conseguiu ler a linha que corresponde ao "20/40", isso significa que, à distância padrão de 20 pés, você conseguiu ler letras que normalmente são lidas por pessoas com visão normal a 40 pés.</li>
                <li>Quanto menor for o número após a barra, melhor é a sua acuidade visual. Se você conseguiu ler a linha "20/20", isso indica uma visão considerada normal.</li>
              </ul>
            </li>
          </ol>
        </>
        }
        <ChangeArrows changeFunction={setIsTerm}></ChangeArrows>
      </div>
      <br></br>
    </>
  );
};

export default ResponsibilityComponent;
