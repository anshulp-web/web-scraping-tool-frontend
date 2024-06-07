import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, useParams } from 'react-router-dom';

function CompanyDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/companies/${id}`
      );
      console.log(response);
      setCompany(response.data);
    };
    fetchCompanyDetails();
  }, [id]);

  if (!company) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <NavLink
          className="link"
          style={{ textDecoration: 'none', marginRight: '10px' }}
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className="link"
          style={{ textDecoration: 'none', marginRight: '10px' }}
          to="/companies"
        >
          Companies List
        </NavLink>
      </div>
      <h1>{company.name}</h1>
      <img
        src={`${process.env.REACT_APP_API}/${company.screenshot}`}
        alt={`${company.name} screenshot`}
        style={{ maxWidth: '100%' }}
      />

      <hr style={{ marginTop: '20px' }} />
      <p>
        <b>Description</b> : {company.description}
      </p>
      <p>
        <strong>Address:</strong> {company.address}
      </p>
      <p>
        <strong>Phone:</strong> {company.phone}
      </p>
      <p>
        <strong>Email:</strong> {company.email}
      </p>
      <p>
        <strong>Facebook:</strong>{' '}
        <a href={company.facebook}>{company.facebook}</a>
      </p>
      <p>
        <strong>LinkedIn:</strong>{' '}
        <a href={company.linkedin}>{company.linkedin}</a>
      </p>
      <p>
        <strong>Twitter:</strong>{' '}
        <a href={company.twitter}>{company.twitter}</a>
      </p>
      <p>
        <strong>Instagram:</strong>{' '}
        <a href={company.instagram}>{company.instagram}</a>
      </p>
    </div>
  );
}

export default CompanyDetails;
