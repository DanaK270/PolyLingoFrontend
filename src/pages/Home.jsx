import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
    <>
    <div className='motivational'>
      <div className='greeting'>
        <h1>Hello! Welcome to PolyLingo</h1>
      </div>
   
    
      <h1>Motivational Phrase</h1>
      {error && <p>{error}</p>}
      {phrase ? <p>{phrase}</p> : <p>Loading...</p>}
    </div>
    <div class="parent-wrapper">
    <Link to="/sign-in" className="btn1"> {/* Changed button to Link */}
        <div className="wrapper1">
          <p className="text">Sign in</p>

    <div class="flower flower1">
      <div class="petal one"></div>
      <div class="petal two"></div>
      <div class="petal three"></div>
      <div class="petal four"></div>
    </div>
    <div class="flower flower2">
      <div class="petal one"></div>
      <div class="petal two"></div>
      <div class="petal three"></div>
      <div class="petal four"></div>
    </div>
    <div class="flower flower3">
      <div class="petal one"></div>
      <div class="petal two"></div>
      <div class="petal three"></div>
      <div class="petal four"></div>
    </div>
    <div class="flower flower4">
      <div class="petal one"></div>
      <div class="petal two"></div>
      <div class="petal three"></div>
      <div class="petal four"></div>
    </div>
    <div class="flower flower5">
      <div class="petal one"></div>
      <div class="petal two"></div>
      <div class="petal three"></div>
      <div class="petal four"></div>
    </div>
    <div class="flower flower6">
      <div class="petal one"></div>
      <div class="petal two"></div>
      <div class="petal three"></div>
      <div class="petal four"></div>
    </div>
  </div>
</Link>
<Link to="/register" className="btn"> {/* Changed button to Link */}
        <div className="wrapper">
          <p className="text">Register</p>

    <div class="flower flower1">
      <div class="petal one"></div>
      <div class="petal two"></div>
      <div class="petal three"></div>
      <div class="petal four"></div>
    </div>
    <div class="flower flower2">
      <div class="petal one"></div>
      <div class="petal two"></div>
      <div class="petal three"></div>
      <div class="petal four"></div>
    </div>
    <div class="flower flower3">
      <div class="petal one"></div>
      <div class="petal two"></div>
      <div class="petal three"></div>
      <div class="petal four"></div>
    </div>
    <div class="flower flower4">
      <div class="petal one"></div>
      <div class="petal two"></div>
      <div class="petal three"></div>
      <div class="petal four"></div>
    </div>
    <div class="flower flower5">
      <div class="petal one"></div>
      <div class="petal two"></div>
      <div class="petal three"></div>
      <div class="petal four"></div>
    </div>
    <div class="flower flower6">
      <div class="petal one"></div>
      <div class="petal two"></div>
      <div class="petal three"></div>
      <div class="petal four"></div>
    </div>
  </div>
</Link>
</div>

   
    </>
  );
}
