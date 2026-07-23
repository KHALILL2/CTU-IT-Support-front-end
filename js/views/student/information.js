export async function render(container) {
  container.innerHTML = `
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-icon primary"><i class="fas fa-calendar-check"></i></div>
        <div class="stat-card-info"><h3 id="stat-att">24</h3><p data-i18n="info.total.att">Total Attendance</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon success"><i class="fas fa-check-double"></i></div>
        <div class="stat-card-info"><h3 id="stat-completed">12</h3><p data-i18n="info.completed">Completed Tasks</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon warning"><i class="fas fa-hourglass-half"></i></div>
        <div class="stat-card-info"><h3 id="stat-pending">3</h3><p data-i18n="info.pending">Pending Tasks</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon teal"><i class="fas fa-percentage"></i></div>
        <div class="stat-card-info"><h3 id="stat-rate">80%</h3><p data-i18n="info.rate">Completion Rate</p></div>
      </div>
    </div>

    <!-- Charts -->
    <div class="charts-grid" style="margin-top: 1.5rem">
      <div class="chart-card reveal">
        <h4 data-i18n="info.chart.tasks">Task Completion</h4>
        <canvas id="chart-tasks"></canvas>
      </div>
      <div class="chart-card reveal">
        <h4 data-i18n="info.chart.attendance">Weekly Attendance</h4>
        <canvas id="chart-attendance"></canvas>
      </div>
    </div>
    <div class="charts-grid" style="margin-top: 1.5rem">
      <div class="chart-card reveal" style="grid-column: 1 / -1">
        <h4 data-i18n="info.chart.activity">Activity Timeline</h4>
        <canvas id="chart-activity"></canvas>
      </div>
    </div>
  `;

  // We must ensure Chart is loaded globally via CDN before initializing
  if (typeof Chart === 'undefined') {
    container.innerHTML += `<div class="alert alert-warning" style="margin-top:1.5rem; color:var(--warning-600)">Chart.js failed to load. Please check your internet connection.</div>`;
    return () => {};
  }

  const charts = [];
  const getColors = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      text: isDark ? '#D1D5DB' : '#4B5563',
      grid: isDark ? '#374151' : '#E5E7EB',
      bg: isDark ? '#1F2937' : '#FFFFFF'
    };
  };

  const renderCharts = () => {
    // Clear old charts if re-rendering due to theme change
    charts.forEach(c => c.destroy());
    charts.length = 0;

    const colors = getColors();
    Chart.defaults.color = colors.text;
    const t = window.t || ((key) => key);

    // Doughnut
    const ctxTasks = container.querySelector('#chart-tasks');
    if (ctxTasks) {
      charts.push(new Chart(ctxTasks, {
        type: 'doughnut',
        data: {
          labels: [t('info.completed'), t('info.pending')],
          datasets: [{
            data: [12, 3],
            backgroundColor: ['#22C55E', '#F59E0B'],
            borderWidth: 0,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          cutout: '70%',
          plugins: {
            legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyleWidth: 12 } }
          }
        }
      }));
    }

    // Bar
    const ctxAtt = container.querySelector('#chart-attendance');
    if (ctxAtt) {
      charts.push(new Chart(ctxAtt, {
        type: 'bar',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3'],
          datasets: [{
            label: t('att.days'),
            data: [4, 5, 3],
            backgroundColor: 'rgba(99, 102, 241, 0.7)',
            borderRadius: 8,
            borderSkipped: false,
            barThickness: 36
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: colors.grid }, ticks: { stepSize: 1 } },
            x: { grid: { display: false } }
          }
        }
      }));
    }

    // Line
    const ctxAct = container.querySelector('#chart-activity');
    if (ctxAct) {
      charts.push(new Chart(ctxAct, {
        type: 'line',
        data: {
          labels: ['Jul 1', 'Jul 3', 'Jul 6', 'Jul 8', 'Jul 10', 'Jul 13', 'Jul 15'],
          datasets: [
            {
              label: t('info.completed'),
              data: [1, 2, 4, 5, 6, 8, 12],
              borderColor: '#22C55E',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6
            },
            {
              label: t('att.days'),
              data: [1, 2, 3, 4, 5, 6, 7],
              borderColor: '#6366F1',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, pointStyleWidth: 12 } }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: colors.grid } },
            x: { grid: { display: false } }
          }
        }
      }));
    }
  };

  renderCharts();
  
  const onThemeChange = () => renderCharts();
  const onLangChange = () => renderCharts();
  
  window.addEventListener('themeChanged', onThemeChange);
  window.addEventListener('languageChanged', onLangChange);

  // Cleanup function returned for the router
  return () => {
    charts.forEach(c => c.destroy());
    window.removeEventListener('themeChanged', onThemeChange);
    window.removeEventListener('languageChanged', onLangChange);
  };
}
