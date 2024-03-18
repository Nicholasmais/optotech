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

const LineChart = ({ data }) => {
  const calculatedValues = data?.map(d => fracao(d.acuity));
  const data2 = {
    labels: data?.map(d => calculateDate(d.time)),
    datasets: [
      {
        label: 'Acuidade Visual ao Longo do Tempo por Paciente',     
        data: calculatedValues,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointRadius: 20,
      }
    ]
  };

  const valueToFracMap = {};
  data?.forEach((d, i) => {
    valueToFracMap[calculatedValues[i]] = d.acuity;
  });  

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
          stepSize: 0.1,
          font:{
            size:20
          }
        },
        title: {
          display: true,
          text: 'Acuidade Visual',
          font:{
            size:20
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Data',
          font:{
            size:20
          }
        },
        ticks:{
          font:{
            size:25
          }
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
                size:25
              }
            }
          },
        },       
      },
      datalabels:{
        font:{
          size:25
        }
      },
      legend: {
        labels: {
          font: {
            size: 25,
            weight: "bold"
          }
        }
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
