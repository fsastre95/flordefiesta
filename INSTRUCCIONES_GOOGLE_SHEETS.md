# 📋 Instrucciones para conectar con Google Sheets

## 🚀 Configuración paso a paso

### 1. Crear el Google Apps Script

1. **Ve a [Google Apps Script](https://script.google.com)**
2. **Haz clic en "Nuevo proyecto"**
3. **Reemplaza todo el código** con el contenido del archivo `google-apps-script.js` (versión actualizada con CORS)
4. **Guarda el proyecto** (Ctrl+S) y dale un nombre como "flordefiesta"

### 2. Configurar permisos

1. **Haz clic en "Desplegar" → "Nueva implementación"**
2. **Tipo:** Aplicación web
3. **Descripción:** "API para confirmaciones de cumpleaños"
4. **Ejecutar como:** Yo (tu cuenta)
5. **Quién tiene acceso:** Cualquiera
6. **Haz clic en "Desplegar"**

### 2.1. IMPORTANTE - Actualizar el script existente

Si ya tienes un script desplegado:
1. **Ve a tu proyecto en Google Apps Script**
2. **Reemplaza el código** con la nueva versión (con headers CORS)
3. **Haz clic en "Desplegar" → "Administrar implementaciones"**
4. **Haz clic en el ícono de editar (lápiz)**
5. **Cambia la versión a "Nueva"**
6. **Haz clic en "Desplegar"**

### 3. Obtener la URL

1. **Copia la URL de la aplicación web** que aparece después del despliegue
2. **Pégala en los archivos:**
   - En `script.js` línea 152: reemplaza `TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI`
   - En `admin.html` línea 259: reemplaza `TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI`

### 4. Verificar que funciona

1. **Abre `index.html`** y prueba enviar una confirmación
2. **Ve a [Google Sheets](https://sheets.google.com)**
3. **Busca la hoja "Confirmaciones Cumpleaños"** (se crea automáticamente)
4. **Verifica que aparezcan los datos**

## 📊 Estructura de la hoja de cálculo

La hoja tendrá estas columnas:
- **Nombre:** Nombre completo del invitado
- **Asistencia:** Sí/No
- **Acompañantes:** Número de acompañantes
- **Nombres Acompañantes:** Lista de nombres separados por punto y coma
- **Mensaje:** Mensaje especial del invitado
- **Fecha:** Fecha de confirmación
- **Timestamp:** Marca de tiempo completa

## 🔧 Solución de problemas

### Error de CORS
- Asegúrate de que el despliegue sea "Cualquiera" puede acceder
- Verifica que la URL esté correcta

### No aparecen datos
- Revisa la consola del navegador (F12) para errores
- Verifica que la URL del script esté bien configurada

### Permisos
- La primera vez, Google pedirá permisos para acceder a Google Sheets
- Acepta todos los permisos necesarios

## 📱 Uso

1. **Comparte `index.html`** con tus invitados
2. **Abre `admin.html`** para ver todas las confirmaciones
3. **Los datos se guardan automáticamente** en Google Sheets
4. **Puedes exportar** los datos desde la página de administración

## 🎉 ¡Listo!

Ahora todas las confirmaciones se guardarán automáticamente en tu Google Sheet y podrás verlas desde cualquier lugar.
