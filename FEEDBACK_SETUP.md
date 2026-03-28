# Feedback Form Setup Guide - North Aesthetic

## ✅ What's Been Fixed

1. **Feedback.html** - Updated with proper form validation and star rating system
2. **src/main.js** - Created with complete email sending logic using EmailJS
3. **package.json** - Added EmailJS dependency

## 🚀 Installation & Setup Steps

### Step 1: Install Dependencies

Run this command in your project directory:

```powershell
npm install
```

### Step 2: Create EmailJS Account

1. Go to **https://www.emailjs.com/**
2. Sign up for a free account
3. Go to your **Dashboard**

### Step 3: Set Up EmailJS Email Service

1. Click **"Add New Service"**
2. Choose **"Gmail"** or your email provider
3. Follow the instructions to connect your email
4. Copy your **Service ID** (looks like: `service_xxxxxxxxx`)

### Step 4: Create Email Template

1. Go to **"Email Templates"** section
2. Click **"Create New Template"**
3. Use this template (important - match the variable names exactly):

```
To Email: {{to_email}}
Subject: New Feedback from {{from_name}}

Feedback Details:
- Name: {{from_name}}
- Email: {{from_email}}
- Category: {{category}}
- Rating: {{rating}}/5
- Message:
{{message}}

---
Reply to: {{reply_to}}
```

4. Save and copy your **Template ID** (looks like: `template_xxxxxxxxx`)

### Step 5: Get Your Public Key

1. Go to **Account > API Keys**
2. Copy your **Public Key**

### Step 6: Update Configuration

Edit `src/main.js` and replace these values with your actual credentials:

```javascript
const SERVICE_ID = 'service_YOUR_ID_HERE';      // From Step 3
const TEMPLATE_ID = 'template_YOUR_ID_HERE';    // From Step 4
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE';      // From Step 5
```

**Example:**
```javascript
const SERVICE_ID = 'service_abc123def456';
const TEMPLATE_ID = 'template_xyz789uvw012';
const PUBLIC_KEY = 'GH_PUBLIC_KEY_1a2b3c4d5e6f7g8h9i';
```

### Step 7: Update index.html Navigation

The Feedback link should be working, but ensure your `index.html` has this link in the navigation:

```html
<li><a href="Feedback.html">Feedback</a></li>
```

### Step 8: Run the Development Server

```powershell
npm run dev
```

Your site will be running at `http://localhost:5173` (or similar)

### Step 9: Test the Feedback Form

1. Navigate to the **Feedback** page
2. Fill out the form:
   - Enter your name
   - Enter your email
   - Select a category
   - Click on stars to rate (1-5)
   - Write a message
3. Click **"Submit Feedback"**
4. You should see a success message
5. Check your email inbox (and spam folder) for the feedback message at **info@northaesthetic.com**

## 📧 How It Works

- **Form Location**: `Feedback.html`
- **Email Destination**: `info@northaesthetic.com`
- **Email Service**: EmailJS (no server needed - sends directly from browser)
- **Form Data Sent**:
  - Customer Name
  - Customer Email
  - Feedback Category
  - Rating (1-5 stars)
  - Message
  - Timestamp (automatic)

## 🔐 Security Notes

- Your **Public Key** is safe to share (it's public)
- Your **Service ID** and **Template ID** are internal references
- EmailJS is a trusted service used by thousands of websites
- All communication is encrypted

## ❌ Troubleshooting

### Form not sending emails?

1. Check browser console (F12) for error messages
2. Verify all three credentials are correctly entered in `main.js`
3. Ensure the email template variables match exactly
4. Check EmailJS dashboard to see if emails are being attempted

### Emails going to spam?

1. Add `info@northaesthetic.com` to your email contacts
2. Check your email spam/junk folder
3. Gmail: Mark as "Not Spam" to train the filter

### "Processing..." button stuck?

1. Check browser console (F12) for errors
2. Verify internet connection
3. Restart the dev server: `npm run dev`

## 📱 Features Included

✅ Form validation (all fields required)
✅ Email format validation
✅ Star rating system (visual feedback)
✅ Success/error messages
✅ Form auto-reset after submission
✅ Loading state on button
✅ Responsive design
✅ Mobile-friendly

## 🛠️ File Structure

```
NorthPh/
├── Feedback.html          (Updated - Feedback form page)
├── src/
│   └── main.js           (New - Email logic)
├── package.json          (Updated - EmailJS dependency)
└── public/
    └── style.css         (Existing styles)
```

---

**Need Help?** 
- EmailJS Support: https://www.emailjs.com/docs/
- Check browser console (F12 → Console tab) for detailed error messages

