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
  