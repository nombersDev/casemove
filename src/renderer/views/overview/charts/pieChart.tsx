import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  LinearScale,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ConvertPricesFormatted } from 'renderer/functionsClasses/prices';
import { ReducerManager } from 'renderer/functionsClasses/reducerManager';
import { useSelector } from 'react-redux';
import { Prices, Settings } from 'renderer/interfaces/states';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LinearScale,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function PieChart({ data, headerName }) {
  const ReducerClass = new ReducerManager(useSelector);
  let settingsData: Settings = ReducerClass.getStorage(
    ReducerClass.names.settings
  );
  let pricingData: Prices = ReducerClass.getStorage(ReducerClass.names.pricing);
  const converter = new ConvertPricesFormatted(settingsData, pricingData);

  const title = (tooltipItems) => {
    let percentageData: Array<number> = [];
    let sum = 0;

    tooltipItems.dataset.data.forEach((element) => {
      sum += element;
    });
    tooltipItems.dataset.data.forEach((element) => {
      let percentage = (element * 100) / sum;
      percentageData.push(percentage);
    });
    if (settingsData.overview.by == 'price') {
      return (
        tooltipItems.label + ': ' + converter.formatPrice(tooltipItems.raw) + ' - ' + percentageData[tooltipItems.dataIndex].toFixed(2) + '%'
      );
    }
    return tooltipItems.label + ': ' + tooltipItems.raw  + ' - ' + percentageData[tooltipItems.dataIndex].toFixed(2) + '%'
  };

  // Radar options
  const options = {
    plugins: {
      legend: {
        labels: {
          position: 'right',
          color: '#d6d3cd',
        },
      },
      title: {
        display: true,
        text: headerName,
        color: '#d6d3cd',
      },
      tooltip: {
        callbacks: {
          label: title,
        },
      },
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map((data) => {
            sum += data;
          });
          let percentage = ((value * 100) / sum).toFixed(2) + '%';
          return percentage;
        },
        color: '#fff',
        display: function (context) {
          let percentageData: Array<number> = [];
          let sum = 0;

          context.dataset.data.forEach((element) => {
            sum += element;
          });
          context.dataset.data.forEach((element) => {
            let percentage = (element * 100) / sum;
            percentageData.push(percentage);
          });

          if (percentageData[context.dataIndex] > 4) {
            return true;
          }
          if (percentageData[context.dataIndex] > 2) {
            return 'auto';
          }
          return false;

        },
      },
    },
  };

  return (
    <>
      <Pie data={data} plugins={[ChartDataLabels]} options={options} />
    </>
  );
}
