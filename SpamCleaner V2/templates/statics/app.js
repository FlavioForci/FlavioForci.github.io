document.addEventListener('DOMContentLoaded', () => {
    const emailForm = document.getElementById('emailForm');
    const emailList = document.getElementById('emailList');
    const deleteButton = document.getElementById('deleteButton');
    const blockButton = document.getElementById('blockButton');

    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const senderEmail = document.getElementById('sender_email').value;
        
        const response = await fetch('/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `sender_email=${senderEmail}`
        });
        
        const emails = await response.json();
        emailList.innerHTML = '';
        
        emails.forEach(email => {
            const emailItem = document.createElement('div');
            emailItem.className = 'email-item';
            emailItem.innerHTML = `
                <label>
                    <input type="checkbox" class="email-checkbox" data-id="${email.id}">
                    <strong>${email.subject}</strong> - ${email.snippet}
                </label>
            `;
            emailList.appendChild(emailItem);
        });

        updateButtons();
    });

    function updateButtons() {
        const checkboxes = document.querySelectorAll('.email-checkbox');
        let selected = Array.from(checkboxes).some(checkbox => checkbox.checked);
        deleteButton.disabled = !selected;
        blockButton.disabled = !selected;
    }

    emailList.addEventListener('change', updateButtons);

    deleteButton.addEventListener('click', async () => {
        const selectedEmails = Array.from(document.querySelectorAll('.email-checkbox:checked')).map(cb => cb.getAttribute('data-id'));

        await fetch('/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email_ids: selectedEmails })
        });

        alert('Selected emails deleted!');
        location.reload();
    });

    blockButton.addEventListener('click', async () => {
        const senderEmail = document.getElementById('sender_email').value;

        await fetch('/block', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender_email: senderEmail })
        });

        alert('Sender blocked!');
        location.reload();
    });
});
