import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import axiosInstance from "../../utils/axiosConfig";
import { API_ENDPOINTS } from "../../config/api";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";
import theme from "../../constants/theme";
import {
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaBriefcase,
  FaSave,
  FaTimes,
  FaIdBadge,
  FaStar,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUser
} from "react-icons/fa";

const CreateHR = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { theme: currentTheme } = useTheme();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    role: "HR",
    firstName: "",
    lastName: "",
    department: "",
    designation: "",
    personalEmail: "",
    currentBand: "",
    currentExperience: "",
    salary: "",
    phone: "",
    dateOfJoining: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
    if (!formData.department.trim())
      newErrors.department = "Department required";
    if (!formData.designation.trim())
      newErrors.designation = "Designation required";
    if (!formData.personalEmail.trim())
      newErrors.personalEmail = "Email required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      await axiosInstance.post(API_ENDPOINTS.CREATE_HR, formData);

      showToast("HR created successfully", "success");

      navigate("/admin/dashboard");
    } catch (error) {
      showToast("Failed to create HR", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh'
      }}>
        <div className="w-full max-w-4xl">
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
                  <FaUserTie size={32} />
                </div>
                <h2 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>Create HR Account</h2>
                <p className="text-muted mb-0">Add a new HR professional to your organization</p>
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
                        <FaUserTie size={18} />
                      </div>
                      <h4 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>Personal Information</h4>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="form-label fw-bold mb-3" style={{
                        fontSize: '0.95rem',
                        color: '#2c3e50',
                        letterSpacing: '0.3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaUserTie size={16} style={{ color: '#667eea' }} />
                        First Name
                        <span className="text-danger" style={{ fontSize: '1.1rem' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.firstName ? 'is-invalid' : ''}`}
                        name="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleChange}
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
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                      {errors.firstName && (
                        <div className="text-danger mt-2" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span>⚠</span> {errors.firstName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="form-label fw-bold mb-3" style={{
                        fontSize: '0.95rem',
                        color: '#2c3e50',
                        letterSpacing: '0.3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaUserTie size={16} style={{ color: '#667eea' }} />
                        Last Name
                        <span className="text-danger" style={{ fontSize: '1.1rem' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.lastName ? 'is-invalid' : ''}`}
                        name="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleChange}
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
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                      {errors.lastName && (
                        <div className="text-danger mt-2" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span>⚠</span> {errors.lastName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="form-label fw-bold mb-3" style={{
                        fontSize: '0.95rem',
                        color: '#2c3e50',
                        letterSpacing: '0.3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaEnvelope size={16} style={{ color: '#667eea' }} />
                        Email Address
                        <span className="text-danger" style={{ fontSize: '1.1rem' }}>*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-control form-control-lg ${errors.personalEmail ? 'is-invalid' : ''}`}
                        name="personalEmail"
                        placeholder="hr@company.com"
                        value={formData.personalEmail}
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
                      {errors.personalEmail && (
                        <div className="text-danger mt-2" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span>⚠</span> {errors.personalEmail}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="form-label fw-bold mb-3" style={{
                        fontSize: '0.95rem',
                        color: '#2c3e50',
                        letterSpacing: '0.3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaPhone size={16} style={{ color: '#667eea' }} />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className={`form-control form-control-lg ${errors.phone ? 'is-invalid' : ''}`}
                        name="phone"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={handleChange}
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
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                      {errors.phone && (
                        <div className="text-danger mt-2" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span>⚠</span> {errors.phone}
                        </div>
                      )}
                    </div>
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
                        <FaBriefcase size={18} />
                      </div>
                      <h4 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>Professional Details</h4>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="form-label fw-bold mb-3" style={{
                        fontSize: '0.95rem',
                        color: '#2c3e50',
                        letterSpacing: '0.3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaBuilding size={16} style={{ color: '#667eea' }} />
                        Department
                        <span className="text-danger" style={{ fontSize: '1.1rem' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.department ? 'is-invalid' : ''}`}
                        name="department"
                        placeholder="Human Resources"
                        value={formData.department}
                        onChange={handleChange}
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
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                      {errors.department && (
                        <div className="text-danger mt-2" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span>⚠</span> {errors.department}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="form-label fw-bold mb-3" style={{
                        fontSize: '0.95rem',
                        color: '#2c3e50',
                        letterSpacing: '0.3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaIdBadge size={16} style={{ color: '#667eea' }} />
                        Designation
                        <span className="text-danger" style={{ fontSize: '1.1rem' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.designation ? 'is-invalid' : ''}`}
                        name="designation"
                        placeholder="HR Manager"
                        value={formData.designation}
                        onChange={handleChange}
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
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                      {errors.designation && (
                        <div className="text-danger mt-2" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span>⚠</span> {errors.designation}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="form-label fw-bold mb-3" style={{
                        fontSize: '0.95rem',
                        color: '#2c3e50',
                        letterSpacing: '0.3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaStar size={16} style={{ color: '#667eea' }} />
                        Current Band
                      </label>
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
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="form-label fw-bold mb-3" style={{
                        fontSize: '0.95rem',
                        color: '#2c3e50',
                        letterSpacing: '0.3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaCalendarAlt size={16} style={{ color: '#667eea' }} />
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className={`form-control form-control-lg ${errors.currentExperience ? 'is-invalid' : ''}`}
                        name="currentExperience"
                        placeholder="5.5"
                        value={formData.currentExperience}
                        onChange={handleChange}
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
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                      {errors.currentExperience && (
                        <div className="text-danger mt-2" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span>⚠</span> {errors.currentExperience}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="form-label fw-bold mb-3" style={{
                        fontSize: '0.95rem',
                        color: '#2c3e50',
                        letterSpacing: '0.3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaMoneyBillWave size={16} style={{ color: '#667eea' }} />
                        Annual Salary (CTC)
                      </label>
                      <input
                        type="number"
                        className={`form-control form-control-lg ${errors.salary ? 'is-invalid' : ''}`}
                        name="salary"
                        placeholder="600000"
                        value={formData.salary}
                        onChange={handleChange}
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
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                      {errors.salary && (
                        <div className="text-danger mt-2" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span>⚠</span> {errors.salary}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group mb-4">
                      <label className="form-label fw-bold mb-3" style={{
                        fontSize: '0.95rem',
                        color: '#2c3e50',
                        letterSpacing: '0.3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaCalendarAlt size={16} style={{ color: '#667eea' }} />
                        Date of Joining
                      </label>
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
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="col-12 mt-5 pt-4 border-top">
                    <div className="d-flex gap-3 justify-content-end">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg px-4 py-3"
                        onClick={() => navigate('/admin/dashboard')}
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
                        disabled={loading}
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
                            <FaSave /> Create HR Account
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
                icon={<FaUserTie />}
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                isDark={currentTheme === 'dark'}
              />

              <InputField
                icon={<FaUserTie />}
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                isDark={currentTheme === 'dark'}
              />

              <InputField
                icon={<FaBuilding />}
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                error={errors.department}
                isDark={currentTheme === 'dark'}
              />

              <InputField
                icon={<FaBriefcase />}
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                error={errors.designation}
                isDark={currentTheme === 'dark'}
              />

              <InputField
                icon={<FaEnvelope />}
                label="Email"
                name="personalEmail"
                value={formData.personalEmail}
                onChange={handleChange}
                error={errors.personalEmail}
                isDark={currentTheme === 'dark'}
              />

              <InputField
                icon={<FaPhone />}
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                isDark={currentTheme === 'dark'}
              />

              <InputField
                label="Current Band"
                name="currentBand"
                value={formData.currentBand}
                onChange={handleChange}
                isDark={currentTheme === 'dark'}
              />

              <InputField
                label="Experience (Years)"
                name="currentExperience"
                value={formData.currentExperience}
                onChange={handleChange}
                isDark={currentTheme === 'dark'}
                type="number"
              />

              <InputField
                label="Salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                isDark={currentTheme === 'dark'}
                type="number"
              />

              <InputField
                label="Joining Date"
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
                isDark={currentTheme === 'dark'}
              />
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t" style={{
              borderColor: currentTheme === 'dark'
                ? '#334155'
                : theme.colors.borderLight
            }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all"
                style={{
                  background: currentTheme === 'dark'
                    ? '#334155'
                    : '#e2e8f0',
                  color: currentTheme === 'dark'
                    ? '#f1f5f9'
                    : theme.colors.textDark,
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = currentTheme === 'dark'
                    ? '#475569'
                    : '#cbd5e0';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = currentTheme === 'dark'
                    ? '#334155'
                    : '#e2e8f0';
                }}
              >
                <FaTimes size={16} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all"
                style={{
                  background: theme.colors.primary,
                  color: '#ffffff',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: `0 4px 15px rgba(99, 50, 153, 0.3)`
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = theme.colors.primaryDark;
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = theme.colors.primary;
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <FaSave size={16} />
                {loading ? "Creating..." : "Create HR"}
              </button>
            </div>
          </form>
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
  error,
  icon,
  type = "text",
  isDark,
}) => (
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

export default CreateHR;
