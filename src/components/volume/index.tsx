import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import moment from 'moment';

interface ChartProps {
  chartId: string;
  chartTitle: string;
  label: string;
  data: any[];
}

const ChartComponent: React.FC<ChartProps> = ({
  chartId,
  chartTitle,
  data, // Now using data from props.
}) => {
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Directly call processChartData using the passed data, no need to fetch data here.
    if (data) {
      processChartData(data);
    }
  }, [data]); // Reacting to changes in data prop.

  const processChartData = (data: any[]) => {
    const chartLabels = data.map(item => moment(item.timestamp).format('MMM D, ha'));
    const dataValues = data.map(item => item.volume); // Assuming item.floor correctly represents the FloorPrice
    const label = "Volume"; // Static label for Floor Price
  
    renderChart(chartLabels, dataValues, label);
  };

  const renderChart = (chartLabels: string[], dataValues: number[], label: string) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      let gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(21, 231, 182, 1)');
      gradient.addColorStop(1, 'rgba(72, 195, 221, 0.2)');

      if (chartInstance) {
        chartInstance.destroy();
      }

      const newChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartLabels,
          datasets: [{
            label: label,
            data: dataValues,
            borderColor: gradient,
            borderWidth: 3,
            pointBackgroundColor: 'rgba(21, 231, 182, 1)',
            //pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(21, 231, 182, 1)',
            fill: false,
            pointRadius: 0
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Timestamp (UTC)',
                color: 'whitesmoke',
                font: {
                  size: 14,
                },
              },
              grid: {
                display: false,
              },
              ticks: {
                autoSkip: true, // Place autoSkip within ticks
                maxTicksLimit: 5, // Also within ticks
              },
            },
            y: {
              title: {
                display: true,
                text: 'SEI',
                color: 'whitesmoke',
                font: {
                  size: 14,
                },
              },
              grid: {
                display: true,
                color: 'rgba(85, 85, 85, 0.2)',
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: chartTitle,
              color: '#ffffff',
              font: {
                size: 18,
              },
            },
          },
        },
      });

      setChartInstance(newChartInstance);
    }
  };

  return (
        <canvas ref={canvasRef} id={chartId}></canvas>
  );
};

export default ChartComponent;