import emailjs from '@emailjs/browser';

// Initialize EmailJS
// NOTE: Replace these with your actual EmailJS credentials
// Get them from: https://dashboard.emailjs.com/
const SERVICE_ID = 'service_bxmi5qu';
const TEMPLATE_ID = 'template_dspvm68';
const PUBLIC_KEY = 'RdW7-tVhakUJT1V-U';

// Check if PUBLIC_KEY is set
if (PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
  console.warn('⚠️ WARNING: EmailJS PUBLIC_KEY is not set! Please update src/main.js with your actual public key from https://dashboard.emailjs.com/');
}

// Initialize EmailJS with your public key
emailjs.init(PUBLIC_KEY);
console.log('EmailJS initialized with SERVICE_ID:', SERVICE_ID);

// Function to submit feedback and send email
export function submitFeedback() {
  try {
    console.log('✓ submitFeedback function called');
    alert('Button clicked! Processing your feedback...');
    
    const name = document.getElementById('name')?.value?.trim();
    const email = document.getElementById('email')?.value?.trim();
    const category = document.getElementById('category')?.value;
    const rating = document.getElementById('rating')?.value;
    const message = document.getElementById('message')?.value?.trim();

    console.log('Form data:', { name, email, category, rating, message });

    // Validation
    if (!name || !email || !category || !rating || !message) {
      console.warn('Form validation failed - missing fields');
      let missingFields = [];
      if (!name) missingFields.push('Name');
      if (!email) missingFields.push('Email');
      if (!category) missingFields.push('Category');
      if (!rating || rating === '0') missingFields.push('Rating');
      if (!message) missingFields.push('Message');
      
      alert('❌ Please fill in all required fields:\n\n' + missingFields.join('\n'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('❌ Please enter a valid email address');
      return;
    }

    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    console.log('Button state changed to: Sending...');
    alert('✓ Form is valid - sending email now...');

    // Prepare email parameters
    const templateParams = {
      to_email: 'info@northaesthetic.com',
      from_name: name,
      from_email: email,
      category: category,
      rating: rating,
      message: message,
      reply_to: email
    };

    console.log('Sending with params:', templateParams);

    // Send email using EmailJS
    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams)
      .then((response) => {
        console.log('✓ Email sent successfully:', response);
        alert('✓ SUCCESS! Your feedback has been sent!\n\nThank you for contacting us.');

        // Show success message
        document.getElementById('successMessage').classList.add('show');

        // Reset form
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('category').value = '';
        document.getElementById('rating').value = '0';
        document.querySelectorAll('.star').forEach((s) => s.classList.remove('active'));
        document.getElementById('message').value = '';

        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Hide success message after 2 seconds, then redirect to home
        setTimeout(() => {
          document.getElementById('successMessage').classList.remove('show');
          window.location.href = 'index.html';
        }, 2000);
      })
      .catch((error) => {
        console.error('❌ Error sending email:', error);
        console.error('Error type:', error.type);
        console.error('Error status:', error.status);
        console.error('Full error:', JSON.stringify(error));
        
        let errorMsg = 'Failed to send feedback.';
        if (error.message) {
          errorMsg += '\n\nError: ' + error.message;
        }
        errorMsg += '\n\nPlease try again or contact us directly at info@northaesthetic.com';
        
        alert('❌ ' + errorMsg);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
  } catch (err) {
    console.error('❌ FATAL ERROR in submitFeedback:', err);
    alert('❌ FATAL ERROR: ' + err.message + '\n\nPlease check the browser console (F12) for more details.');
  }
}

// Function to handle feedback submission with confirmation
export function handleFeedbackSubmission() {
  const confirmed = confirm('Are you finished with your feedback?\n\nClick OK to send your feedback, or Cancel to continue filling it out.');
  
  if (confirmed) {
    submitFeedback();
  } else {
    // User chose to continue filling - do nothing, stay on page
    console.log('User chose to continue filling feedback');
  }
}

// Make submitFeedback and handleFeedbackSubmission globally accessible
window.submitFeedback = submitFeedback;
window.handleFeedbackSubmission = handleFeedbackSubmission;
