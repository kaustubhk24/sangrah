import React, { useState, useEffect } from 'react';

function CounterPage() {
  const [currentCount, setCurrentCount] = useState(0);
  const [lifetimeCount, setLifetimeCount] = useState(() => {
    // Get stored lifetime count from localStorage
    return parseInt(localStorage.getItem('lifetimeCount') || '0');
  });

  useEffect(() => {
    // Update localStorage whenever lifetime count changes
    localStorage.setItem('lifetimeCount', lifetimeCount.toString());
  }, [lifetimeCount]);

  const handleIncrement = () => {
    setCurrentCount(prev => prev + 1);
    setLifetimeCount(prev => prev + 1);
  };

  const resetCurrent = () => {
    setCurrentCount(0);
  };

  const resetLifetime = () => {
    setLifetimeCount(0);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ marginBottom: '2rem' }}>
               <textarea
          placeholder="राधे"
          style={{
            width: '90%',
            maxWidth: '500px',
            padding: '1rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            resize: 'none',        // Disable manual resize
            overflow: 'hidden',    // Hide scrollbars
            boxSizing: 'border-box',
          }}
          rows={3}
/>
        <h2>आजीवन जप संख्या: {lifetimeCount}</h2>
        <h2>वर्तमान जप संख्या : {currentCount}</h2>
      </div>
      
<div style={{ 
  display: 'flex', 
  flexDirection: 'column',  // Add this
  gap: '1rem', 
  alignItems: 'center'      // Change justifyContent to alignItems
}}>        <button
          onClick={handleIncrement}
          style={{
            padding: '1rem 1rem',
            backgroundColor: '#25c2a0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',width: '300px',     // Fixed width - prevents size differences
          }}
        >
          जप करा  +
        </button>
        <button
          onClick={resetCurrent}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#e83e8c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',width: '300px',     // Fixed width - prevents size differences
          }}
        >
          रीसेट वर्तमान जप संख्या
        </button>
        <button
          onClick={resetLifetime}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '300px',     // Fixed width - prevents size differences
          }}
        >
          रीसेट आजीवन जप संख्या
        </button>
      </div>
    </div>
  );
}

export default CounterPage;