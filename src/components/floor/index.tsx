import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import moment from 'moment';
// Import the interface and possibly the function to get the collection details
import { CollectionDetailsType } from '../../utils/helpers'; // Adjust the path as necessary


interface ChartProps {
  chartId: string;
  chartTitle: string;
  label: string;
  data: any[];
  mintPrice: string;
  //collectionDetails: CollectionDetailsType; // Assume this prop is passed into the component
}

const ChartComponent: React.FC<ChartProps> = ({
  chartId,
  chartTitle,
  data,
  mintPrice,
  //collectionDetails, // Use this prop for mintPrice
}) => {
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  

  useEffect(() => {
    // Directly call processChartData using the passed data, no need to fetch data here.
    if (data) {
      processChartData(data);
    }
  }, [data, mintPrice]); // Reacting to changes in data prop.


  const processChartData = (data: any[]) => {
    // Ensure mintPrice is converted to a number if it's not already
    const mintPriceNumber = mintPrice === "Free" ? 0 : parseFloat(mintPrice);
    // Convert timestamps to formatted strings and prepend a label for the constant value
    const chartLabels = ['Mint', ...data.map(item => moment(item.timestamp).format('MMM D, ha'))];
    // Assuming item.floor correctly represents the data point, prepend the constant value
    const dataValues = [mintPriceNumber, ...data.map(item => item.floor)];

    const label = "Floor Price"; // Static label for Floor Price
  
    renderChart(chartLabels, dataValues, label);
  };

  const renderChart = (chartLabels: string[], dataValues: number[], label: string) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      let gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(21, 231, 182, 1)');
      gradient.addColorStop(1, 'rgba(72, 195, 221, 0.2)');
  
      // Remove the constant point value from the main dataset if it was previously included
      const mainDataValues = dataValues.slice(1); // This assumes dataValues[0] is the constant value
      const mainChartLabels = chartLabels.slice(1); // Adjust labels accordingly
  
      // Define the main dataset without the constant point
      const mainDataset = {
        label: label,
        data: mainDataValues,
        borderColor: gradient,
        borderWidth: 4,
        pointBackgroundColor: 'rgba(21, 231, 182, 1)',
        pointHoverBorderColor: 'rgba(21, 231, 182, 1)',
        fill: false,
        pointRadius: 0,
      };
  
      // Update the constant point dataset
      // Note: The constant point's label and value are set in processChartData, no changes needed here
      const constantPointDataset = {
        label: 'Mint Price',
        data: [dataValues[0]], // Keep only the constant point's value
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 4,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 2,
        fill: false,
        // Ensuring this appears as a single disconnected point
        showLine: false, // This ensures no line is drawn for this dataset
      };
  
      if (chartInstance) {
        chartInstance.destroy();
      }
  
      const newChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [chartLabels[0], ...mainChartLabels], // Reintegrate the constant label for alignment
          datasets: [mainDataset, constantPointDataset],
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