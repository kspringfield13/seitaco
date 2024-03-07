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
  const [dataMode, setDataMode] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
  const [activeButton, setActiveButton] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Directly call processChartData using the passed data, no need to fetch data here.
    if (data) {
      processChartData(data);
    }
  }, [data, dataMode]); // Reacting to changes in data prop.

  const processChartData = (data: any[]) => {
    const filteredData = filterDataByMode(data);
    const chartLabels = filteredData.map(item => moment(item.timestamp).format('MMM D, ha'));
    const dataValues = filteredData.map(item => item.volume); // Assuming item.floor correctly represents the FloorPrice
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
                maxTicksLimit: 8, // Also within ticks
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
              color: 'whitesmoke',
              font: {
                size: 18,
              },
              // Align 'Floor Price' label to the left and change its color to grey
              padding: 20,
              align: 'start',
            },
          },
        },
      });

      setChartInstance(newChartInstance);
    }
  };

  const filterDataByMode = (data: any[]) => {
    switch (dataMode) {
      case 'daily':
        return data.filter(item => moment(item.timestamp).isSameOrAfter(moment().subtract(24, 'hours')));
      case 'weekly':
        return data.filter(item => moment(item.timestamp).isSameOrAfter(moment().subtract(7, 'days')));
      case 'monthly':
        return data.filter(item => moment(item.timestamp).isSameOrAfter(moment().subtract(1, 'month')));
      case 'all':
        return data;
      default:
        return data;
    }
  };

  const handleDataModeChange = (mode: 'all' | 'daily' | 'weekly' | 'monthly') => {
    setDataMode(mode);
    setActiveButton(mode);
  };




  return (
    <div className="chart-container" style={{ display: 'flex', position: 'relative' }}>
      <canvas ref={canvasRef} id={chartId} width="2216" height="760" style={{display: 'block', boxSizing: 'border-box', height: '100%', width: '1108px'}}></canvas>
      <div className="button-container" style={{ position: 'absolute', top: '5px', right: '-14px', marginTop: '1px', marginRight: '1px'}}>
        <button onClick={() => handleDataModeChange('daily')} style={{ marginLeft: '8px', padding: '7px 15px 7px 15px', border: 'none', borderRadius: '5px', backgroundImage: activeButton === 'daily' ? 'none' : 'linear-gradient(to top, rgba(222, 59, 64, 1), rgba(143, 47, 91, 1))', color: '#181818', cursor: 'pointer' }}>D</button>
        <button onClick={() => handleDataModeChange('weekly')} style={{ marginLeft: '8px', padding: '7px 15px 7px 15px', border: 'none', borderRadius: '5px', backgroundImage: activeButton === 'weekly' ? 'none' : 'linear-gradient(to top, rgba(222, 59, 64, 1), rgba(143, 47, 91, 1))', color: '#181818', cursor: 'pointer' }}>WK</button>
        <button onClick={() => handleDataModeChange('monthly')} style={{ marginLeft: '8px', padding: '7px 15px 7px 15px', border: 'none', borderRadius: '5px', backgroundImage: activeButton === 'monthly' ? 'none' : 'linear-gradient(to top, rgba(222, 59, 64, 1), rgba(143, 47, 91, 1))', color: '#181818', cursor: 'pointer' }}>M</button>
        <button onClick={() => handleDataModeChange('all')} style={{ marginLeft: '8px', padding: '7px 15px 7px 15px', border: 'none', borderRadius: '5px', backgroundImage: activeButton === 'all' ? 'none' : 'linear-gradient(to top, rgba(222, 59, 64, 1), rgba(143, 47, 91, 1))', color: '#181818', cursor: 'pointer' }}>ALL</button>
      </div>
    </div>
  );
};

export default ChartComponent;