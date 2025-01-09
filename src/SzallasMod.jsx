import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export const SzallasMod = () => {
    const params = useParams();
    const id = params.Id;
    const navigate = useNavigate();
    const [data, setData] = useState({
        "name": '',
        "hostname": '',
        "location": '',
        "price": 0,
        "minimum_night": ''
});

    useEffect(() => {
        const fetchData = async () => {
            try { 
                const valasz = await axios.get("https://szallasjwt.sulla.hu/data/" + id);
                setData(valasz.data);
            }
            catch (error) {
                console.log("Hiba a lekérdezésben: ", error);
            }
        }   
        fetchData();
    }, [id]);

const handleInputChange = event => {
    const { name, value } = event.target;
    setData(prevState => ({
        ...prevState,
        [name]: value
    }));
};

const handleSubmit = event =>{
    event.preventDefault();
    fetch(`https://szallasjwt.sulla.hu/data/` + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // a chess objektumot JSON formátumba alakítjuk
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Hiba történt a kérés feldolgozása közben');
      }
      return response.json(); // ha a válasz sikeres, JSON-ra alakítjuk
    })
    .then(() => {
      navigate("/"); // ha a kérés sikeres, navigálunk
    })
    .catch(error => {
      console.log("hiba:", error);
    });
  };
return (
    <div className="p-5 m-auto text-center content bg-lavender">
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