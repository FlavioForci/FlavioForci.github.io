// Modal öffnen
function openModal(title, description, image) {
    document.getElementById('projectModal').style.display = 'block';
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDescription').innerText = description;
    document.getElementById('modalImage').src = image;
  }
  
  // Modal schließen
  function closeModal() {
    document.getElementById('projectModal').style.display = 'none';
  }
  
  // Wenn der Benutzer außerhalb des Modals klickt, wird es geschlossen
  window.onclick = function(event) {
    if (event.target == document.getElementById('projectModal')) {
      closeModal();
    }
  }
  


  <script>
  // Funktion zum Umschalten des Dark Modes
  const toggleDarkMode = () => {
    // Wechsle den Dark Mode durch Hinzufügen/Entfernen der 'dark-mode' Klasse im Body
    document.body.classList.toggle('dark-mode');
    document.querySelector('header').classList.toggle('dark-mode');
    document.querySelector('footer').classList.toggle('dark-mode');
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => card.classList.toggle('dark-mode'));
    const formElements = document.querySelectorAll('form input, form textarea, form button');
    formElements.forEach(element => element.classList.toggle('dark-mode'));
    const modal = document.querySelector('.modal');
    if (modal) modal.classList.toggle('dark-mode');
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) modalContent.classList.toggle('dark-mode');
    
    // Speichere den Dark Mode-Status im localStorage
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
  }

  // Prüfe, ob der Benutzer Dark Mode zuvor aktiviert hat
  window.addEventListener('load', () => {
    const darkModeEnabled = localStorage.getItem('dark-mode') === 'true';
    if (darkModeEnabled) {
      document.body.classList.add('dark-mode');
      document.querySelector('header').classList.add('dark-mode');
      document.querySelector('footer').classList.add('dark-mode');
      const projectCards = document.querySelectorAll('.project-card');
      projectCards.forEach(card => card.classList.add('dark-mode'));
      const formElements = document.querySelectorAll('form input, form textarea, form button');
      formElements.forEach(element => element.classList.add('dark-mode'));
      const modal = document.querySelector('.modal');
      if (modal) modal.classList.add('dark-mode');
      const modalContent = document.querySelector('.modal-content');
      if (modalContent) modalContent.classList.add('dark-mode');
    }
  });
</script>


window.addEventListener('load', function() {
  document.body.classList.add('loaded');
});


// Intersection Observer für die Animation beim Scrollen
const fadeInElements = document.querySelectorAll('.fade-in-on-scroll');

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

fadeInElements.forEach(element => {
  observer.observe(element);
});

