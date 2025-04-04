document.addEventListener('DOMContentLoaded', () => {
    // Material Wave эффект для всех кнопок
    document.querySelectorAll('.wave-effect').forEach(button => {
      button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  
    // Кнопка скачивания PDF
    const downloadBtn = document.getElementById('download-pdf');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        // Вариант 1: Если есть готовый PDF
        // const link = document.createElement('a');
        // link.href = 'resume.pdf';
        // link.download = 'Моё_резюме.pdf';
        // link.click();
        
        // Вариант 2: Генерация PDF из HTML (требует html2pdf.js)
        const element = document.getElementById('resume-content');
        const opt = {
          margin: 10,
          filename: 'Моё_резюме.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Загрузка библиотеки динамически
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => {
          html2pdf().from(element).set(opt).save();
        };
        document.head.appendChild(script);
      });
    }
  
    // Сохранение данных в LocalStorage
    document.querySelectorAll('[contenteditable]').forEach(el => {
      el.addEventListener('input', () => {
        localStorage.setItem(`resume-${el.tagName}-${el.id || el.className}`, el.innerHTML);
      });
      
      // Восстановление данных
      const savedData = localStorage.getItem(`resume-${el.tagName}-${el.id || el.className}`);
      if (savedData) {
        el.innerHTML = savedData;
      }
    });

    const toggleEdit = document.createElement('button');
    toggleEdit.textContent = 'Редактировать';
    toggleEdit.className = 'wave-effect';
    toggleEdit.addEventListener('click', () => {
    const editableElements = document.querySelectorAll('[contenteditable]');
    const isEditable = editableElements[0].contentEditable === 'true';
    
    editableElements.forEach(el => {
        el.contentEditable = !isEditable;
    });
    
    toggleEdit.textContent = isEditable ? 'Редактировать' : 'Закончить редактирование';
    });
    document.querySelector('.resume-container').prepend(toggleEdit);
  });