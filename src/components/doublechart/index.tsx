import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import moment from 'moment';
import { ChartsContainer, ChartWrapper } from './style';

interface DoubleChartProps {
    apiKey: string;
    spreadsheetId: string;
    range: string;
    chartId: string;
}

const DoubleChart: React.FC<DoubleChartProps> = ({
  apiKey,
  spreadsheetId,
  range,
  chartId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        processChartData(data.values);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [apiKey, spreadsheetId, range]);

  const processChartData = (rows: any[]) => {
    if (rows.length > 1) {
      // Group rows by day
      const groupedByDay = rows.slice(1).reduce((acc: Record<string, any>, row: any) => {
        const day = moment(row[0], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'); // Extract the day
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(row);
        return acc;
      }, {});
  
      // For each group, select the last row
      const dailyData = Object.values(groupedByDay).map((dayRows: any[]) => dayRows[dayRows.length - 1]);
  
      // Now, you have one row per day, proceed as before
      const labels = dailyData.map(row => moment(row[0], 'YYYY-MM-DD HH:mm:ss').format('MMM D'));
      const SalesPrices = dailyData.map(row => +row[13]);
      const DayVolumes = dailyData.map(row => +row[11]);
  
      renderDoubleChart(labels, SalesPrices, DayVolumes);
    }
  };

  const renderDoubleChart = (labels: string[], SalesPrices: number[], DayVolumes: number[]) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      let gradient = ctx.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(0, 'rgba(143, 47, 91, 1)');
      gradient.addColorStop(1, 'rgba(222, 59, 64, 1)');

      let gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
      gradient2.addColorStop(0, 'rgba(21, 231, 182, 1)');
      gradient2.addColorStop(1, 'rgba(72, 195, 221, 0.2)');

      const newChartInstance = new Chart(ctx, {
        type: 'bar', // Base type for a mixed chart
        data: {
          labels,
          datasets: [
            {
              label: 'Avg Sales Price (SEI)',
              data: SalesPrices,
              borderColor: gradient,
              borderWidth: 2,
              pointBackgroundColor: 'rgba(21, 231, 182, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(21, 231, 182, 1)',
              fill: false,
              pointRadius: 0,
              type: 'line',
              yAxisID: 'y-axis-price',
            },
            {
              label: 'Daily Volume (SEI)',
              data: DayVolumes,
              backgroundColor: gradient2,
              borderColor: gradient2,
              yAxisID: 'y-axis-volume',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            'y-axis-price': {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Avg Price (SEI)',
                color: 'whitesmoke',
                font: {
                  size: 14,
                }
              },
            },
            'y-axis-volume': {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'SEI',
                color: 'whitesmoke',
                font: {
                  size: 14,
                }
              },
              // Align the grid to the left axis
              grid: {
                drawOnChartArea: false, // only draw the grid for this axis
              },
            },
          },
          plugins: {
            legend: {
              display: true, // Consider showing the legend to differentiate datasets
            },
            title: {
              display: true,
              text: "Daily Sales & Volume",
              color: '#ffffff',
              font: {
                size: 18,
              },
            },
          },
        },
      });

      // Cleanup the chart instance on component unmount
      return () => {
        newChartInstance.destroy();
      };
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

export default DoubleChart;