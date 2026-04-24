import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User as UserIcon, ChefHat, KeySquare } from 'lucide-react';

const Signup = () => {
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!handle || !email || !password) {
      setError('Please fill in all fields to join the squad.');
      return;
    }
    
    const result = await signup(handle, email, password, handle);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-layout flex-center">
      <div className="bg-element anim-float" style={{ top: '15%', left: '15%', fontSize: '4rem' }}>🍲</div>
      <div className="bg-element anim-float" style={{ bottom: '15%', right: '10%', fontSize: '4rem', animationDelay: '1.5s' }}>🌿</div>

      <div className="auth-form-container fade-in">
        <h1 className="logo text-gradient" style={{position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)'}}>MasalaMatch</h1>
        
        <div className="flex-center" style={{ marginBottom: '1rem', backgroundColor: '#d32f2f', width: '50px', height: '50px', borderRadius: '50%', margin: '0 auto 1.5rem auto' }}>
          <ChefHat size={24} color="#fff" />
        </div>
        
        <h2 style={{ marginBottom: '0.5rem' }}>Join the Kitchen<br/>Squad!</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Ready to spice up your culinary journey?</p>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">CHOOSE YOUR CHEF HANDLE</label>
            <div style={{ position: 'relative' }}>
              <UserIcon size={20} color="#a89f8a" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. SpiceKing99" 
                style={{ paddingLeft: '3rem' }}
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">CHEF ID (EMAIL)</label>
            <div style={{ position: 'relative' }}>
              <ChefHat size={20} color="#a89f8a" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                className="input-field" 
                placeholder="chef@masalamatch.com" 
                style={{ paddingLeft: '3rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label className="input-label">CREATE SECRET RECIPE (PASSWORD)</label>
            <div style={{ position: 'relative' }}>
              <KeySquare size={20} color="#a89f8a" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                className="input-field" 
                placeholder="Min. 8 spice characters" 
                style={{ paddingLeft: '3rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Start Your Journey 🚀
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
          Already a chef? <Link to="/login" className="link-text">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
