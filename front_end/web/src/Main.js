import React, { useState } from 'react';
import UnifiedSearch from './Search';
import uiuc_img from './img/uiuc.jpg';
import GPACalculator from './GPACalculator';

const Main = () => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <main className="App-main">
      <div className="welcome-text">Welcome to UIUC</div>
      <UnifiedSearch placeholder="Search for course or professor" setSearchResults={setSearchResults} />
      <img src={uiuc_img} alt="Main visual" />
      <GPACalculator />
      <div className="search-results">
        {searchResults.length > 0 && (
          <ul>
            {searchResults.map((result, idx) => (
              <li key={idx}>
                {result.subject} {result.number}: {result.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default Main;