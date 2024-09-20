document.addEventListener('DOMContentLoaded', function() {
    const alerts = [
      { id: 'postura', name: 'Arrumar Postura' },
      { id: 'agua', name: 'Beber Água' },
      { id: 'levantar', name: 'Levante-se um pouco' },
      { id: 'alongar', name: 'Alongue-se um pouco' }
    ];
  
    function loadOptions() {
      chrome.storage.sync.get({
        intervals: { postura: 60, agua: 60, levantar: 60, alongar: 60 },
        enabled: { postura: true, agua: true, levantar: true, alongar: true },
        startTime: '09:00',
        endTime: '18:00'
      }, function(items) {
        alerts.forEach(alert => {
          document.getElementById(`interval-${alert.id}`).value = items.intervals[alert.id];
          document.getElementById(`enabled-${alert.id}`).checked = items.enabled[alert.id];
        });
        document.getElementById('startTime').value = items.startTime;
        document.getElementById('endTime').value = items.endTime;
      });
    }
  
    function saveOptions() {
      const intervals = {};
      const enabled = {};
      alerts.forEach(alert => {
        intervals[alert.id] = document.getElementById(`interval-${alert.id}`).value;
        enabled[alert.id] = document.getElementById(`enabled-${alert.id}`).checked;
      });
      const startTime = document.getElementById('startTime').value;
      const endTime = document.getElementById('endTime').value;
  
      chrome.storage.sync.set({
        intervals: intervals,
        enabled: enabled,
        startTime: startTime,
        endTime: endTime
      }, function() {
        alert('Configurações salvas!');
      });
    }
  
    // Gerar os campos dinamicamente
    const intervalsDiv = document.getElementById('intervals');
    const enabledDiv = document.getElementById('enabled');
    alerts.forEach(alert => {
      // Campos de intervalo
      const intervalLabel = document.createElement('label');
      intervalLabel.innerText = `${alert.name}: `;
      const intervalInput = document.createElement('input');
      intervalInput.type = 'number';
      intervalInput.min = '1';
      intervalInput.id = `interval-${alert.id}`;
      intervalLabel.appendChild(intervalInput);
      intervalsDiv.appendChild(intervalLabel);
  
      // Campos de habilitar/desabilitar
      const enabledLabel = document.createElement('label');
      const enabledInput = document.createElement('input');
      enabledInput.type = 'checkbox';
      enabledInput.id = `enabled-${alert.id}`;
      enabledLabel.appendChild(enabledInput);
      enabledLabel.appendChild(document.createTextNode(` ${alert.name}`));
      enabledDiv.appendChild(enabledLabel);
    });
  
    document.getElementById('save').addEventListener('click', saveOptions);
  
    loadOptions();
  });