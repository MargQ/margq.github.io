document.addEventListener('DOMContentLoaded', () => {
  // Инициализация Material Wave эффекта
  initRippleEffect();
  
  // Настройка кнопки скачивания PDF
  setupPDFDownload();
  
  // Настройка режима редактирования
  setupEditMode();
  
  // Восстановление сохраненных данных
  restoreSavedData();
});

function initRippleEffect() {
  document.querySelectorAll('.wave-effect').forEach(button => {
    button.addEventListener('click', function(e) {
      createRipple(e, this);
    });
  });
}

function createRipple(event, element) {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

function setupPDFDownload() {
  const downloadBtn = document.getElementById('download-pdf');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', generatePDF);
  }
}

async function generatePDF() {
  try {
    // Проверяем, загружена ли уже библиотека
    if (typeof html2pdf === 'undefined') {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
    }
    
    const element = document.getElementById('resume-content');
    const opt = {
      margin: 10,
      filename: 'Моё_резюме.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        logging: true,
        useCORS: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };
    
    // Создаем копию для PDF
    const clone = element.cloneNode(true);
    document.body.appendChild(clone);
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    
    // Генерируем PDF
    await html2pdf().set(opt).from(clone).save();
    
    // Удаляем копию
    document.body.removeChild(clone);
    
  } catch (error) {
    console.error('Ошибка при генерации PDF:', error);
    alert('Произошла ошибка при создании PDF. Пожалуйста, попробуйте позже.');
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function setupEditMode() {
  const toggleEdit = document.createElement('button');
  toggleEdit.textContent = 'Редактировать';
  toggleEdit.className = 'wave-effect';
  toggleEdit.style.margin = '0 auto 20px';
  toggleEdit.style.display = 'block';
  
  document.querySelector('.resume-container').prepend(toggleEdit);

  toggleEdit.addEventListener('click', () => {
    const editableElements = document.querySelectorAll('[contenteditable]');
    const isEditable = editableElements[0].contentEditable === 'true';
    
    editableElements.forEach(el => {
      el.contentEditable = !isEditable;
      el.style.border = isEditable ? 'none' : '1px dashed #646cff';
      el.style.padding = isEditable ? '0' : '10px';
    });
    
    toggleEdit.textContent = isEditable ? 'Редактировать' : 'Сохранить';
  });
}

function restoreSavedData() {
  document.querySelectorAll('[contenteditable]').forEach(el => {
    const savedData = localStorage.getItem(`resume-${el.tagName}-${el.id || el.className}`);
    if (savedData) {
      el.innerHTML = savedData;
    }
    
    el.addEventListener('input', () => {
      localStorage.setItem(`resume-${el.tagName}-${el.id || el.className}`, el.innerHTML);
    });
  });
}