import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [phrase, setPhrase] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('en-us'); // Example default language

  useEffect(() => {
    const fetchPhrase = async () => {
      try {
        // Make a GET request to the API
        const response = await axios.get('https://quotes15.p.rapidapi.com/quotes/random/', {
          params: { language_code: 'en' },
          headers: {
            'X-RapidAPI-Key': 'bfa8d87fe1msh91115c7e4910f77p1fea22jsnf9b0afc4b10b',  // Replace with your RapidAPI key
            'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
          }
        });
    
        console.log(response);  // Handle the response here
        // Set the phrase data to state
        setPhrase(response.data.content);
      } catch (err) {
        setError('Failed to load the motivational phrase.');
        console.error(err);
      }
    };

    fetchPhrase();
  }, [language]); // Re-run if `language` changes

  return (
    <div>
      <h1>Motivational Phrase</h1>
      {error && <p>{error}</p>}
      {phrase ? <p>{phrase}</p> : <p>Loading...</p>}
    </div>
  );
}
