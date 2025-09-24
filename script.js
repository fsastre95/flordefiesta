document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('confirmationForm');
    const successMessage = document.getElementById('successMessage');
    const accompaniedGroup = document.getElementById('accompaniedGroup');
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const submitBtn = document.querySelector('.submit-btn');
    const photoSlider = document.getElementById('photoSlider');
    const headerBg = document.querySelector('.header-bg');

    // Mostrar/ocultar campo de acompañantes según la respuesta
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Remover clase selected de todas las opciones
            document.querySelectorAll('.radio-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            // Agregar clase selected a la opción seleccionada
            this.closest('.radio-option').classList.add('selected');
            
            if (this.value === 'yes') {
                accompaniedGroup.style.display = 'block';
                accompaniedGroup.style.animation = 'slideDown 0.3s ease-out';
            } else {
                accompaniedGroup.style.display = 'none';
            }
        });
    });

    // Slider de fotos (agrega aquí tus URLs locales o remotas)
    const sliderImages = [
        'img/1.jpg',
        'img/2.jpg',
        'img/3.jpg',
        'img/5.jpg',
        'img/6.jpg',
        'img/7.jpg',
        'img/8.jpg',
        'img/9.jpg',
        'img/10.jpg',
        'img/11.jpg'
    ];

    if (photoSlider) {
        const slides = sliderImages.map((src, idx) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Foto ${idx + 1}`;
            img.className = 'photo-slide' + (idx === 0 ? ' active' : '');
            photoSlider.appendChild(img);
            return img;
        });

        let currentSlideIndex = 0;
        setInterval(() => {
            const previous = slides[currentSlideIndex];
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            const next = slides[currentSlideIndex];
            if (previous) previous.classList.remove('active');
            if (next) next.classList.add('active');
        }, 2000);
    }

    // Slider de fondo en el header (mismas imágenes)
    if (headerBg) {
        const bgSlides = sliderImages.map((src, idx) => {
            const div = document.createElement('div');
            div.className = 'bg-slide' + (idx === 0 ? ' active' : '');
            div.style.backgroundImage = `url(${src})`;
            div.dataset.src = src;
            headerBg.appendChild(div);
            return div;
        });

        let currentBgIndex = 0;
        setInterval(() => {
            const prev = bgSlides[currentBgIndex];
            currentBgIndex = (currentBgIndex + 1) % bgSlides.length;
            const next = bgSlides[currentBgIndex];
            if (prev) prev.classList.remove('active');
            if (next) next.classList.add('active');
        }, 2000);
    }

    // Validación en tiempo real
    const nameInput = document.getElementById('name');
    const accompaniedSelect = document.getElementById('accompanied');
    const accompaniedNamesContainer = document.getElementById('accompaniedNamesContainer');
    const accompaniedNamesGroup = document.getElementById('accompaniedNamesGroup');

    // Validar nombre
    nameInput.addEventListener('input', function() {
        const fullName = this.value.trim();
        const hasTwoWords = fullName.split(' ').filter(word => word.length > 0).length >= 2;
        validateField(this, hasTwoWords && fullName.length >= 3, 'Ingresa tu nombre completo (nombre y apellido)');
    });

    // Manejar cambio en número de acompañantes
    accompaniedSelect.addEventListener('change', function() {
        const count = parseInt(this.value);
        if (count > 0) {
            accompaniedNamesGroup.style.display = 'block';
            generateAccompaniedFields(count);
        } else {
            accompaniedNamesGroup.style.display = 'none';
        }
    });

    function generateAccompaniedFields(count) {
        accompaniedNamesContainer.innerHTML = '';
        for (let i = 1; i <= count; i++) {
            const fieldDiv = document.createElement('div');
            fieldDiv.className = 'accompanied-field';
            fieldDiv.innerHTML = `
                <input type="text" 
                       name="accompaniedName${i}" 
                       placeholder="Nombre completo de la persona ${i}"
                       required>
            `;
            accompaniedNamesContainer.appendChild(fieldDiv);
        }
    }

    function validateField(field, isValid, errorMessage) {
        const errorElement = field.parentNode.querySelector('.error-message');
        
        if (isValid) {
            field.style.borderColor = '#28a745';
            if (errorElement) {
                errorElement.remove();
            }
        } else {
            field.style.borderColor = '#dc3545';
            if (!errorElement) {
                const error = document.createElement('div');
                error.className = 'error-message';
                error.style.color = '#dc3545';
                error.style.fontSize = '0.8rem';
                error.style.marginTop = '5px';
                error.textContent = errorMessage;
                field.parentNode.appendChild(error);
            } else {
                errorElement.textContent = errorMessage;
            }
        }
    }

    function clearFieldError(field) {
        field.style.borderColor = '#e1e5e9';
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Manejar envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Validar todos los campos
        const name = nameInput.value.trim();
        const attendance = document.querySelector('input[name="attendance"]:checked');
        const accompanied = document.getElementById('accompanied').value;
        const message = document.getElementById('message').value.trim();

        // Validaciones
        let isValid = true;

        // Validar nombre completo
        const nameWords = name.split(' ').filter(word => word.length > 0);
        if (nameWords.length < 2 || name.length < 3) {
            validateField(nameInput, false, 'Ingresa tu nombre completo (nombre y apellido)');
            isValid = false;
        }

        if (!attendance) {
            alert('Por favor selecciona si vas a asistir o no');
            isValid = false;
        }

        // Validar nombres de acompañantes si aplica
        if (attendance && attendance.value === 'yes' && parseInt(accompanied) > 0) {
            const accompaniedNames = [];
            for (let i = 1; i <= parseInt(accompanied); i++) {
                const nameField = document.querySelector(`input[name="accompaniedName${i}"]`);
                if (nameField) {
                    const accompaniedName = nameField.value.trim();
                    if (accompaniedName.length < 3) {
                        nameField.style.borderColor = '#dc3545';
                        isValid = false;
                    } else {
                        nameField.style.borderColor = '#28a745';
                        accompaniedNames.push(accompaniedName);
                    }
                }
            }
            
            if (!isValid) {
                alert('Por favor completa todos los nombres de tus acompañantes');
                return;
            }
        }

        if (!isValid) {
            return;
        }

        // Mostrar loading
        form.classList.add('loading');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        // Enviar datos a Google Sheets
        sendToGoogleSheets();
    });

    // URL de tu Google Apps Script (REEMPLAZA CON TU URL)
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7Ts7DPLdlzb-6WhQ-5JulQqfpMvN86gix7S7orQBM2pNO2M6vyheGDuskLuZnAv1C4g/exec';
    
    async function sendToGoogleSheets() {
        try {
            // Recopilar datos del formulario
            const name = nameInput.value.trim();
            const attendance = document.querySelector('input[name="attendance"]:checked');
            const accompanied = document.getElementById('accompanied').value;
            const message = document.getElementById('message').value.trim();

            // Recopilar nombres de acompañantes
            const accompaniedNames = [];
            if (attendance.value === 'yes' && parseInt(accompanied) > 0) {
                for (let i = 1; i <= parseInt(accompanied); i++) {
                    const nameField = document.querySelector(`input[name="accompaniedName${i}"]`);
                    if (nameField && nameField.value.trim()) {
                        accompaniedNames.push(nameField.value.trim());
                    }
                }
            }

            // Crear objeto con los datos
            const formData = {
                name: name,
                attendance: attendance.value,
                accompanied: attendance.value === 'yes' ? accompanied : '0',
                accompaniedNames: accompaniedNames,
                message: message || 'Sin mensaje',
                timestamp: new Date().toISOString()
            };

            // Enviar a Google Sheets usando JSONP para evitar CORS
            const script = document.createElement('script');
            const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
            
            // Crear función de callback temporal
            window[callbackName] = function(response) {
                delete window[callbackName];
                document.body.removeChild(script);
                
                if (response.success) {
                    // Mostrar mensaje de éxito
                    form.style.display = 'none';
                    // Ajustar texto según asistencia
                    const successTitle = successMessage.querySelector('h3');
                    const successParagraph = successMessage.querySelector('p');
                    if (successParagraph) {
                        if (attendance && attendance.value === 'no') {
                            successParagraph.textContent = '«Gracias por avisar, nos comeremos tu parte 🧁»';
                        } else {
                            successParagraph.textContent = 'Tu respuesta ha sido registrada';
                        }
                    }
                    if (successTitle) {
                        if (attendance && attendance.value === 'no') {
                            successTitle.textContent = 'Te vamos a extrañar!';
                        } else {
                            successTitle.textContent = '¡Nos vemos en la fiesta! 🎊';
                        }
                    }
                    successMessage.style.display = 'block';
                    successMessage.style.animation = 'slideUp 0.6s ease-out';
                } else {
                    throw new Error(response.message);
                }
            };
            
            // Crear URL con callback
            const url = GOOGLE_SCRIPT_URL + '?callback=' + callbackName + '&data=' + encodeURIComponent(JSON.stringify(formData));
            script.src = url;
            document.body.appendChild(script);
            
            return; // Salir de la función aquí
            
        } catch (error) {
            console.error('Error al enviar datos:', error);
            
            // Mostrar error y permitir reintentar
            form.classList.remove('loading');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Confirmar Asistencia';
            
            alert('Error al enviar la confirmación. Por favor, inténtalo de nuevo.');
        }
    }

    // Función para obtener todas las confirmaciones desde Google Sheets
    window.getConfirmations = async function() {
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL);
            const result = await response.json();
            
            if (result.success) {
                console.log('Todas las confirmaciones:', result.data);
                return result.data;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error al obtener datos:', error);
            return [];
        }
    };

    // Función para exportar datos como JSON
    window.exportConfirmations = async function() {
        const data = await getConfirmations();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'confirmaciones-cumpleanos.json';
        link.click();
        URL.revokeObjectURL(url);
    };
});

// Agregar estilos para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .error-message {
        color: #dc3545;
        font-size: 0.8rem;
        margin-top: 5px;
        animation: slideDown 0.3s ease-out;
    }
`;
document.head.appendChild(style);
