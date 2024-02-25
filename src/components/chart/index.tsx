import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import moment from 'moment';
import { ChartsContainer } from './style';
import { ChartWrapper } from './style';
import { downsampleData } from 'utils/helpers';

interface ChartProps {
  apiKey: string;
  spreadsheetId: string;
  range: string;
  chartId: string;
  chartTitle: string;
  label: string;
  dataSet: 'FloorPrice' | 'Volume';
}

const ChartComponent: React.FC<ChartProps> = ({
  apiKey,
  spreadsheetId,
  range,
  chartId,
  chartTitle,
  label,
  dataSet,
}) => {
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        processChartData(data.values, dataSet);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [apiKey, spreadsheetId, range, dataSet]);

  const processChartData = (rows: any[], dataSet: 'FloorPrice' | 'Volume') => {
    if (rows.length > 1) {
      const dataRows = rows.slice(1);
      
      // Apply downsampling to your data
      const downsampledLabels = downsampleData(
        dataRows.map(row => moment(row[0], 'YYYY-MM-DD HH:mm:ss').format('MMM D, ha'))
      );

      // Determine which dataset to use based on the dataSet prop
      const downsampledData = downsampleData(
        dataRows.map(row => +row[dataSet === 'FloorPrice' ? 8 : 9])
      );

      // Use the downsampled data for rendering the chart
      renderChart(downsampledLabels, downsampledData, label);
    }
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
            borderWidth: 2,
            pointBackgroundColor: 'rgba(21, 231, 182, 1)',
            pointBorderColor: '#fff',
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
    <ChartsContainer>
      <ChartWrapper>
        <canvas ref={canvasRef} id={chartId}></canvas>
      </ChartWrapper>
    </ChartsContainer>
  );
};

export default ChartComponent;