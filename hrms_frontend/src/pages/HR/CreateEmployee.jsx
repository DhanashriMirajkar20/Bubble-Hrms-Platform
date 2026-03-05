import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import axiosInstance from '../../utils/axiosConfig';
import { API_ENDPOINTS } from '../../config/api';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import theme from '../../constants/theme';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaSave, FaTimes, FaCalendarAlt, FaMoneyBillWave, FaIdBadge, FaStar, FaMapMarkerAlt, FaUserTie } from 'react-icons/fa';
import {
  sanitizeInput,
  sanitizeNameInput,
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePhoneNumber,
  validateExperience,
  validateDepartment,
  validateSubBusinessUnit,
  validateDesignation,
  validateOfficeLocation,
  validateManagerId,
  validateSalary,
  validateAllFields,
} from '../../utils/createEmployeeValidation';

const CreateEmployee = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { theme: currentTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({
    firstName: { isValid: true, error: '' },
    lastName: { isValid: true, error: '' },
    personalEmail: { isValid: true, error: '' },
    phone: { isValid: true, error: '' },
    currentExperience: { isValid: true, error: '' },
    department: { isValid: true, error: '' },
    subBusinessUnit: { isValid: true, error: '' },
    designation: { isValid: true, error: '' },
    currentOfficeLocation: { isValid: true, error: '' },
    managerId: { isValid: true, error: '' },
    salary: { isValid: true, error: '' },
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    personalEmail: '',
    phone: '',
    department: '',
    designation: '',
    salary: '',
    employeeType: 'FULL_TIME',
    currentBand: '',
    currentExperience: '',
    dateOfJoining: new Date().toISOString().split('T')[0],
    subBusinessUnit: '',
    currentOfficeLocation: '',
    managerId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`[${name}] Raw input:`, value);
    // Use name-specific sanitizer for fields that allow internal spaces to preserve typing
    const spaceFriendlyFields = ['firstName', 'lastName', 'department', 'designation', 'currentOfficeLocation'];
    const sanitized = spaceFriendlyFields.includes(name) ? sanitizeNameInput(value) : sanitizeInput(value);
    console.log(`[${name}] After sanitize:`, sanitized);

    // Real-time validation for each field
    let validation = { isValid: true, error: '' };

    switch (name) {
      case 'firstName':
        validation = validateFirstName(sanitized);
        console.log(`[firstName] Validation result:`, validation);
        break;
      case 'lastName':
        validation = validateLastName(sanitized);
        break;
      case 'personalEmail':
        validation = validateEmail(sanitized);
        break;
      case 'phone':
        validation = validatePhoneNumber(sanitized);
        break;
      case 'currentExperience':
        validation = validateExperience(sanitized);
        break;
      case 'department':
        validation = validateDepartment(sanitized);
        break;
      case 'subBusinessUnit':
        validation = validateSubBusinessUnit(sanitized);
        break;
      case 'designation':
        validation = validateDesignation(sanitized);
        break;
      case 'currentOfficeLocation':
        validation = validateOfficeLocation(sanitized);
        break;
      case 'managerId':
        validation = validateManagerId(sanitized);
        break;
      case 'salary':
        validation = validateSalary(sanitized);
        break;
      default:
        break;
    }

    setValidationErrors((prev) => ({ ...prev, [name]: validation }));
    setFormData((prev) => ({ ...prev, [name]: sanitized }));

    // Clear old-style errors if field becomes valid
    if (validation.isValid && errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFieldBlur = (fieldName) => {
    // Re-validate on blur for confirmation
    const value = formData[fieldName];
    let validation = { isValid: true, error: '' };

    switch (fieldName) {
      case 'firstName':
        validation = validateFirstName(value);
        break;
      case 'lastName':
        validation = validateLastName(value);
        break;
      case 'personalEmail':
        validation = validateEmail(value);
        break;
      case 'phone':
        validation = validatePhoneNumber(value);
        break;
      case 'currentExperience':
        validation = validateExperience(value);
        break;
      case 'department':
        validation = validateDepartment(value);
        break;
      case 'subBusinessUnit':
        validation = validateSubBusinessUnit(value);
        break;
      case 'designation':
        validation = validateDesignation(value);
        break;
      case 'currentOfficeLocation':
        validation = validateOfficeLocation(value);
        break;
      case 'managerId':
        validation = validateManagerId(value);
        break;
      case 'salary':
        validation = validateSalary(value);
        break;
      default:
        break;
    }

    setValidationErrors((prev) => ({ ...prev, [fieldName]: validation }));
  };

  const isFormValid = useCallback(() => {
    return Object.values(validationErrors).every((field) => field.isValid);
  }, [validationErrors]);

  const validateForm = () => {
    // Use new validation functions to validate all fields
    const validationResults = {
      firstName: validateFirstName(formData.firstName),
      lastName: validateLastName(formData.lastName),
      personalEmail: validateEmail(formData.personalEmail),
      phone: validatePhoneNumber(formData.phone),
      currentExperience: validateExperience(formData.currentExperience),
      department: validateDepartment(formData.department),
      subBusinessUnit: validateSubBusinessUnit(formData.subBusinessUnit),
      designation: validateDesignation(formData.designation),
      currentOfficeLocation: validateOfficeLocation(formData.currentOfficeLocation),
      managerId: validateManagerId(formData.managerId),
      salary: validateSalary(formData.salary),
    };

    // Update validation errors state
    setValidationErrors(validationResults);

    // Build old-style errors for backward compatibility
    const newErrors = {};
    Object.entries(validationResults).forEach(([field, result]) => {
      if (!result.isValid) {
        newErrors[field] = result.error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const phoneNum = parseInt(String(formData.phone).replace(/\D/g, ''), 10) || 0;
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        department: formData.department,
        designation: formData.designation,
        employeeType: formData.employeeType,
        dateOfJoining: formData.dateOfJoining,
        currentBand: formData.currentBand,
        currentExperience: parseFloat(formData.currentExperience) || 0,
        ctc: parseInt(formData.salary, 10) || 0,
        phoneNumber: parseInt(String(formData.phone).replace(/\D/g, ''), 10) || 0,
        personalEmail: formData.personalEmail,

        subBusinessUnit: formData.subBusinessUnit,
        currentOfficeLocation: formData.currentOfficeLocation,
        managerId: formData.managerId
        ? parseInt(formData.managerId, 10)
        : 0,
      };
      const res = await axiosInstance.post(API_ENDPOINTS.HR.CREATE_EMPLOYEE, payload);
      const creds = res.data;
      const msg = creds?.tempPassword
        ? `Employee created. Login: ${creds.username}. Temporary password: ${creds.tempPassword} (share securely with employee)`
        : 'Employee created successfully!';
      showToast({ type: 'success', title: 'Employee created', message: msg });
      navigate('/hr/manage-employees');
    } catch (error) {
      const data = error.response?.data;
      const msg =
        (typeof data?.message === 'string' && data.message) ||
        (typeof data?.error === 'string' && data.error) ||
        (error.response?.status === 403 && 'You do not have permission to create employees.') ||
        (error.response?.status === 401 && 'Please log in again.') ||
        (error.response?.status === 400 && (data?.message || 'Invalid request. Check the form (e.g. company email may already be in use).')) ||
        'Failed to create employee. Try again or contact support.';
      showToast({ type: 'error', title: 'Create failed', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const FormField = ({ label, required, icon: Icon, children, error, success }) => (
    <div className="form-group mb-4">
      <label className="form-label fw-bold mb-3" style={{
        fontSize: '0.95rem',
        color: '#2c3e50',
        letterSpacing: '0.3px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {Icon && <Icon size={16} style={{ color: '#667eea' }} />}
        {label}
        {required && <span className="text-danger" style={{ fontSize: '1.1rem' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {children}
      </div>
      {error && (
        <div className="text-danger mt-2" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>⚠</span> {error}
        </div>
      )}
      {success && (
        <div className="text-success mt-2" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>✓</span> {success}
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh'
      }}>
        <div className="w-full max-w-5xl">
          {/* Header Card */}
          <div className="card border-0 shadow-lg mb-4" style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px'
          }}>
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                     style={{
                       width: '80px',
                       height: '80px',
                       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                       color: 'white'
                     }}>
                  <FaUser size={32} />
                </div>
                <h2 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>Create Employee Account</h2>
                <p className="text-muted mb-0">Add a new team member to your organization</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="card border-0 shadow-lg" style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px'
          }}>
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Personal Information Section */}
                  <div className="col-12 mb-4">
                    <div className="d-flex align-items-center mb-4" style={{
                      borderBottom: '3px solid #667eea',
                      paddingBottom: '15px'
                    }}>
                      <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{
                             width: '40px',
                             height: '40px',
                             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                             color: 'white'
                           }}>
                        <FaUser size={18} />
                      </div>
                      <h4 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>Personal Information</h4>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <FormField
                      label="First Name"
                      required
                      icon={FaUser}
                      error={!validationErrors.firstName.isValid ? validationErrors.firstName.error : ''}
                      success={formData.firstName && validationErrors.firstName.isValid ? 'Valid' : ''}
                    >
                      <input
                        type="text"
                        className={`form-control form-control-lg ${!validationErrors.firstName.isValid ? 'is-invalid' : ''}`}
                        name="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={() => handleFieldBlur('firstName')}
                        maxLength="30"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          padding: '12px 16px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#f8f9fa'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e9ecef';
                          handleFieldBlur('firstName');
                        }}
                      />
                    </FormField>
                  </div>

                  <div className="col-md-6">
                    <FormField
                      label="Last Name"
                      required
                      icon={FaUser}
                      error={!validationErrors.lastName.isValid ? validationErrors.lastName.error : ''}
                      success={formData.lastName && validationErrors.lastName.isValid ? 'Valid' : ''}
                    >
                      <input
                        type="text"
                        className={`form-control form-control-lg ${!validationErrors.lastName.isValid ? 'is-invalid' : ''}`}
                        name="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={() => handleFieldBlur('lastName')}
                        maxLength="30"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          padding: '12px 16px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#f8f9fa'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e9ecef';
                          handleFieldBlur('lastName');
                        }}
                      />
                    </FormField>
                  </div>

                  <div className="col-md-6">
                    <FormField
                      label="Email Address"
                      required
                      icon={FaEnvelope}
                      error={!validationErrors.personalEmail.isValid ? validationErrors.personalEmail.error : ''}
                      success={formData.personalEmail && validationErrors.personalEmail.isValid ? 'Valid' : ''}
                    >
                      <input
                        type="email"
                        className={`form-control form-control-lg ${!validationErrors.personalEmail.isValid ? 'is-invalid' : ''}`}
                        name="personalEmail"
                        placeholder="employee@company.com"
                        value={formData.personalEmail}
                        onChange={handleChange}
                        onBlur={() => handleFieldBlur('personalEmail')}
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          padding: '12px 16px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#f8f9fa'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e9ecef';
                          handleFieldBlur('personalEmail');
                        }}
                      />
                    </FormField>
                  </div>

                  <div className="col-md-6">
                    <FormField
                      label="Phone Number"
                      required
                      icon={FaPhone}
                      error={!validationErrors.phone.isValid ? validationErrors.phone.error : ''}
                      success={formData.phone && validationErrors.phone.isValid ? 'Valid' : ''}
                    >
                      <input
                        type="tel"
                        className={`form-control form-control-lg ${!validationErrors.phone.isValid ? 'is-invalid' : ''}`}
                        name="phone"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={() => handleFieldBlur('phone')}
                        maxLength="13"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          padding: '12px 16px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#f8f9fa'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e9ecef';
                          handleFieldBlur('phone');
                        }}
                      />
                    </FormField>
                  </div>

                  {/* Professional Information Section */}
                  <div className="col-12 mt-5 mb-4">
                    <div className="d-flex align-items-center mb-4" style={{
                      borderBottom: '3px solid #667eea',
                      paddingBottom: '15px'
                    }}>
                      <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{
                             width: '40px',
                             height: '40px',
                             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                             color: 'white'
                           }}>
                        <FaUserTie size={18} />
                      </div>
                      <h4 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>Professional Details</h4>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <FormField
                      label="Department"
                      required
                      icon={FaBuilding}
                      error={!validationErrors.department.isValid ? validationErrors.department.error : ''}
                      success={formData.department && validationErrors.department.isValid ? 'Valid' : ''}
                    >
                      <input
                        type="text"
                        className={`form-control form-control-lg ${!validationErrors.department.isValid ? 'is-invalid' : ''}`}
                        name="department"
                        placeholder="Engineering"
                        value={formData.department}
                        onChange={handleChange}
                        onBlur={() => handleFieldBlur('department')}
                        maxLength="50"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          padding: '12px 16px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#f8f9fa'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e9ecef';
                          handleFieldBlur('department');
                        }}
                      />
                    </FormField>
                  </div>

                  <div className="col-md-6">
                    <FormField
                      label="Designation"
                      required
                      icon={FaIdBadge}
                      error={!validationErrors.designation.isValid ? validationErrors.designation.error : ''}
                      success={formData.designation && validationErrors.designation.isValid ? 'Valid' : ''}
                    >
                      <input
                        type="text"
                        className={`form-control form-control-lg ${!validationErrors.designation.isValid ? 'is-invalid' : ''}`}
                        name="designation"
                        placeholder="Software Engineer"
                        value={formData.designation}
                        onChange={handleChange}
                        onBlur={() => handleFieldBlur('designation')}
                        maxLength="50"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          padding: '12px 16px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#f8f9fa'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e9ecef';
                          handleFieldBlur('designation');
                        }}
                      />
                    </FormField>
                  </div>

                  <div className="col-md-6">
                    <FormField label="Employee Type" icon={FaStar}>
                      <select
                        className="form-select form-select-lg"
                        name="employeeType"
                        value={formData.employeeType}
                        onChange={handleChange}
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          padding: '12px 16px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#f8f9fa'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      >
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="CONTRACT">Contract</option>
                      </select>
                    </FormField>
                  </div>

                  <div className="col-md-6">
                    <FormField label="Current Band" icon={FaStar}>
                      <select
                        className="form-select form-select-lg"
                        name="currentBand"
                        value={formData.currentBand}
                        onChange={handleChange}
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          padding: '12px 16px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#f8f9fa'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      >
                        <option value="">Select band</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="B3">B3</option>
                        <option value="B4">B4</option>
                        <option value="B5">B5</option>
                      </select>
                    </FormField>
                  </div>

                  <div className="col-md-6">
                    <FormField
                      label="Years of Experience"
                      required
                      icon={FaCalendarAlt}
                      error={!validationErrors.currentExperience.isValid ? validationErrors.currentExperience.error : ''}
                      success={formData.currentExperience && validationErrors.currentExperience.isValid ? 'Valid' : ''}
                    >
                      <input
                        type="number"
                        step="0.1"
                        className={`form-control form-control-lg ${!validationErrors.currentExperience.isValid ? 'is-invalid' : ''}`}
                        name="currentExperience"
                        placeholder="2.5"
                        value={formData.currentExperience}
                        onChange={handleChange}
                        onBlur={() => handleFieldBlur('currentExperience')}
                        min="0"
                        max="50"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          padding: '12px 16px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#f8f9fa'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e9ecef';
                          handleFieldBlur('currentExperience');
                        }}
                      />
                    </FormField>
                  </div>

                  <div className="col-md-6">
                    <FormField
                      label="Annual Salary (CTC)"
                      required
                      icon={FaMoneyBillWave}
                      error={!validationErrors.salary.isValid ? validationErrors.salary.error : ''}
                      success={formData.salary && validationErrors.salary.isValid ? 'Valid' : ''}
                    >
                      <input
                        type="number"
                        className={`form-control form-control-lg ${!validationErrors.salary.isValid ? 'is-invalid' : ''}`}
                        name="salary"
                        placeholder="500000"
                        value={formData.salary}
                        onChange={handleChange}
                        onBlur={() => handleFieldBlur('salary')}
                        min="10000"
                        step="0.01"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          padding: '12px 16px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#f8f9fa'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e9ecef';
                          handleFieldBlur('salary');
                        }}
                      />
                    </FormField>
                  </div>

                  {/* Additional Information Section */}
                  <div className="col-12 mt-5 mb-4">
                    <div className="d-flex align-items-center mb-4" style={{
                      borderBottom: '3px solid #667eea',
                      paddingBottom: '15px'
                    }}>
                      <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{
                             width: '40px',
                             height: '40px',
                             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                             color: 'white'
                           }}>
                        <FaMapMarkerAlt size={18} />
                      </div>
                      <h4 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>Additional Information</h4>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <FormField
                      label="Sub Business Unit"
                      required
                      icon={FaBuilding}
                      error={!validationErrors.subBusinessUnit.isValid ? validationErrors.subBusinessUnit.error : ''}
                      success={formData.subBusinessUnit && validationErrors.subBusinessUnit.isValid ? 'Valid' : ''}
                    >
                      <input
                        type="number"
                        className={`form-control form-control-lg ${!validationErrors.subBusinessUnit.isValid ? 'is-invalid' : ''}`}
                        name="subBusinessUnit"
                        placeholder="12345"
                        value={formData.subBusinessUnit}
                        onChange={handleChange}
                        onBlur={() => handleFieldBlur('subBusinessUnit')}
                        min="1"
                        max="999999"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          padding: '12px 16px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#f8f9fa'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e9ecef';
                          handleFieldBlur('subBusinessUnit');
                        }}
                      />
                    </FormField>
                  </div>

                  <div className="col-md-6">
                    <FormField
                      label="Office Location"
                      required
                      icon={FaMapMarkerAlt}
                      error={!validationErrors.currentOfficeLocation.isValid ? validationErrors.currentOfficeLocation.error : ''}
                      success={formData.currentOfficeLocation && validationErrors.currentOfficeLocation.isValid ? 'Valid' : ''}
                    >
                      <input
                        type="text"
                        className={`form-control form-control-lg ${!validationErrors.currentOfficeLocation.isValid ? 'is-invalid' : ''}`}
                        name="currentOfficeLocation"
                        placeholder="Chennai"
                        value={formData.currentOfficeLocation}
                        onChange={handleChange}
                        onBlur={() => handleFieldBlur('currentOfficeLocation')}
                        maxLength="50"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          padding: '12px 16px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#f8f9fa'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e9ecef';
                          handleFieldBlur('currentOfficeLocation');
                        }}
                      />
                    </FormField>
                  </div>

                  <div className="col-md-6">
                    <FormField
                      label="Manager ID"
                      icon={FaUserTie}
                      error={formData.managerId && !validationErrors.managerId.isValid ? validationErrors.managerId.error : ''}
                      success={formData.managerId && validationErrors.managerId.isValid ? 'Valid' : ''}
                    >
                      <input
                        type="number"
                        className={`form-control form-control-lg ${formData.managerId && !validationErrors.managerId.isValid ? 'is-invalid' : ''}`}
                        name="managerId"
                        placeholder="Enter manager employee ID (optional)"
                        value={formData.managerId}
                        onChange={handleChange}
                        onBlur={() => handleFieldBlur('managerId')}
                        min="1"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          padding: '12px 16px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#f8f9fa'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e9ecef';
                          handleFieldBlur('managerId');
                        }}
                      />
                    </FormField>
                  </div>

                  <div className="col-md-6">
                    <FormField label="Date of Joining" icon={FaCalendarAlt}>
                      <input
                        type="date"
                        className="form-control form-control-lg"
                        name="dateOfJoining"
                        value={formData.dateOfJoining}
                        onChange={handleChange}
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          padding: '12px 16px',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#f8f9fa'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                    </FormField>
                  </div>

                  {/* Action Buttons */}
                  <div className="col-12 mt-5 pt-4 border-top">
                    <div className="d-flex gap-3 justify-content-end">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg px-4 py-3"
                        onClick={() => navigate('/hr/manage-employees')}
                        disabled={loading}
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #6c757d',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#6c757d';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#6c757d';
                        }}
                      >
                        <FaTimes className="me-2" /> Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg px-4 py-3 d-flex align-items-center gap-2"
                        disabled={loading || !isFormValid()}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          borderRadius: '12px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <FaSave /> Create Employee Account
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  icon,
  type = "text",
  isDark,
  isSelect,
  options,
}) => {
  if (isSelect) {
    return (
      <div>
        <label className="block text-sm font-medium mb-2" style={{
          color: isDark ? '#cbd5e0' : theme.colors.textDark
        }}>
          {label}
        </label>

        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full outline-none rounded-lg px-3 py-2 transition-all"
          style={{
            background: isDark ? '#0f172a' : theme.colors.bgLight,
            border: `2px solid ${isDark ? '#475569' : theme.colors.borderLight}`,
            color: isDark ? '#f1f5f9' : theme.colors.textDark
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && (
          <p className="text-sm mt-1 flex items-center gap-1" style={{
            color: theme.colors.error
          }}>
            ⚠ {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{
        color: isDark ? '#cbd5e0' : theme.colors.textDark
      }}>
        {label}
      </label>

      <div className="flex items-center rounded-lg px-3 py-2 transition-all" style={{
        background: isDark ? '#0f172a' : theme.colors.bgLight,
        border: `2px solid ${
          error
            ? theme.colors.error
            : isDark
              ? '#475569'
              : theme.colors.borderLight
        }`,
        color: isDark ? '#f1f5f9' : theme.colors.textDark
      }}>

        {icon && <span className="mr-2" style={{
          color: isDark ? '#94a3b8' : theme.colors.textLight
        }}>
          {icon}
        </span>}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="w-full outline-none bg-transparent"
          style={{
            color: isDark ? '#f1f5f9' : theme.colors.textDark
          }}
        />

      </div>

      {error && (
        <p className="text-sm mt-1 flex items-center gap-1" style={{
          color: theme.colors.error
        }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
};

export default CreateEmployee;
