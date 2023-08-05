// Carrega os dados do arquivo JSON usando a API Fetch
fetch('sales.json')
  .then(response => response.json())
  .then(data => {
    // Aqui, "data" conterá a lista de objetos com os dados das vendas por província

    // Calcular o total de vendas, total de usuários e receita total
    const totalSales = data.reduce((total, item) => total + item.sales, 0);
    const totalUsers = data.reduce((total, item) => total + item.amount, 0);
    const totalRevenue = data.reduce((total, item) => total + item.sales, 0);

    // Atualizar os valores das estatísticas no dashboard
    document.getElementById("totalSales").textContent = totalSales;
    document.getElementById("totalUsers").textContent = totalUsers;
    document.getElementById("totalRevenue").textContent = totalRevenue.toFixed(2);

    // Criar um gráfico de barras usando Chart.js com os dados do arquivo JSON
    criarGrafico(data); // Chamar a função para criar o gráfico de barras
  })
  .catch(error => {
    console.error("Erro ao carregar o arquivo JSON:", error);
  });

fetch('accumulated.json')
  .then(response => response.json())
  .then(data => {
    // Aqui, "data" conterá a lista de objetos com os dados do acumulado para o ano de 2023

    // Criar um novo gráfico de linhas com os dados do acumulado para o ano de 2023
    criarGraficoAcumulado(data); // Chamar a função para criar o gráfico de linhas
  })
  .catch(error => {
    console.error("Erro ao carregar o arquivo JSON:", error);
  });

let chartInstance = null; // Variável para armazenar a instância do gráfico de barras
let chartInstanceAcumulado = null; // Variável para armazenar a instância do gráfico de linhas

function criarGrafico(data) {
  const ctx = document.getElementById("chart").getContext("2d");

  // Se já existir uma instância de gráfico, destrua-a antes de criar um novo
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map(item => item.province),
      datasets: [{
        label: "Vendas por Estado",
        data: data.map(item => item.sales),
        backgroundColor: "rgba(139, 218, 188,1)",
        borderColor: "rgba(35, 53, 101, 1)",
        borderWidth: 1.3
      }]
    },
    options: {
        animation:{
            duration: 1800,
            easing:'easeInQuint'
        },
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function criarGraficoAcumulado(data) {
  const ctx = document.getElementById("chart3").getContext("2d");

  // Se já existir uma instância de gráfico, apague antes de criar um novo , pois o chart nao permite dois graficos sumultaneos
  if (chartInstanceAcumulado) {
    chartInstanceAcumulado.destroy();
  }

  chartInstanceAcumulado = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map(item => item.label),
      datasets: [{
        label: "Acumulado no Ano",
        data:  data.map(item => item.amount),
        borderColor: "rgba(35, 53, 101, 1)",
        borderWidth: 3.5,
        fill: true
      }]
    },
    options: {
        animation:{
            duration: 1800,
            easing:'easeInQuint'
        },
   
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function atualizarGrafico(url, tipo) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Aqui, "data" conterá a lista de objetos com os dados

      // Chamar a função propria para criar ou atualizar o gráfico com os novos dados
      if (tipo === "vendas") {
        criarGrafico(data);
      } else if (tipo === "acumulado") {
        criarGraficoAcumulado(data);
      }
    })
    //Tramento de Erro
    .catch(error => {
      console.error("Erro ao carregar o arquivo JSON:", error);
    });
}

// Chamar a função atualizarGrafico com a URL do arquivo "sales.json" para criar o gráfico inicial de vendas
atualizarGrafico('sales.json', 'vendas');
atualizarGrafico('accumulated.json','acumulado');
