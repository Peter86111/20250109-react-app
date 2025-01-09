import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export const SzallasSingle = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        const fetchData = async () =>{
            try {
                const token = localStorage.getItem('jwt');
                if(!token) {
                    throw new Error('Nem található JWT token!');
                }
                const valasz = await axios.get('https://szallasjwt.sulla.hu/data/' + id, {
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
    }, [id]);
    return (
        <div>
        <h2>Egy szállás adatai</h2>
        {error && <p style={{ color: 'red'}}> {error} </p>}
        { data ? (
          <ul>
          <li key={data.id}>{data.name} - {data.hostname} - {data.location} - {data.price} - {data.minimum_nights}
            <Link to={"/data/"}><i className="bi bi-text-backspace fs-6 btn btn-primary"></i></Link>&nbsp;&nbsp;&nbsp;
            <Link to={"/data-mod/" + data.id}><i className="bi bi-pencil-square fs-6 btn btn-warning"></i></Link>&nbsp;&nbsp;&nbsp;
            <Link to={"/data-del/" + data.id}><i className="bi bi-trash3 fs-6 btn btn-danger"></i></Link><br /><br />
          </li>
        </ul> ) : ( <p>Nem találhatók az adatok!</p>)
    } 
    </div>
    );
}