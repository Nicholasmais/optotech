import React from 'react';
import { Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(...registerables, annotationPlugin);

const BubbleChart = ( {data}) => {    
  const data2 = {
    datasets: [
      {
        label: 'Distribuição de Acuidade Visual por Idade',
        data:data,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',        
      },
    ],
  };

  const options = {
    maintainAspectRatio: true, // Definido para false para preencher todo o espaço
    responsive: true, // Definido para true para ser responsivo ao tamanho do container
    layout: {
      padding: 0,      
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 5,
          font:{
            size:20
          }          
        },        
        title: {
          display: true,
          text: 'Idade',
          font: {
            size: 20 // Ajuste para o tamanho desejado
          }
        },
      },
      x: {
        type: 'category',
        labels: ['20/200', '20/100', '20/70', '20/50', '20/40', '20/30', '20/25', '20/20', '20/15', '20/13', '20/10'],
        title: {
          display: true,
          text: 'Acuidade Visual',
          font: {
            size: 25 // Ajuste para o tamanho desejado
          }
        },
        ticks: {          
          font:{
            size:20
          }          
        }, 
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {            
            const label = `Acuidade: ${context.raw.x}, Quantidade: ${context.raw.r}, Idade: ${context.raw.y},`;
            return label;
          },
        },
      },
      annotation: {
        annotations: {
          goodVision: {
            type: 'box',
            xMin: '20/20',
            xMax: '20/10',
            yMin: 0,
            yMax: 'max',
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
            borderWidth: 0,
            label:{
              content:["Acuidade" ,"recomendada"],
              display:true,
              position:"start",
              font:{
                size:25
              }
            }
          },
        },
      },
      legend: {
        labels: {
          font: {
            size: 25,
            weight: "bold"
          }
        }
      },
      datalabels:{
        font:{
          size:25
        }
      }
    },
  };

  return (
    <div style={{ width: '100%' , height:"100%", backgroundColor:"none"}}>
      <Bubble data={data2} options={options} />
    </div>
  );
};

export default BubbleChart;
