import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Scatter } from 'react-chartjs-2';
import api from '../services/api';
import './Charts.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Charts = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeChart, setActiveChart] = useState('companyBar');

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await api.getChartData();
      setChartData(response.data);
    } catch (err) {
      setError('Failed to load chart data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading chart data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!chartData || !chartData.companies || chartData.companies.length === 0) {
    return <div className="no-data">No data available for charts. Please upload an Excel file or generate data first.</div>;
  }

  // Company Revenue and Profit Bar Chart
  const renderCompanyBarChart = () => {
    const labels = chartData.companies.map(company => company.name);
    const revenueData = chartData.companies.map(company => parseFloat(company.revenue));
    const profitData = chartData.companies.map(company => parseFloat(company.profit));
    
    const data = {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: revenueData,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgba(53, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Profit',
          data: profitData,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Revenue and Profit by Company',
          font: {
            size: 16,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount ($)',
          },
        },
      },
    };
    
    return <Bar data={data} options={options} />;
  };

  // Country Distribution Bar Chart
  const renderCountryBarChart = () => {
    const countries = Object.keys(chartData.country_data);
    const companyCounts = countries.map(country => chartData.country_data[country].company_count);
    
    const data = {
      labels: countries,
      datasets: [
        {
          label: 'Number of Companies',
          data: companyCounts,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Companies by Country',
          font: {
            size: 16,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Companies',
          },
        },
      },
    };
    
    return <Bar data={data} options={options} />;
  };

  // Revenue by Country Pie Chart
  const renderRevenuePieChart = () => {
    const countries = Object.keys(chartData.country_data);
    const revenueData = countries.map(country => chartData.country_data[country].total_revenue);
    
    const data = {
      labels: countries,
      datasets: [
        {
          data: revenueData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Revenue Distribution by Country',
          font: {
            size: 16,
          },
        },
      },
    };
    
    return <Pie data={data} options={options} />;
  };

  // Profit by Country Pie Chart
  const renderProfitPieChart = () => {
    const countries = Object.keys(chartData.country_data);
    const profitData = countries.map(country => chartData.country_data[country].total_profit);
    
    const data = {
      labels: countries,
      datasets: [
        {
          data: profitData,
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Profit Distribution by Country',
          font: {
            size: 16,
          },
        },
      },
    };
    
    return <Pie data={data} options={options} />;
  };

  // Employees by Country Pie Chart
  const renderEmployeesPieChart = () => {
    const countries = Object.keys(chartData.country_data);
    const employeeData = countries.map(country => chartData.country_data[country].total_employees);
    
    const data = {
      labels: countries,
      datasets: [
        {
          data: employeeData,
          backgroundColor: [
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
          ],
          borderColor: [
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Employee Distribution by Country',
          font: {
            size: 16,
          },
        },
      },
    };
    
    return <Pie data={data} options={options} />;
  };

  // Revenue vs Profit Scatter Plot
  const renderRevenueVsProfitScatter = () => {
    const scatterData = chartData.companies.map(company => ({
      x: parseFloat(company.revenue),
      y: parseFloat(company.profit),
    }));
    
    const data = {
      datasets: [
        {
          label: 'Revenue vs Profit',
          data: scatterData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Revenue vs Profit Correlation',
          font: {
            size: 16,
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `Revenue: $${context.parsed.x.toLocaleString()}, Profit: $${context.parsed.y.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Revenue ($)',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Profit ($)',
          },
        },
      },
    };
    
    return <Scatter data={data} options={options} />;
  };

  // High Revenue Employees Bar Chart
  const renderHighRevenueEmployeesBar = () => {
    const highRevenueCompanies = chartData.high_revenue_companies.filter(
      company => parseFloat(company.revenue) > 20000
    );
    
    const labels = highRevenueCompanies.map(company => company.name);
    const employeeData = highRevenueCompanies.map(company => company.employees);
    
    const data = {
      labels,
      datasets: [
        {
          label: 'Number of Employees',
          data: employeeData,
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Employee Count for Companies with Revenue > $20,000',
          font: {
            size: 16,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Employees',
          },
        },
      },
    };
    
    return <Bar data={data} options={options} />;
  };

  // Render the appropriate chart based on the activeChart state
  const renderActiveChart = () => {
    switch(activeChart) {
      case 'companyBar':
        return renderCompanyBarChart();
      case 'countryBar':
        return renderCountryBarChart();
      case 'revenuePie':
        return renderRevenuePieChart();
      case 'profitPie':
        return renderProfitPieChart();
      case 'employeesPie':
        return renderEmployeesPieChart();
      case 'revenueVsProfit':
        return renderRevenueVsProfitScatter();
      case 'highRevenueEmployees':
        return renderHighRevenueEmployeesBar();
      default:
        return renderCompanyBarChart();
    }
  };

  return (
    <div className="charts-page">
      <h1 className="page-title">Data Visualization</h1>
      
      <div className="chart-selection">
        <button 
          className={`chart-btn ${activeChart === 'companyBar' ? 'active' : ''}`}
          onClick={() => setActiveChart('companyBar')}
        >
          Revenue & Profit by Company
        </button>
        <button 
          className={`chart-btn ${activeChart === 'countryBar' ? 'active' : ''}`}
          onClick={() => setActiveChart('countryBar')}
        >
          Companies by Country
        </button>
        <button 
          className={`chart-btn ${activeChart === 'revenuePie' ? 'active' : ''}`}
          onClick={() => setActiveChart('revenuePie')}
        >
          Revenue by Country
        </button>
        <button 
          className={`chart-btn ${activeChart === 'profitPie' ? 'active' : ''}`}
          onClick={() => setActiveChart('profitPie')}
        >
          Profit by Country
        </button>
        <button 
          className={`chart-btn ${activeChart === 'employeesPie' ? 'active' : ''}`}
          onClick={() => setActiveChart('employeesPie')}
        >
          Employees by Country
        </button>
        <button 
          className={`chart-btn ${activeChart === 'revenueVsProfit' ? 'active' : ''}`}
          onClick={() => setActiveChart('revenueVsProfit')}
        >
          Revenue vs Profit
        </button>
        <button 
          className={`chart-btn ${activeChart === 'highRevenueEmployees' ? 'active' : ''}`}
          onClick={() => setActiveChart('highRevenueEmployees')}
        >
          High Revenue Employees
        </button>
      </div>
      
      <div className="chart-container">
        {renderActiveChart()}
      </div>
    </div>
  );
};

export default Charts;
