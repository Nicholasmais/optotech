import React from 'react';
import { Chart as ChartJS, CategoryScale, Tooltip, PieController, ArcElement,Title, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, Tooltip, PieController, ArcElement, ChartDataLabels, Title, Legend);

const PieChart = ( { data }) => {

  const total = data.superior + data.igual + data.inferior;
  const datasets = [
    {
      data: [data.igual, data.superior, data.inferior],
      backgroundColor: ['#6BFFB0', '#FF6B6B', '#6B92FF'],
    },
  ];


  const labels = ["Igual a 20/20", "Superior a 20/20", "Inferior a 20/20"];
 
  return (
    <div style={{ width: '100%', height: '80%' }}>
      <Pie
        data={{
          labels: labels,
          datasets: datasets,
        }}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            title: {
              display: true, // Enable title display
              text: 'Comparaçao da acuidade visual dos pacientes', // Set title text
            },
            legend: {
              display: true, // Enable legend display
              position: 'right', // Set legend position
              labels: {
                usePointStyle: true, // Use point style instead of square
              },
            },
            datalabels: {
              color: 'black',
              formatter: (value, context) => {
                return `${value} (${(value / total * 100).toFixed(1)}%)`;
              },
              anchor: 'center',
              align: 'center',
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;
