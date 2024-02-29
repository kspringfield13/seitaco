import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import moment from 'moment';

interface DoubleChartProps {
    chartId: string;
    data: any[];
}

interface DataItem {
  timestamp: string;
  average_price_24hr: number;
  volume_24hr: number;
}

const DoubleChart: React.FC<DoubleChartProps> = ({
  chartId,
  data
}) => {
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Directly call processChartData using the passed data, no need to fetch data here.
    if (data) {
      processChartData(data);
    }
  }, [data]);

  const processChartData = (data: DataItem[]) => {
    // Group data by day
    const groupedByDay = data.reduce<Record<string, DataItem[]>>((acc, item) => {
      const day = moment(item.timestamp).format('YYYY-MM-DD');
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(item);
      return acc;
    }, {});
  
    // Extract the last entry for each day
    const lastEntries = Object.values(groupedByDay).map((entries) => entries[entries.length - 1]);
  
    // Prepare data for chart
    const labels = lastEntries.map(item => moment(item.timestamp).format('MMM D, ha'));
    const salesDayData = lastEntries.map(item => item.average_price_24hr);
    const volumeDayData = lastEntries.map(item => item.volume_24hr);
  
    renderDoubleChart(labels, salesDayData, volumeDayData);
  };

  const renderDoubleChart = (labels: string[], salesDayData: number[], volumeDayData: number[]) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      let gradient = ctx.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(0, 'rgba(143, 47, 91, 1)');
      gradient.addColorStop(1, 'rgba(222, 59, 64, 1)');

      let gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
      gradient2.addColorStop(0, 'rgba(21, 231, 182, 1)');
      gradient2.addColorStop(1, 'rgba(72, 195, 221, 0.2)');

      if (chartInstance) {
        chartInstance.destroy();
      }

      const newChartInstance = new Chart(ctx, {
        type: 'bar', // Base type for a mixed chart
        data: {
          labels,
          datasets: [
            {
              label: 'Avg Sales Price (SEI)',
              data: salesDayData,
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
              data: volumeDayData,
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
                drawOnChartArea: false,
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

      setChartInstance(newChartInstance);
    }
  };

  return (
        <canvas ref={canvasRef} id={chartId}></canvas>
  );
};

export default DoubleChart;