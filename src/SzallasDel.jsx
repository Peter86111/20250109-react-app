import React, { useState, useRef, useEffect } from 'react';
import { Link,useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

export const SzallasDel = () => {
    const params = useParams();
    const id = params.id;
    const navigate = useNavigate();
    const [szallas, setSzallas] = useState({});
    const [error, setError] = useState('');
    const vantaRef = useRef(null);
    
    useEffect(() => {
        const fetchSzallas = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    throw new Error('Nem található JWT token!');
                }
                const res = await axios.get(`https://szallasjwt.sulla.hu/data/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSzallas(res.data);
            } catch (error) {
                setError('Hiba történt az adat betöltése során.');
                console.error(error);
            }
        };
        fetchSzallas();
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

    
    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('jwt');
            if (!token) {
                throw new Error('Nem található JWT token!');
            }
            await axios.delete(`https://szallasjwt.sulla.hu/data/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate("/SzallasList");
        } catch (error) {
            setError('Hiba történt a törlés során.');
            console.error(error);
        }
    };

    return (
        <div ref={vantaRef} style={{ minHeight: "100vh", color: "white" }} className="p-5 m-auto text-center content bg-lavender" >
            <h2>Szállás törlése</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="card col-sm3 m-1 p-2">
                <p><b>Szállás neve:</b> {szallas.name}</p>
                <p><b>Szállásadó:</b> {szallas.hostname}</p>
                <p><b>Helyszín:</b> {szallas.location}</p>
                <p><b>Ár:</b> {szallas.price} Ft</p>
                <p><b>Minimum foglalható éjszakák:</b> {szallas.minimum_nights}</p>
                <form onSubmit={handleDelete}>
                    <Link to="/SzallasList" className="btn btn-warning">Vissza</Link>&nbsp;&nbsp;&nbsp;
                    <button type="submit" className="btn btn-danger">Törlés</button>
                </form>
            </div>
        </div>
    );
};