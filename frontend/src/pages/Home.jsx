import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChefHat, X, Flame } from 'lucide-react';

const Home = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [craving, setCraving] = useState('');
  const [location, setLocation] = useState('Global');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddIngredient = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!ingredients.includes(inputValue.trim())) {
        setIngredients([...ingredients, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeIngredient = (ing) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const handleSubmit = async () => {
    let finalIngredients = [...ingredients];
    if (inputValue.trim()) {
      const leftover = inputValue.split(/[\s,]+/).filter(i => i.trim());
      leftover.forEach(item => {
        if (!finalIngredients.includes(item)) finalIngredients.push(item);
      });
      setIngredients(finalIngredients);
      setInputValue('');
    }

    if (finalIngredients.length === 0) {
      alert("Please toss in at least one ingredient!");
      return;
    }
    
    setIsLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const response = await axios.post('http://localhost:5000/api/recipes/generate-recipes', 
        { ingredients: finalIngredients, craving, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      navigate('/results', { state: { recipes: response.data, ingredients: finalIngredients } });
    } catch (error) {
      console.error(error);
      alert('Failed to generate magic. Please try again.');
      setIsLoading(false);
    }
  };

  const cravingsList = [
    { id: 'spicy', label: 'SPICY', icon: '🌶️', color: 'rgba(255, 71, 87, 0.15)', border: 'var(--primary-red)' },
    { id: 'sweet', label: 'SWEET', icon: '🍰', color: 'rgba(254, 202, 87, 0.15)', border: 'var(--accent-yellow)' },
    { id: 'comfort', label: 'COMFORT', icon: '🍲', color: 'rgba(29, 209, 161, 0.15)', border: 'var(--accent-green)' },
    { id: 'street food', label: 'STREET', icon: '🌮', color: 'rgba(72, 219, 251, 0.15)', border: 'var(--accent-blue)' },
    { id: 'healthy', label: 'HEALTHY', icon: '🥗', color: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255,255,255,0.4)' }
  ];

  return (
    <div className="container fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '3rem 0', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ flex: '1 1 400px' }} className="fade-in stagger-1">
          <div style={{ 
            display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(255, 71, 87, 0.1)', 
            border: '1px solid rgba(255, 71, 87, 0.2)', borderRadius: '99px', color: 'var(--primary-red)',
            fontWeight: '600', fontSize: '0.9rem', marginBottom: '1.5rem'
          }}>
            AI-Powered Culinary Magic ✨
          </div>
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
            Got ingredients?<br/>
            <span className="text-gradient">Let's cook magic!</span>
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.2rem', maxWidth: '450px', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Turn your everyday pantry items into five-star masterpieces with a dash of masala and our intelligent recipe engine.
          </p>
          <button className="btn btn-primary" style={{ width: 'auto', padding: '1.2rem 3rem', fontSize: '1.1rem' }} onClick={() => document.getElementById('cooking-station').scrollIntoView({ behavior: 'smooth' })}>
            Start Cooking <ChefHat size={20} style={{marginLeft: '8px'}} />
          </button>
        </div>
        <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }} className="fade-in stagger-2">
          <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(255,71,87,0.15) 0%, transparent 70%)', zIndex: 0 }} />
            <img 
              src="https://images.unsplash.com/photo-1544025162-811114210d51?q=80&w=800&auto=format&fit=crop" 
              alt="Premium Indian Cuisine" 
              className="anim-float glass-card"
              style={{ borderRadius: 'var(--border-radius-lg)', width: '100%', padding: '0.8rem', position: 'relative', zIndex: 1, objectFit: 'cover', height: '400px' }} 
            />
          </div>
        </div>
      </div>

      <div id="cooking-station" className="glass-card fade-in stagger-3" style={{ 
        padding: '3.5rem', 
        position: 'relative',
        marginTop: '4rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2.5rem' }}>
          <div style={{ background: 'rgba(255, 71, 87, 0.1)', padding: '1rem', borderRadius: '50%' }}>
            <ChefHat color="var(--primary-red)" size={28} />
          </div>
          <h2 style={{ fontSize: '1.8rem' }}>The Cooking Station</h2>
        </div>

        <div className="input-group">
          <label className="input-label">1. Toss in your ingredients</label>
          <div style={{ 
            display: 'flex', flexWrap: 'wrap', gap: '0.6rem', 
            background: 'rgba(0,0,0,0.2)', padding: '1.2rem', 
            borderRadius: 'var(--border-radius-md)', minHeight: '70px', alignItems: 'center',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            {ingredients.map((ing, idx) => (
              <span key={idx} style={{
                background: 'linear-gradient(135deg, var(--primary-red) 0%, #ff6b81 100%)', color: 'white', 
                padding: '0.5rem 1rem', borderRadius: '99px',
                display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: '600',
                boxShadow: '0 4px 10px rgba(255, 71, 87, 0.3)'
              }}>
                {ing} 
                <X size={16} style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => removeIngredient(ing)} />
              </span>
            ))}
            <input 
              type="text" 
              placeholder={ingredients.length === 0 ? "e.g. Chicken, Onion, Tomatoes (Press Enter)" : "+ add more"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleAddIngredient}
              style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, minWidth: '300px', fontFamily: 'var(--font-family)', fontSize: '1.1rem', color: 'var(--text-main)', padding: '0.5rem' }}
            />
          </div>
        </div>

        <div className="input-group" style={{ marginTop: '3rem' }}>
          <label className="input-label">2. What's the vibe today?</label>
          <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
            {cravingsList.map((c) => (
              <button 
                key={c.id}
                onClick={() => setCraving(c.id === craving ? '' : c.id)}
                className="glass-card"
                style={{
                  background: craving === c.id ? c.color : 'rgba(255,255,255,0.02)',
                  borderColor: craving === c.id ? c.border : 'rgba(255,255,255,0.08)',
                  padding: '1.5rem 1rem', borderRadius: 'var(--border-radius-md)', 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem',
                  cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', width: '130px',
                  transform: craving === c.id ? 'translateY(-5px) scale(1.02)' : 'none',
                }}
              >
                <span style={{ fontSize: '2.5rem', filter: craving === c.id ? 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' : 'none' }}>{c.icon}</span>
                <span style={{ fontWeight: '700', fontSize: '0.85rem', color: craving === c.id ? '#fff' : 'var(--text-light)', letterSpacing: '1px' }}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="input-group" style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <label className="input-label" style={{marginBottom: '0.4rem'}}>3. Regional Tweaks</label>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Tune the masala to match your local palette.</p>
          </div>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '99px', overflow: 'hidden', padding: '0.3rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            {['Global', 'North Indian', 'South Indian', 'Bengali'].map((loc) => (
              <button 
                key={loc}
                onClick={() => setLocation(loc)}
                style={{
                  background: location === loc ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: 'none', padding: '0.8rem 1.5rem', borderRadius: '99px',
                  fontWeight: location === loc ? '700' : '500',
                  color: location === loc ? '#fff' : 'var(--text-light)',
                  cursor: 'pointer', transition: 'all 0.3s ease',
                  boxShadow: location === loc ? '0 4px 10px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
          <button onClick={handleSubmit} disabled={isLoading} className="btn btn-primary" style={{ padding: '1.2rem 4rem', fontSize: '1.2rem', minWidth: '250px' }}>
            {isLoading ? (
              <span className="flex-center" style={{gap: '10px'}}><Flame className="anim-float" size={24}/> Cooking...</span>
            ) : (
              <span className="flex-center" style={{gap: '10px'}}><Flame size={24}/> Ignite the Wok</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
