/* Client-side draft preparation only. No network submission or local storage. */
(() => {
    const form = document.getElementById('leadForm');
    const status = document.getElementById('formStatus');
    const drafts = document.getElementById('inquiryDrafts');
    const whatsapp = document.getElementById('whatsappDraft');
    const email = document.getElementById('emailDraft');
    if (!form || !status || !drafts || !whatsapp || !email) return;

    function invalidate() {
        drafts.hidden = true;
        whatsapp.removeAttribute('href');
        email.removeAttribute('href');
        status.textContent = 'Prepare a draft, then choose WhatsApp or email. Nothing is sent or saved by this website. Please don’t include medical records.';
    }

    form.addEventListener('input', invalidate);
    form.addEventListener('change', invalidate);
    form.addEventListener('reset', invalidate);
    form.addEventListener('submit', event => {
        event.preventDefault();
        invalidate();
        if (!form.reportValidity()) return;
        const values = new FormData(form);
        const value = name => String(values.get(name) || '').trim();
        if (['name', 'phone', 'email', 'interest', 'message'].some(name => !value(name))) {
            status.textContent = 'Please complete every field with more than spaces.';
            return;
        }
        const message = [
            'Inquiry for Dr. Nihar Thakkar',
            'Name: ' + value('name'),
            'Phone: ' + value('phone'),
            'Email: ' + value('email'),
            'Interested in: ' + value('interest'),
            'Message: ' + value('message')
        ].join('\n');
        // Encode each URI component once; user text never becomes markup.
        whatsapp.href = 'https://wa.me/918591568308?text=' + encodeURIComponent(message);
        email.href = 'mailto:drniharthakkar312@gmail.com?subject=' +
            encodeURIComponent('Website inquiry — ' + value('interest')) + '&body=' + encodeURIComponent(message);
        drafts.hidden = false;
        status.textContent = 'Draft prepared—not sent. Choose an app below, review your message and press Send there.';
    });

    form.hidden = false;
})();