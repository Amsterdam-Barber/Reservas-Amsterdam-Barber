/**
 * Aviso de cita nueva por Telegram, enviado desde Google Apps Script.
 *
 * El token del bot NO va en este archivo ni en la página web: se guarda en las
 * propiedades del script, que solo ve el dueño del proyecto de Apps Script.
 *
 * Instalación (en el proyecto de Apps Script que recibe las citas, el de WEB_APP_URL):
 *  1. Crea un archivo nuevo "telegram.gs" y pega este código.
 *  2. Configuración del proyecto (⚙️) → Propiedades del script → agrega:
 *       TELEGRAM_TOKEN   = el token NUEVO que te dé @BotFather
 *       TELEGRAM_CHAT_ID = el chat donde llegan los avisos
 *  3. Dentro de tu función doPost(e), después de leer los datos de la cita, agrega:
 *       notificarTelegram(datos);
 *     (donde "datos" es el objeto que ya obtienes con JSON.parse(e.postData.contents))
 *  4. Ejecuta una vez "probarTelegram" desde el editor y acepta los permisos.
 *  5. Implementar → Gestionar implementaciones → Editar → Versión nueva → Implementar.
 */
function notificarTelegram(datos) {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('TELEGRAM_TOKEN');
  var chatId = props.getProperty('TELEGRAM_CHAT_ID');
  if (!token || !chatId) {
    console.error('Faltan TELEGRAM_TOKEN o TELEGRAM_CHAT_ID en las propiedades del script');
    return;
  }

  var texto = '🚨 ¡NUEVA CITA REGISTRADA!\n\n' +
              '👤 Cliente: ' + datos.nombre + '\n' +
              '📱 Celular: ' + datos.celular + '\n' +
              '📅 Fecha: ' + datos.fecha + '\n' +
              '⏰ Hora: ' + datos.hora + '\n' +
              '✂️ Profesional: ' + datos.profesional + '\n' +
              '💈 Servicio: ' + datos.servicio + '\n' +
              '🆔 ID: ' + datos.idCita + '\n\n' +
              '👉 Revisa tu panel de Administrador para confirmar si el cliente no envía el WhatsApp.';

  try {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ chat_id: chatId, text: texto }),
      muteHttpExceptions: true
    });
  } catch (err) {
    // Un fallo de Telegram no debe impedir que se registre la cita
    console.error('Error enviando aviso por Telegram: ' + err);
  }
}

function probarTelegram() {
  notificarTelegram({
    idCita: 'PRUEBA', nombre: 'Cliente de prueba', celular: '3000000000',
    fecha: '2026-01-01', hora: '10:00 AM', profesional: 'Prueba', servicio: 'Prueba'
  });
}
