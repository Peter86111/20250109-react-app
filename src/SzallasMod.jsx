import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

export const SzallasMod = () => {
    const [szallas, setSzallas] = useState({});
    const [error, setError] = useState('');
    const vantaRef = useRef(null);
    const params = useParams();
    const id = params.id;
    const navigate = useNavigate();
    const [data, setData] = useState({
        "name": '',
        "hostname": '',
        "location": '',
        "price": 0,
        "minimum_nights": ''
    });

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
                console.error("Hiba az adatok lekérése során: Az adatok lekérése sikertelen. Lehet, hogy nem vagy bejelentkezve? ");
            }
        }
        fetchData();
    }, [id]);

    useEffect(() => {
        const vantaEffect = NET({
            el: vantaRef.current,
            THREE,
            color: 0xff0000, // Karácsonyi piros
            backgroundColor: 0x001f3f, // Mélykék háttér
            points: 12.0,
            maxDistance: 20.0,
            spacing: 18.0,
        });

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, []);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleMod = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt');
        if (!token) {
            throw new Error('Nem található JWT token!');
        }
        fetch(`https://szallasjwt.sulla.hu/data/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hiba történt a kérés feldolgozása közben');
                }
                return response.json();
            })
            .then(() => {
                navigate("/SzallasList");
            })
            .catch(error => {
                console.log("hiba:", error);
            });
    };

    return (
        <div ref={vantaRef} style={{ minHeight: "100vh", color: "white" }} className="p-5 m-auto text-center content bg-lavender">
            <div>
                <h2>Szállás módosítása</h2>
                    <div className="card col-sm3 m-1 p-2">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group row pb-3">
                                <label className="col-sm-3 col-form-label">Szállást adó neve:</label>
                                <div className="col-sm-9">
                                    <input type="text" name="name" className="form-control" defaultValue={data.name} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="form-group row pb-3">
                                <label className="col-sm-3 col-form-label">Szállásadó neve:</label>
                                <div className="col-sm-9">
                                    <input type="text" name="hostname" className="form-control" defaultValue={data.hostname} onChange={handleInputChange} />
                                </div>
                            <div className="form-group row pb-3">
                                <label className="col-sm-3 col-form-label">Szállás helye:</label>
                                <div className="col-sm-9">
                                    <input type="date" name="location" className="form-control" defaultValue={data.location} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="form-group row pb-3">
                                <label className="col-sm-3 col-form-label">Szállás ára:</label>
                                <div className="col-sm-9">
                                    <input type="number" name="price" className="form-control" value={data.price} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="form-group row pb-3">
                                <label className="col-sm-3 col-form-label">Minimum foglalható éjszaka:</label>
                                <div className="col-sm-9">
                                    <input type="text" name="minimum_night" className="form-control" defaultValue={data.minimum_night} onChange={handleInputChange} />
                                </div>
                            </div>
                            </div>
                            <Link to="/" className="bi bi-backspace-fill fs-5 btn btn-danger"> Vissza</Link>&nbsp;&nbsp;&nbsp;
                            <button type="submit" className="bi bi-send btn btn-success fs-5"> Küldés</button>
                        </form>
                        <div></div>
                        </div>
                    </div>
                </div>
            )
}