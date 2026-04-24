import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ChefHat, KeySquare } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both your Chef ID and Secret Recipe.');
      return;
    }
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-layout flex-center">
      <div className="bg-element anim-float" style={{ top: '20%', left: '10%', fontSize: '4rem' }}>🍳</div>
      <div className="bg-element anim-float" style={{ bottom: '20%', right: '15%', fontSize: '4rem', animationDelay: '1s' }}>🌶️</div>
      <div className="bg-element anim-float" style={{ top: '15%', right: '20%', fontSize: '3rem', animationDelay: '2s' }}>🔪</div>

      <div className="auth-form-container fade-in">
        <h1 className="logo text-gradient" style={{position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)'}}>MasalaMatch</h1>
        
        <div className="flex-center" style={{ marginBottom: '1rem', backgroundColor: '#ffca28', width: '50px', height: '50px', borderRadius: '50%', margin: '0 auto 1.5rem auto' }}>
          <ChefHat size={24} color="#d32f2f" />
        </div>
        
        <h2 style={{ marginBottom: '0.5rem' }}>Welcome Back,<br/>Chef!</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Ready to spice up your kitchen?</p>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">CHEF IDENTITY</label>
            <div style={{ position: 'relative' }}>
              <ChefHat size={20} color="#a89f8a" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                className="input-field" 
                placeholder="Enter your chef ID (email)" 
                style={{ paddingLeft: '3rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label className="input-label">SECRET RECIPE</label>
            <div style={{ position: 'relative' }}>
              <KeySquare size={20} color="#a89f8a" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                className="input-field" 
                placeholder="Secret recipe (password)" 
                style={{ paddingLeft: '3rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
              <a href="#" className="link-text" style={{ fontSize: '0.85rem' }}>Forgot Password?</a>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            🔥 Let's Cook!
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
          New to the kitchen? <Link to="/signup" className="link-text">Join the kitchen squad</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
