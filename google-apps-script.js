// Google Apps Script para manejar las confirmaciones de cumpleaños
// Instrucciones:
// 1. Ve a https://script.google.com
// 2. Crea un nuevo proyecto
// 3. Reemplaza el código por defecto con este código
// 4. Guarda el proyecto
// 5. Despliega como aplicación web con permisos de "Cualquiera"
// 6. Copia la URL de la aplicación web y úsala en tu página

function doPost(e) {
  try {
    // Obtener los datos del POST
    const data = JSON.parse(e.postData.contents);
    
    // Obtener o crear la hoja de cálculo
    const spreadsheet = getOrCreateSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    
    // Si es la primera vez, agregar encabezados
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 7).setValues([
        ['Nombre', 'Asistencia', 'Acompañantes', 'Nombres Acompañantes', 'Mensaje', 'Fecha', 'Timestamp']
      ]);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    }
    
    // Preparar los datos para insertar
    const accompaniedNames = data.accompaniedNames ? data.accompaniedNames.join('; ') : '';
    const totalGuests = 1 + parseInt(data.accompanied || 0);
    const currentDate = new Date();
    
    const newRow = [
      data.name,
      data.attendance === 'yes' ? 'Sí' : 'No',
      data.accompanied || '0',
      accompaniedNames,
      data.message || 'Sin mensaje',
      currentDate.toLocaleDateString('es-ES'),
      currentDate.toISOString()
    ];
    
    // Agregar la nueva fila
    sheet.appendRow(newRow);
    
    // Retornar respuesta exitosa con headers CORS
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Confirmación guardada exitosamente'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    // Retornar error con headers CORS
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error al guardar: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

function doGet(e) {
  try {
    // Verificar si es una petición JSONP (con callback)
    if (e.parameter.callback && e.parameter.data) {
      // Procesar datos de confirmación
      const data = JSON.parse(e.parameter.data);
      
      // Obtener o crear la hoja de cálculo
      const spreadsheet = getOrCreateSpreadsheet();
      const sheet = spreadsheet.getActiveSheet();
      
      // Si es la primera vez, agregar encabezados
      if (sheet.getLastRow() === 0) {
        sheet.getRange(1, 1, 1, 7).setValues([
          ['Nombre', 'Asistencia', 'Acompañantes', 'Nombres Acompañantes', 'Mensaje', 'Fecha', 'Timestamp']
        ]);
        sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
      }
      
      // Preparar los datos para insertar
      const accompaniedNames = data.accompaniedNames ? data.accompaniedNames.join('; ') : '';
      const currentDate = new Date();
      
      const newRow = [
        data.name,
        data.attendance === 'yes' ? 'Sí' : 'No',
        data.accompanied || '0',
        accompaniedNames,
        data.message || 'Sin mensaje',
        currentDate.toLocaleDateString('es-ES'),
        currentDate.toISOString()
      ];
      
      // Agregar la nueva fila
      sheet.appendRow(newRow);
      
      // Retornar respuesta JSONP
      return ContentService
        .createTextOutput(e.parameter.callback + '(' + JSON.stringify({
          success: true,
          message: 'Confirmación guardada exitosamente'
        }) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    // Si no es JSONP, retornar datos normales
    const spreadsheet = getOrCreateSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    
    // Obtener todos los datos
    const data = sheet.getDataRange().getValues();
    
    // Convertir a formato JSON
    const headers = data[0];
    const rows = data.slice(1);
    
    const confirmations = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        if (header === 'Nombres Acompañantes' && row[index]) {
          obj.accompaniedNames = row[index].split('; ').filter(name => name.trim());
        } else {
          obj[header.toLowerCase().replace(/\s+/g, '')] = row[index];
        }
      });
      return obj;
    });
    
    // Retornar los datos
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        data: confirmations
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Si es JSONP, retornar error en formato JSONP
    if (e.parameter.callback) {
      return ContentService
        .createTextOutput(e.parameter.callback + '(' + JSON.stringify({
          success: false,
          message: 'Error al guardar: ' + error.toString()
        }) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    // Si no es JSONP, retornar error normal
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error al obtener datos: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSpreadsheet() {
  // Buscar una hoja existente con el nombre específico
  const files = DriveApp.getFilesByName('Confirmaciones Cumpleaños');
  
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  } else {
    // Crear nueva hoja de cálculo
    const spreadsheet = SpreadsheetApp.create('Confirmaciones Cumpleaños');
    return spreadsheet;
  }
}

// Función para manejar peticiones OPTIONS (preflight CORS)
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '3600'
    });
}

// Función para limpiar datos (opcional)
function clearAllData() {
  const spreadsheet = getOrCreateSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  sheet.clear();
  return 'Datos eliminados';
}
