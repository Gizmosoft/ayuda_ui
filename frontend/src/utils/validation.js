/**
 * Validation utility functions for form validation
 */

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  console.log('Validation: Checking email validity:', email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  console.log('Validation: Email valid:', isValid);
  return isValid;
};

/**
 * Validates password strength according to security guidelines
 * 
 * PASSWORD REQUIREMENTS:
 * - Minimum 8 characters long
 * - At least one lowercase letter (a-z)
 * - At least one uppercase letter (A-Z)
 * - At least one number (0-9)
 * 
 * SECURITY RATIONALE:
 * - 8+ characters: Provides sufficient entropy against brute force attacks
 * - Mixed case: Increases character set from 26 to 52 possibilities
 * - Numbers: Adds 10 more characters to the character set
 * - This combination creates a strong password that's still user-friendly
 * 
 * FUTURE ENHANCEMENTS (if needed):
 * - Special characters (!@#$%^&*)
 * - Maximum length limits
 * - Common password blacklist
 * - Password history checking
 * 
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  console.log('Validation: Checking password strength');
  // Rule 1: Minimum length of 8 characters
  if (password.length < 8) {
    console.log('Validation: Password too short');
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }
  
  // Rule 2: At least one lowercase letter
  if (!/(?=.*[a-z])/.test(password)) {
    console.log('Validation: Password missing lowercase letter');
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter'
    };
  }
  
  // Rule 3: At least one uppercase letter
  if (!/(?=.*[A-Z])/.test(password)) {
    console.log('Validation: Password missing uppercase letter');
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }
  
  // Rule 4: At least one number
  if (!/(?=.*\d)/.test(password)) {
    console.log('Validation: Password missing number');
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }
  
  console.log('Validation: Password is valid');
  return {
    isValid: true,
    message: ''
  };
};

/**
 * Validates date of birth
 * @param {string} dob - Date of birth in YYYY-MM-DD format
 * @returns {Object} Validation result with isValid and message
 */
export const validateDateOfBirth = (dob) => {
  if (!dob) {
    return {
      isValid: false,
      message: 'Date of birth is required'
    };
  }
  
  const date = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      message: 'Please enter a valid date'
    };
  }
  
  if (age < 13) {
    return {
      isValid: false,
      message: 'You must be at least 13 years old to register'
    };
  }
  
  if (age > 100) {
    return {
      isValid: false,
      message: 'Please enter a valid date of birth'
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
};

/**
 * Validates name (first name or last name)
 * @param {string} name - Name to validate
 * @param {string} fieldName - Field name for error message
 * @returns {Object} Validation result with isValid and message
 */
export const validateName = (name, fieldName) => {
  if (!name.trim()) {
    return {
      isValid: false,
      message: `${fieldName} is required`
    };
  }
  
  if (name.length < 2) {
    return {
      isValid: false,
      message: `${fieldName} must be at least 2 characters long`
    };
  }
  
  if (name.length > 50) {
    return {
      isValid: false,
      message: `${fieldName} must be less than 50 characters`
    };
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return {
      isValid: false,
      message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
};

/**
 * Validates university name
 * @param {string} university - University name to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validateUniversity = (university) => {
  if (!university.trim()) {
    return {
      isValid: false,
      message: 'University is required'
    };
  }
  
  if (university.length < 3) {
    return {
      isValid: false,
      message: 'University name must be at least 3 characters long'
    };
  }
  
  if (university.length > 100) {
    return {
      isValid: false,
      message: 'University name must be less than 100 characters'
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
};

/**
 * Validates major field
 * @param {string} major - Major to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validateMajor = (major) => {
  if (!major.trim()) {
    return {
      isValid: false,
      message: 'Major is required'
    };
  }
  
  if (major.length < 2) {
    return {
      isValid: false,
      message: 'Major must be at least 2 characters long'
    };
  }
  
  if (major.length > 100) {
    return {
      isValid: false,
      message: 'Major must be less than 100 characters'
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
};

/**
 * Validates access code
 * @param {string} accessCode - Access code to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validateAccessCode = (accessCode) => {
  if (!accessCode.trim()) {
    return {
      isValid: false,
      message: 'Access code is required'
    };
  }
  
  if (accessCode.length < 4) {
    return {
      isValid: false,
      message: 'Access code must be at least 4 characters long'
    };
  }
  
  if (accessCode.length > 50) {
    return {
      isValid: false,
      message: 'Access code must be less than 50 characters'
    };
  }
  
  return {
    isValid: true,
    message: ''
  };
};

/**
 * Validates entire signup form
 * @param {Object} formData - Form data object
 * @returns {Object} Validation result with isValid, errors object, and messages
 */
export const validateSignupForm = (formData) => {
  const errors = {};
  let isValid = true;
  
  // Validate first name
  const firstNameValidation = validateName(formData.first_name, 'First name');
  if (!firstNameValidation.isValid) {
    errors.first_name = firstNameValidation.message;
    isValid = false;
  }
  
  // Validate last name - REMOVED: Last name can be anything
  // No validation applied to last_name field
  
  // Validate university
  const universityValidation = validateUniversity(formData.university);
  if (!universityValidation.isValid) {
    errors.university = universityValidation.message;
    isValid = false;
  }
  
  // Validate email
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }
  
  // Validate major
  const majorValidation = validateMajor(formData.major);
  if (!majorValidation.isValid) {
    errors.major = majorValidation.message;
    isValid = false;
  }
  
  // Validate date of birth
  const dobValidation = validateDateOfBirth(formData.dob);
  if (!dobValidation.isValid) {
    errors.dob = dobValidation.message;
    isValid = false;
  }
  
  // Validate password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
    isValid = false;
  }
  
  // Validate access code
  const accessCodeValidation = validateAccessCode(formData.access_token);
  if (!accessCodeValidation.isValid) {
    errors.access_token = accessCodeValidation.message;
    isValid = false;
  }
  
  return {
    isValid,
    errors
  };
}; 