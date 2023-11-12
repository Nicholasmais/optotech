import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, Tooltip, BarController, BarElement, Title, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  BarController,
  BarElement,
  Title,
  Legend,
  ChartDataLabels
);

const BarChart = ({data}) => {
  const activeData = [data.patient.active, data.appointment.active];
  const unActiveData = [data.patient.unActive, data.appointment.unActive];
  const totalActiveUnactive = [data.patient.active + data.patient.unActive, data.appointment.active + data.appointment.unActive];  
  
  const data2 = {
    labels: ['Pacientes', 'Atendimentos'],
    datasets: [
      {
        label: 'Ativo',
        data: activeData,
        backgroundColor: '#0099FF',
      },
      {
        label: 'Inativo',
        data: unActiveData,
        backgroundColor: '#9932CC',
      },
      {
        // This will be our 'Total' label dataset
        label: '',
        data: totalActiveUnactive, // Our calculated totals
        backgroundColor: 'rgba(0, 0, 0, 0)', // Make this dataset invisible
      }
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Pacientes e atendimentos ativos/inativos',
        font: {
          size: 20 // Ajuste para o tamanho desejado
        }
      },
      datalabels: {
        color: 'black',
        display: true,
        formatter: (value, context) => {
          // If this is the 'Total' dataset, show the label
          if (context.datasetIndex === 2) {
            return `Total: ${value}`;
          }
          // Otherwise, return the value
          return value;
        },
        anchor: 'start',
        align: 'end',
        font:{
          size:20
        }
      },      
      legend: {
        display: true,
        labels: {
          usePointStyle: true, // Use point style instead of square
          font: {
            size: 20 // Ajuste para o tamanho desejado
          },
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            size: 16 // Ajuste para o tamanho desejado
          }
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: ~~(Math.max(...totalActiveUnactive)/10)*10 + 10,
        ticks: {
          font: {
            size: 16 // Ajuste para o tamanho desejado
          }
        },
      },
    },
    hover: {
      mode: 'nearest',
      animationDuration: 0,
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}> {/* Adjust height as needed */}
      <Bar data={data2} options={options} />
    </div>
  );
};

export default BarChart;
