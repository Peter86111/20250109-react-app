import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const SzallasList = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () =>{
            try {
                const token = localStorage.getItem('jwt');
                if(!token) {
                    throw new Error('Nem található JWT token!');
                }
                const valasz = await axios.get('https://szallasjwt.sulla.hu/data', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setData(valasz.data);
            }
            catch(error) {
                setError('Az adatok lekérése sikertelen. Lehet, hogy nem vagy bejelentkezve?');
                console.error("Hiba az adatok lekérése során: ", error);
            }
        }
        fetchData();
    }, []);
    return (
        <div>
        <h2>Szállások listája</h2>
        {error && <p style={{ color: 'red'}}> {error} </p>}
        {data.length>0 ? (
          <ul> 
          { data.map((item) => (
          <li key={item.id}>{item.name} - {item.hostname} - {item.location} - {item.price} - {item.minimum_nights}
            <Link to={"/data/" + item.id}><i className="bi bi-text-paragraph fs-6 btn btn-primary"></i></Link>&nbsp;&nbsp;&nbsp;
            <Link to={"/data-mod/" + item.id}><i className="bi bi-pencil-square fs-6 btn btn-warning"></i></Link>&nbsp;&nbsp;&nbsp;
            <Link to={"/data-del/" + item.id}><i className="bi bi-trash3 fs-6 btn btn-danger"></i></Link><br /><br />
          </li>
        ))}
        </ul> ) : ( <p>Nem találhatók az adatok!</p>)
    } 
    </div>
    );
}