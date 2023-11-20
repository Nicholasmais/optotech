import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

function fracao(fraccao) {
  const partes = fraccao.split('/'); // Divide a string em duas partes
  const numerador = Number(partes[0]); // Converte a primeira parte (numerador) em número
  const denominador = Number(partes[1]); // Converte a segunda parte (denominador) em número

  if(denominador === 0) {
    return 'Erro: Divisão por zero'; // Evita divisão por zero
  }

  const fraction = numerador / denominador ;
  return fraction.toFixed(1);
}

function calculateDate(date){
  const partes = date.split("-")
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

const LineChart = () => {
  const data = [
    { time: '2023-01-01', acuity: "20/20" },
    { time: '2023-02-01', acuity: "20/30" },
    { time: '2023-03-01', acuity: "20/50" },
    { time: '2023-04-01', acuity: "20/15" },
    // Adicione mais pontos de dados conforme necessário
  ]

  const calculatedValues = data?.map(d => fracao(d.acuity));

  const data2 = {
    labels: data?.map(d => calculateDate(d.time)),
    datasets: [
      {
        label: 'Acuidade Visual ao Longo do Tempo',
        data: calculatedValues,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const valueToFracMap = {};
  data?.forEach((d, i) => {
    valueToFracMap[calculatedValues[i]] = d.acuity;
  });  
  console.log(valueToFracMap);

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Usa o mapa para encontrar a fração correspondente ao valor
          callback: function(value) { 
            value = value.toFixed(1);            
            return valueToFracMap[value] || null;
          },
          autoSkip: true,
          stepSize: 0.1
        },
        title: {
          display: true,
          text: 'Acuidade Visual'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Tempo'
        }
      }
    },
    plugins: { 
      annotation: {
        annotations: {
          goodVision: {
            type: 'box',            
            yMin: 1,
            yMax: 2,
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
            borderWidth: 0,
            label:{
              content:["Acuidade" ,"recomendada"],
              display:true,
              position:"end",
              font:{
                size:20
              }
            }
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: "100%" }}>
      <Line data={data2} options={options} />
    </div>
  );
};

export default LineChart;
