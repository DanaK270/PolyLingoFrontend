import React, { useState } from 'react';
import axios from 'axios';

const Translate = () => {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('fr');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const handleLanguageChange = (event, type) => {
    const selectedLang = event.target.value;
    if (type === 'source') {
      setSourceLang(selectedLang);
    } else if (type === 'target') {
      setTargetLang(selectedLang);
    }
  };

  const handleTextChange = (event) => {
    setInputText(event.target.value);
  };

  const handleTranslate = async () => {
    try {
      const response = await axios.post('http://localhost:3001/translate/translate', {
        text: inputText,
        sourceLang,
        targetLang,
      });
      setTranslatedText(response.data.translation.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  return (
    <div className="translate-container">
      <h1>Translation</h1>

      <div className="language-selectors">
        <div className="source-lang">
          <label>Source Language:</label>
          <select value={sourceLang} onChange={(e) => handleLanguageChange(e, 'source')}>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            {/* Add more languages as needed */}
          </select>
        </div>

        <div className="target-lang">
          <label>Target Language:</label>
          <select value={targetLang} onChange={(e) => handleLanguageChange(e, 'target')}>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            {/* Add more languages as needed */}
          </select>
        </div>
      </div>

      <textarea value={inputText} onChange={handleTextChange} placeholder="Enter text to translate..." />

      <button onClick={handleTranslate}>Translate</button>

      {translatedText && (
        <div>
          <h3>Translated Text:</h3>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default Translate;
