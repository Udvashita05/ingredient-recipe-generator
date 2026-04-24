import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlayCircle, ChefHat, Sparkles } from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recipes, ingredients } = location.state || { recipes: [], ingredients: [] };

  if (!recipes || recipes.length === 0) {
    return (
      <div className="container flex-center fade-in" style={{ height: '60vh', flexDirection: 'column' }}>
        <div style={{ background: 'rgba(255, 71, 87, 0.1)', padding: '2rem', borderRadius: '50%', marginBottom: '2rem' }}>
          <ChefHat size={64} color="var(--primary-red)" />
        </div>
        <h2>No recipes could be conjured!</h2>
        <p style={{ color: 'var(--text-light)', marginTop: '1rem', marginBottom: '2rem' }}>Try tossing in different ingredients.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')} style={{ width: 'auto' }}>
          Back to Kitchen
        </button>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ paddingBottom: '5rem' }}>
      <div style={{ margin: '2rem 0 4rem 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'rgba(29, 209, 161, 0.1)', border: '1px solid rgba(29, 209, 161, 0.2)', borderRadius: '99px', color: 'var(--accent-green)', fontWeight: '600', marginBottom: '1rem' }}>
          <Sparkles size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-top' }}/>
          Match Complete
        </div>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Your Feast is Ready</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          We've handpicked these phenomenal dishes based on your pantry. The higher the match, the closer it is to what you have.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
        {recipes.map((recipe, idx) => {
          // Calculate a fun mock percentage if score isn't perfect, just for UI dazzle if needed
          const scorePercent = recipe.score ? Math.min(Math.round(recipe.score), 100) : 95;
          const matchColor = scorePercent > 80 ? 'var(--accent-green)' : (scorePercent > 50 ? 'var(--accent-yellow)' : 'var(--primary-red)');
          
          return (
            <div key={idx} className="glass-card stagger-1" style={{ 
              padding: '1.5rem', 
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              animationDelay: `${idx * 0.15}s`
            }}>
              <div style={{ position: 'relative', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', height: '240px', marginBottom: '1.5rem' }}>
                <img src={recipe.imageUrl} alt={recipe.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="hover-zoom" />
                <div style={{ 
                  position: 'absolute', top: '15px', left: '15px', 
                  background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'white',
                  padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '700',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  {recipe.region}
                </div>
                {/* Score Indicator */}
                <div style={{ 
                  position: 'absolute', bottom: '15px', right: '15px', 
                  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', color: matchColor,
                  padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '800',
                  border: `1px solid ${matchColor}`, display: 'flex', alignItems: 'center', gap: '5px'
                }}>
                  {scorePercent}% Match
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem', flex: 1 }}>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', lineHeight: '1.2' }}>{recipe.name}</h3>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {recipe.ingredients.slice(0, 4).map((ing, i) => {
                    // Check if they had this ingredient
                    const isMatched = ingredients.some(userIng => ing.toLowerCase().includes(userIng.toLowerCase()));
                    return (
                      <span key={i} style={{ 
                        background: isMatched ? 'rgba(29, 209, 161, 0.15)' : 'rgba(255,255,255,0.05)', 
                        border: `1px solid ${isMatched ? 'rgba(29, 209, 161, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                        padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '500', 
                        color: isMatched ? 'var(--accent-green)' : 'var(--text-light)'
                      }}>
                        {ing}
                      </span>
                    )
                  })}
                  {recipe.ingredients.length > 4 && (
                    <span style={{ 
                      background: 'transparent', padding: '0.4rem 0.6rem', 
                      borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-light)'
                    }}>
                      +{recipe.ingredients.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                {recipe.video?.url ? (
                  <a href={recipe.video.url} target="_blank" rel="noopener noreferrer" className="btn" style={{ flex: 1, backgroundColor: 'rgba(255, 71, 87, 0.1)', color: 'var(--primary-red)', border: '1px solid rgba(255, 71, 87, 0.2)' }}>
                    <PlayCircle size={20} /> Watch
                  </a>
                ) : (
                  <button className="btn" disabled style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>
                    No Video
                  </button>
                )}
                <button className="btn btn-primary" style={{ flex: 1 }}>
                  Cook this
                </button>
              </div>
            </div>
          )
        })}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <button className="btn btn-outline" onClick={() => navigate('/')} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
          Toss another batch
        </button>
      </div>
    </div>
  );
};

export default Results;
