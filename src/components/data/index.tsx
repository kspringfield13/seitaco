import React, { useEffect, useState } from 'react';
import FloorPriceChart from '../floor'; // Assume this is your modified FloorPrice component
import VolumeChart from '../volume';
import StatsContainer from '../stats';
import DoubleChart from '../doublechart'; // This will be your Volume chart component
import * as C from "./style"

const ChartDataContainer: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const serverUrl = 'https://seitaco-server-1d85377b001f.herokuapp.com/get-data';
      //const serverUrl = 'http://127.0.0.1:5000/get-data';
      try {
        const response = await fetch(serverUrl);
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  // Assuming the latest row is the last item in the array
  const latestRow = chartData[chartData.length - 1];

  return (
    <>
      <StatsContainer data={latestRow}/>
      <C.ChartsContainer>
        <C.ChartWrapper>
          <FloorPriceChart data={chartData} chartId="floorPriceChart" chartTitle="Floor Price" label="Floor Price" />
        </C.ChartWrapper>
        <C.ChartWrapper>
          <VolumeChart data={chartData} chartId="volumeChart" chartTitle="Volume" label="Volume" />
        </C.ChartWrapper>
      </C.ChartsContainer>
      <C.ChartsContainerFull>
        <C.ChartWrapperFull>
          <DoubleChart data={chartData} chartId="doubleChart"/>
        </C.ChartWrapperFull>
      </C.ChartsContainerFull>
    </>
  );
};

export default ChartDataContainer;