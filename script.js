// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.submit-btn');
    const successMessage = document.getElementById('successMessage');
    
    // Form validation rules
    const validationRules = {
        firstName: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s'-]+$/,
            message: 'First name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes'
        },
        lastName: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s'-]+$/,
            message: 'Last name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            required: true,
            pattern: /^[\+]?[\d\s\-\(\)]{10,15}$/,
            message: 'Please enter a valid phone number (10-15 digits)'
        },
        age: {
            required: true,
            min: 18,
            max: 100,
            message: 'Age must be between 18 and 100'
        },
        availability: {
            required: true,
            message: 'Please select your availability'
        },
        terms: {
            required: true,
            message: 'You must agree to the terms and conditions'
        }
    };

    // Real-time validation for individual fields
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName) || document.querySelector(`input[name="${fieldName}"]`);
        if (field) {
            if (field.type === 'radio') {
                // Handle radio buttons
                const radioButtons = document.querySelectorAll(`input[name="${fieldName}"]`);
                radioButtons.forEach(radio => {
                    radio.addEventListener('change', () => validateField(fieldName));
                });
            } else {
                // Handle other input types
                field.addEventListener('blur', () => validateField(fieldName));
                field.addEventListener('input', () => {
                    if (field.classList.contains('error')) {
                        validateField(fieldName);
                    }
                });
            }
        }
    });

    // Email field real-time validation
    const emailField = document.getElementById('email');
    emailField.addEventListener('input', function() {
        const email = this.value;
        if (email.length > 0) {
            if (validationRules.email.pattern.test(email)) {
                showFieldSuccess('email');
            } else {
                if (this.classList.contains('error')) {
                    validateField('email');
                }
            }
        }
    });

    // Phone field formatting
    const phoneField = document.getElementById('phone');
    phoneField.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
        }
        this.value = value;
    });

    // Age field validation
    const ageField = document.getElementById('age');
    ageField.addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
        if (this.value > 100) this.value = 100;
    });

    // Experience field validation
    const experienceField = document.getElementById('experience');
    experienceField.addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
        if (this.value > 50) this.value = 50;
    });

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Form reset handler
    form.addEventListener('reset', function() {
        setTimeout(() => {
            clearAllValidation();
            successMessage.style.display = 'none';
        }, 100);
    });

    // Validate individual field
    function validateField(fieldName) {
        const rule = validationRules[fieldName];
        const field = document.getElementById(fieldName) || document.querySelector(`input[name="${fieldName}"]`);
        const errorElement = document.getElementById(fieldName + 'Error');
        const formGroup = field ? field.closest('.form-group') : null;

        if (!field || !rule) return true;

        let value;
        let isValid = true;
        let errorMessage = '';

        // Get field value based on type
        if (field.type === 'radio') {
            const selectedRadio = document.querySelector(`input[name="${fieldName}"]:checked`);
            value = selectedRadio ? selectedRadio.value : '';
        } else if (field.type === 'checkbox' && fieldName === 'terms') {
            value = field.checked;
        } else {
            value = field.value.trim();
        }

        // Required validation
        if (rule.required) {
            if (field.type === 'checkbox' && fieldName === 'terms') {
                if (!value) {
                    isValid = false;
                    errorMessage = rule.message;
                }
            } else if (!value) {
                isValid = false;
                errorMessage = rule.message || `${fieldName} is required`;
            }
        }

        // Additional validations if field has value
        if (isValid && value && field.type !== 'checkbox') {
            // Pattern validation
            if (rule.pattern && !rule.pattern.test(value)) {
                isValid = false;
                errorMessage = rule.message;
            }

            // Min length validation
            if (rule.minLength && value.length < rule.minLength) {
                isValid = false;
                errorMessage = rule.message;
            }

            // Max length validation
            if (rule.maxLength && value.length > rule.maxLength) {
                isValid = false;
                errorMessage = rule.message;
            }

            // Number range validation
            if (rule.min !== undefined || rule.max !== undefined) {
                const numValue = parseInt(value);
                if (rule.min !== undefined && numValue < rule.min) {
                    isValid = false;
                    errorMessage = rule.message;
                }
                if (rule.max !== undefined && numValue > rule.max) {
                    isValid = false;
                    errorMessage = rule.message;
                }
            }
        }

        // Show/hide error messages and styling
        if (formGroup && errorElement) {
            if (isValid) {
                formGroup.classList.remove('error');
                formGroup.classList.add('success');
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            } else {
                formGroup.classList.remove('success');
                formGroup.classList.add('error');
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
            }
        }

        return isValid;
    }

    // Show field success state
    function showFieldSuccess(fieldName) {
        const field = document.getElementById(fieldName);
        const formGroup = field ? field.closest('.form-group') : null;
        const errorElement = document.getElementById(fieldName + 'Error');

        if (formGroup && errorElement) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    // Validate entire form
    function validateForm() {
        let isFormValid = true;
        
        // Validate all required fields
        Object.keys(validationRules).forEach(fieldName => {
            const fieldValid = validateField(fieldName);
            if (!fieldValid) {
                isFormValid = false;
            }
        });

        // Additional custom validations
        
        // Check if at least one skill is selected (optional validation)
        const skills = document.querySelectorAll('input[name="skills"]:checked');
        const skillsError = document.getElementById('skillsError');
        if (skills.length === 0) {
            // This is just a warning, not blocking submission
            console.log('No skills selected - this is optional');
        }

        // Message length validation (optional)
        const messageField = document.getElementById('message');
        const messageError = document.getElementById('messageError');
        const messageGroup = messageField.closest('.form-group');
        
        if (messageField.value.trim().length > 1000) {
            messageError.textContent = 'Message must be less than 1000 characters';
            messageError.classList.add('show');
            messageGroup.classList.add('error');
            isFormValid = false;
        } else {
            messageError.textContent = '';
            messageError.classList.remove('show');
            messageGroup.classList.remove('error');
        }

        return isFormValid;
    }

    // Submit form with Formspree integration
    function submitForm() {
        // Add loading state to submit button
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // Collect form data
        const formData = collectFormData();
        
        // Create FormData object for Formspree
        const formspreeData = new FormData();
        
        // Add all form fields to FormData
        formspreeData.append('firstName', formData.firstName);
        formspreeData.append('lastName', formData.lastName);
        formspreeData.append('email', formData.email);
        formspreeData.append('phone', formData.phone);
        formspreeData.append('age', formData.age);
        formspreeData.append('position', formData.position);
        formspreeData.append('experience', formData.experience);
        formspreeData.append('availability', formData.availability);
        formspreeData.append('skills', formData.skills.join(', '));
        formspreeData.append('message', formData.message);
        formspreeData.append('termsAccepted', formData.termsAccepted ? 'Yes' : 'No');
        formspreeData.append('submittedAt', formData.submittedAt);
        
        // Submit to Formspree
        fetch('https://formspree.io/f/xnnzdend', {
            method: 'POST',
            body: formspreeData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Success - show success message
                console.log('Form submitted successfully to Formspree:', formData);
                
                form.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Clear auto-save data
                formAutoSaveData = {};
                
                // Auto-hide success message and show form again after 8 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                    form.style.display = 'block';
                    form.reset();
                    clearAllValidation();
                }, 8000);
                
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            
            // Show error message
            alert('There was an error submitting your form. Please try again or contact us directly.');
            
            // Log the data locally as backup
            console.log('Form data (not submitted due to error):', formData);
        })
        .finally(() => {
            // Reset submit button
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Submit Application';
            submitBtn.disabled = false;
        });
    }

    // Collect all form data
    function collectFormData() {
        const data = {};
        
        // Text inputs
        ['firstName', 'lastName', 'email', 'phone', 'age', 'position', 'experience', 'message'].forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                data[field] = element.value.trim();
            }
        });

        // Radio buttons
        const availability = document.querySelector('input[name="availability"]:checked');
        data.availability = availability ? availability.value : '';

        // Checkboxes - Skills
        const skills = [];
        document.querySelectorAll('input[name="skills"]:checked').forEach(skill => {
            skills.push(skill.value);
        });
        data.skills = skills;

        // Terms checkbox
        data.termsAccepted = document.getElementById('terms').checked;

        // Add timestamp
        data.submittedAt = new Date().toISOString();

        return data;
    }

    // Clear all validation states
    function clearAllValidation() {
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
        });
        
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.classList.remove('show');
        });
    }

    // Additional utility functions

    // Character counter for message field
    const messageField = document.getElementById('message');
    const messageGroup = messageField.closest('.form-group');
    
    // Create character counter
    const charCounter = document.createElement('div');
    charCounter.className = 'char-counter';
    charCounter.style.cssText = `
        font-size: 0.9em;
        color: #666;
        text-align: right;
        margin-top: 5px;
    `;
    messageGroup.appendChild(charCounter);

    messageField.addEventListener('input', function() {
        const currentLength = this.value.length;
        const maxLength = 1000;
        charCounter.textContent = `${currentLength}/${maxLength} characters`;
        
        if (currentLength > maxLength * 0.9) {
            charCounter.style.color = '#e74c3c';
        } else if (currentLength > maxLength * 0.7) {
            charCounter.style.color = '#f39c12';
        } else {
            charCounter.style.color = '#666';
        }
    });

    // Initialize character counter
    messageField.dispatchEvent(new Event('input'));

    // Form auto-save to prevent data loss (stores in memory only)
    let formAutoSaveData = {};
    
    function autoSaveForm() {
        const currentData = collectFormData();
        formAutoSaveData = { ...currentData };
        console.log('Form auto-saved');
    }

    function restoreFormData() {
        if (Object.keys(formAutoSaveData).length === 0) return;
        
        // Restore text inputs
        ['firstName', 'lastName', 'email', 'phone', 'age', 'position', 'experience', 'message'].forEach(field => {
            const element = document.getElementById(field);
            if (element && formAutoSaveData[field]) {
                element.value = formAutoSaveData[field];
            }
        });

        // Restore radio buttons
        if (formAutoSaveData.availability) {
            const radioButton = document.querySelector(`input[name="availability"][value="${formAutoSaveData.availability}"]`);
            if (radioButton) {
                radioButton.checked = true;
            }
        }

        // Restore checkboxes
        if (formAutoSaveData.skills && formAutoSaveData.skills.length > 0) {
            formAutoSaveData.skills.forEach(skill => {
                const checkbox = document.querySelector(`input[name="skills"][value="${skill}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }

        // Restore terms
        if (formAutoSaveData.termsAccepted) {
            document.getElementById('terms').checked = true;
        }
    }

    // Auto-save every 30 seconds
    setInterval(autoSaveForm, 30000);

    // Save on page unload
    window.addEventListener('beforeunload', autoSaveForm);

    // Restore on page load
    restoreFormData();

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (validateForm()) {
                submitForm();
            }
        }
        
        // Escape to clear form
        if (e.key === 'Escape') {
            if (confirm('Are you sure you want to clear the form?')) {
                form.reset();
                clearAllValidation();
                formAutoSaveData = {};
            }
        }
    });

    // Form field tab navigation enhancement
    const formInputs = form.querySelectorAll('input, select, textarea, button');
    
    formInputs.forEach((input, index) => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                // Custom tab behavior if needed
            }
        });
    });

    // Accessibility improvements
    
    // Announce form errors to screen readers
    function announceErrors() {
        const errors = document.querySelectorAll('.error-message.show');
        if (errors.length > 0) {
            const errorMessages = Array.from(errors).map(error => error.textContent).join('. ');
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.style.position = 'absolute';
            announcement.style.left = '-10000px';
            announcement.textContent = `Form has ${errors.length} error(s): ${errorMessages}`;
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        }
    }

    // Call announceErrors when form validation fails
    const originalValidateForm = validateForm;
    validateForm = function() {
        const isValid = originalValidateForm();
        if (!isValid) {
            setTimeout(announceErrors, 100);
        }
        return isValid;
    };

    console.log('Cognifyz Contact Form initialized successfully!');
});