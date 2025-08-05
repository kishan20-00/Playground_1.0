from flask import render_template, request, flash, redirect, url_for, jsonify
from flask_mail import Message
from app import app, mail
import logging

@app.route('/')
def index():
    """Render the main landing page"""
    return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submissions"""
    try:
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        company = request.form.get('company', '').strip()
        message = request.form.get('message', '').strip()
        
        # Basic validation
        if not all([name, email, message]):
            flash('Please fill in all required fields.', 'error')
            return redirect(url_for('index') + '#contact')
        
        # Create email message
        subject = f"New Contact Form Submission from {name}"
        body = f"""
        New contact form submission:
        
        Name: {name}
        Email: {email}
        Company: {company if company else 'Not provided'}
        
        Message:
        {message}
        """
        
        msg = Message(
            subject=subject,
            recipients=[app.config.get('MAIL_DEFAULT_SENDER', 'contact@aiplayground.com')],
            body=body,
            reply_to=email
        )
        
        # Send email
        mail.send(msg)
        
        flash('Thank you for your message! We\'ll get back to you soon.', 'success')
        logging.info(f"Contact form submitted by {email}")
        
    except Exception as e:
        logging.error(f"Error sending contact form: {str(e)}")
        flash('Sorry, there was an error sending your message. Please try again.', 'error')
    
    return redirect(url_for('index') + '#contact')

@app.route('/demo-request', methods=['POST'])
def demo_request():
    """Handle demo request form submissions"""
    try:
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        company = request.form.get('company', '').strip()
        use_case = request.form.get('use_case', '').strip()
        
        # Basic validation
        if not all([name, email, company]):
            flash('Please fill in all required fields.', 'error')
            return redirect(url_for('index') + '#demo')
        
        # Create email message
        subject = f"Demo Request from {company} - {name}"
        body = f"""
        New demo request:
        
        Name: {name}
        Email: {email}
        Company: {company}
        Use Case: {use_case if use_case else 'Not specified'}
        
        Please schedule a demo for this potential client.
        """
        
        msg = Message(
            subject=subject,
            recipients=[app.config.get('MAIL_DEFAULT_SENDER', 'demos@aiplayground.com')],
            body=body,
            reply_to=email
        )
        
        # Send email
        mail.send(msg)
        
        flash('Demo request submitted successfully! Our team will contact you within 24 hours.', 'success')
        logging.info(f"Demo request submitted by {email} from {company}")
        
    except Exception as e:
        logging.error(f"Error sending demo request: {str(e)}")
        flash('Sorry, there was an error submitting your demo request. Please try again.', 'error')
    
    return redirect(url_for('index') + '#demo')
