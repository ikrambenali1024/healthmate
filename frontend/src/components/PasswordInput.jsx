// components/PasswordInput.jsx
import { useState } from "react";

function PasswordInput({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder = "••••••••",
  showStrength = false,
  passwordStrength = "",
  disabled = false,
  required = true
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="input-wrapper" style={{ position: 'relative' }}>
        <span className="input-icon">🔒</span>
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          style={{ 
            opacity: disabled ? 0.7 : 1,
            paddingRight: '40px'
          }}
        />
        <span 
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            fontSize: '20px',
            userSelect: 'none',
            opacity: 0.6,
            transition: 'opacity 0.2s',
            zIndex: 2
          }}
          onMouseEnter={(e) => e.target.style.opacity = 1}
          onMouseLeave={(e) => e.target.style.opacity = 0.6}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </span>
      </div>
      {showStrength && (
        <div className="password-strength">
          <div className={`strength-bar ${passwordStrength}`}></div>
        </div>
      )}
    </div>
  );
}

export default PasswordInput;