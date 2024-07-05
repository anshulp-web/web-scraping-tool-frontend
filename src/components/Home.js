import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
function Home() {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem('userId')) {
    const userid = localStorage.getItem('userId');
  } else {
    const userid = uuidv4();
    localStorage.setItem('userId', userid);
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      let userId = localStorage.getItem('userId');
      await axios.post(`${process.env.REACT_APP_API}/scrape`, { url, userId });
      alert('Company data scraped successfully!');
      setLoading(false);
      navigate('/companies');
    } catch (error) {
      alert('Website data not scraped because this website is protected');
       setLoading(false);
      navigate('/');
    }
  };

  return (
    <div>
      <div className="heading">
        <h1>Scraps Data from Website</h1>
        <NavLink
          className="link"
          to="/companies"
          style={{ textDecoration: 'none' }}
        >
          My Companies List
        </NavLink>
      </div>
      {loading ? (
        <>
          <div>
            <div className="loader">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL"
              required
            />
            <button type="submit">Scrape</button>
          </form>
          <p
            style={{
              textAlign: 'center',
              marginTop: '50px',
              letterSpacing: '2px',
              lineHeight: '30px',
            }}
          >
            Enter website url and find that websites information like social
            media links and description and also get screen shot of that
            website. Make a list of websites information and download in excel
            file.
          </p>
        </>
      )}
    </div>
  );
}

export default Home;
