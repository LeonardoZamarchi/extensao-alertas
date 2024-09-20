// Definir os tipos de alertas
const alerts = [
    { id: 'postura', title: 'Arrumar Postura', message: 'Lembre-se de manter a postura correta!', iconUrl: 'images/postura.png' },
    { id: 'agua', title: 'Beber Água', message: 'Hora de se hidratar. Beba um copo de água!', iconUrl: 'images/agua.png' },
    { id: 'levantar', title: 'Levante-se um pouco', message: 'Dê uma volta para esticar as pernas.', iconUrl: 'images/levantar.png' },
    { id: 'alongar', title: 'Alongue-se um pouco', message: 'Faça alguns alongamentos rápidos.', iconUrl: 'images/alongar.png' }
  ];
  
  // Carregar as configurações iniciais
  function loadSettings(callback) {
    chrome.storage.sync.get({
      intervals: { postura: 60, agua: 60, levantar: 60, alongar: 60 },
      enabled: { postura: true, agua: true, levantar: true, alongar: true },
      startTime: '09:00',
      endTime: '18:00'
    }, callback);
  }
  
  // Agendar os alarmes com base nas configurações
  function scheduleAlarms() {
    loadSettings(settings => {
      chrome.alarms.clearAll(() => {
        const now = new Date();
        const [startHour, startMinute] = settings.startTime.split(':').map(Number);
        const [endHour, endMinute] = settings.endTime.split(':').map(Number);
        const startTime = new Date(now.setHours(startHour, startMinute, 0, 0));
        const endTime = new Date(now.setHours(endHour, endMinute, 0, 0));
  
        alerts.forEach(alert => {
          if (settings.enabled[alert.id]) {
            chrome.alarms.create(alert.id, { periodInMinutes: parseFloat(settings.intervals[alert.id]) });
          }
        });
      });
    });
  }
  
  // Listener para alarmes
  chrome.alarms.onAlarm.addListener(alarm => {
    loadSettings(settings => {
      const now = new Date();
      const [startHour, startMinute] = settings.startTime.split(':').map(Number);
      const [endHour, endMinute] = settings.endTime.split(':').map(Number);
      const startTime = new Date(now.setHours(startHour, startMinute, 0, 0));
      const endTime = new Date(now.setHours(endHour, endMinute, 0, 0));
  
      if (now >= startTime && now <= endTime) {
        const alert = alerts.find(a => a.id === alarm.name);
        if (alert) {
          chrome.notifications.create(alarm.name, {
            type: 'basic',
            iconUrl: alert.iconUrl,
            title: alert.title,
            message: alert.message
          });
        }
      }
    });
  });
  
  // Atualizar os alarmes quando a extensão é instalada ou atualizada
  chrome.runtime.onInstalled.addListener(scheduleAlarms);
  
  // Atualizar os alarmes quando as configurações mudam
  chrome.storage.onChanged.addListener(scheduleAlarms);