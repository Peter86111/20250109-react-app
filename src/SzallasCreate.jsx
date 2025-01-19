import React, {useState, useRef, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import './SzallasList.css';

export const SzallasCreate = () => {
    const navigate = useNavigate();
    const vantaRef = useRef(null);
    const [data, setData] = useState({
        "name": '',
        "hostname": '',
        "location": '',
        "price": 0,
        "minimum_nights": '',
    });
    useEffect(()=> {
    const vantaEffect = NET ({
        el: vantaRef.current,
        THREE,
        color: 0xff0000, //karácsonyi piros
        backgroundColor: 0x001f3f, //mélykék háttér
        points: 12.0,
        maxDistance: 20.0,
        spacing: 18.0,
    });
    return() => {
        if  (vantaEffect) vantaEffect.destroy();
    };
}, []);

const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('jwt');
    if(!token) {
        throw new Error('Nem található JWT token!');
    }
    axios.post(`https://szallasjwt.sulla.hu/data`, data,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    setData(token)
    
    .then(() => {
        navigate("/SzallasList");
    })
    .catch(error => {
        console.log('Hiba történt: ', error);
    });

    const handleInputChange = event => {
        const { name, value } = event.target;
        setData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

return (
    <div ref={vantaRef} id="vanta-container" style={({minHeight:"100vh"})}>
    <div className="p-5 content bg-whitesmoke text-center">
        <h2 style={{color:"lightgreen"}}>Egy szállás létrehozása</h2>
        <form onSubmit={handleSubmit}>
            
            <div className="form-group row pb-3">
                <label className="col-sm-3 col-form-label">A szállás neve:</label>
                <div className="col-sm-9">
                    <input type="text" name="name" className="form-control" onChange={handleInputChange}/>
                </div>
            </div>
            <div className="form-group row pb-3">
                <label className="col-sm-3 col-form-label">A szállásadó neve:</label>
                <div className="col-sm-9">
                    <input type="text" name="hostname" className="form-control" onChange={handleInputChange}/>
                </div>
              
            </div>
            <div className="form-group row pb-3">
                <label className="col-sm-3 col-form-label">A szállás helyszíne:</label>
                <div className="col-sm-9">
                    <input type="text" name="location" className="form-control" onChange={handleInputChange}/>
                </div>
            </div>
            <div className="form-group row pb-3">
                <label className="col-sm-3 col-form-label">A szállás ára:</label>
                <div className="col-sm-9">
                    <input type="number" name="price" className="form-control" onChange={handleInputChange}/>
                </div>
            </div>
            <div className="form-group row pb-3">
                <label className="col-sm-3 col-form-label">Minimum foglalható éjszakák száma:</label>
                <div className="col-sm-9">
                    <input type="number" name="minimum_nights" className="form-control" onChange={handleInputChange}/>
                </div>
            </div>
            <Link to={"/SzallasList"}>
<i className="bi bi-text-paragraph fs-6 btn btn-primary">
    </i></Link>&nbsp;&nbsp;&nbsp;
            <button type="submit" className="btn btn-success fs-6">Küldés</button>
            
        </form>
    </div>
    </div>
    );
}};