import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-svg-core/styles.css';
import styles from './css/auth.module.css';
import icon from "./img/icons/google.png";

const AuthPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    if (registerBtn && loginBtn) {
      registerBtn.addEventListener('click', () => {
          container.classList.add(styles.active);
      });

      loginBtn.addEventListener('click', () => {
          container.classList.remove(styles.active);
      });

      return () => {
        registerBtn.removeEventListener('click', () => {
          container.classList.add(styles.active);
        });

        loginBtn.removeEventListener('click', () => {
          container.classList.remove(styles.active);
        });
      };
    }
  }, []);

  const handleSignIn = (e) => {
    e.preventDefault();
    setLoginError('');
    axios.post("http://localhost:3001/auth/login", { email, password })
        .then(result => {
            if (result.data.status === "Success") {
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('userData', JSON.stringify({
                    name: result.data.user.name,
                    email: result.data.user.email,
                    rating: result.data.user.rating
                }));
                axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;
                navigate("/home");
            }
        })
        .catch(err => {
            console.error("Login error:", err);
            setLoginError(err.response?.data || 'An error occurred during login');
        });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/auth/register", { name, email, password })
      .then(result => {
        console.log("Registration response:", result.data); // Add this log
        if (result.data) {
          const userData = {
              name: result.data.user.name,
              email: result.data.user.email,
              rating: result.data.user.rating
          };
          console.log("Storing userData:", userData); // Add this log
          localStorage.setItem('token', result.data.token);
          localStorage.setItem('userData', JSON.stringify(userData));
          axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;
          navigate("/home");
        }
      })
      .catch(err => {
        console.error("Registration error:", err.response?.data);
        alert("Error during registration. Please check console.");
      });
  };
  
  return (
    <div className={styles.container} id="container">
        <div className={`${styles['form-container']} ${styles['sign-up']}`}>
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <div className={styles['social-icons']}>
              <button className={styles['google-button']} type="button">
                <img className={styles['google-icon']} src={icon} alt="Google Icon" />
                Sign up with Google
              </button>
            </div>
            <span>OR</span>
            <input 
              type="text" 
              placeholder="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className={`${styles['form-container']} ${styles['sign-in']}`}>
        <form onSubmit={handleSignIn}>
          <h1>Sign In</h1>
          <div className={styles['social-icons']}>
              <button className={styles['google-button']} type="button">
                  <img className={styles['google-icon']} src={icon} alt="Google Icon" />
                  Log In with Google
              </button>
          </div>
          <span>OR</span>
          <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
          />
          <p className={styles['forgot-pass']}>Forget Your Password?</p>
          <button type="submit">Sign In</button>
          {loginError && <p style={{ color: '#ff3333', fontSize: '12px', marginTop: '10px' }}>{loginError}</p>}
        </form>
        </div>
      <div className={styles['toggle-container']}>
        <div className={styles.toggle}>
          <div className={`${styles['toggle-panel']} ${styles['toggle-left']}`}>
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of our site's features</p>
            <button className={styles.hidden} id="login">Sign In</button>
          </div>
          <div className={`${styles['toggle-panel']} ${styles['toggle-right']}`}>
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all of our site's features</p>
            <button className={styles.hidden} id="register">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
