import emailjs from '@emailjs/browser';

// Initialize EmailJS
// NOTE: Replace these with your actual EmailJS credentials
// Get them from: https://dashboard.emailjs.com/
const SERVICE_ID = 'service_northaesthetic';
const TEMPLATE_ID = 'template_feedback';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

// Initialize EmailJS with your public key
emailjs.init(PUBLIC_KEY);

// Function to submit feedback and send email
export function submitFeedback() {
  const name = document.getElementById('name')?.value?.trim();
  const email = document.getElementById('email')?.value?.trim();
  const category = document.getElementById('category')?.value;
  const rating = document.getElementById('rating')?.value;
  const message = document.getElementById('message')?.value?.trim();

  // Validation
  if (!name || !email || !category || !rating || !message) {
    alert('Please fill in all required fields');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address');
    return;
  }

  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

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

  // Send email using EmailJS
  emailjs
    .send(SERVICE_ID, TEMPLATE_ID, templateParams)
    .then((response) => {
      console.log('Email sent successfully:', response);

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

      // Hide success message after 5 seconds
      setTimeout(() => {
        document.getElementById('successMessage').classList.remove('show');
      }, 5000);
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      alert(
        'Failed to send feedback. Please try again or contact us directly at info@northaesthetic.com'
      );
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
}

// Make submitFeedback globally accessible
window.submitFeedback = submitFeedback;

