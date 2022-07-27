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
  
  
  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LinearScale,
    LineElement,
    Filler,
    Tooltip,
    Legend
  );
  
  export default function PieChart({data, headerName}) {
  
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
            color: '#d6d3cd'
        },
        datalabels: {
          formatter: (value, ctx) => {
              let sum = 0;
              let dataArr = ctx.chart.data.datasets[0].data;
              dataArr.map(data => {
                  sum += data;
              });
              let percentage = (value*100 / sum).toFixed(2)+"%";
              return percentage;
          },
          color: '#fff',
          display: 'auto'
      }
    }
    };
  
  
    return (
      <>
        <Pie data={data} plugins={[ChartDataLabels]}  options={options}/>
      </>
    );
  }
  