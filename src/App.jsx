import React, { useEffect, useState } from 'react';

const limit = 50;
const maxPokemonGen8 = 898;

const getSpriteUrl = (name) =>
  `https://img.pokemondb.net/sprites/home/normal/${name}.png`;

function App() {
  const [offset, setOffset] = useState(0);
  const [pokemonList, setPokemonList] = useState([]);
  const [favoritos, setFavoritos] = useState(() => JSON.parse(localStorage.getItem('favoritos')) || []);
  const [capturados, setCapturados] = useState(() => JSON.parse(localStorage.getItem('capturados')) || []);
  const [busqueda, setBusqueda] = useState('');
  const [pokemonBuscado, setPokemonBuscado] = useState(null);
  const [seccion, setSeccion] = useState('listado');

  useEffect(() => {
    if (seccion === 'listado') cargarMasPokemon();
  }, []);

  const cargarMasPokemon = () => {
    if (offset >= maxPokemonGen8) {
      alert('No hay más Pokémon para cargar.');
      return;
    }

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemonList((prev) => [...prev, ...data.results]);
        setOffset((prev) => prev + limit);
      });
  };

  const manejarBusqueda = () => {
    if (!busqueda.trim()) {
      alert('Escribe un nombre de Pokémon');
      return;
    }
    fetch(`https://pokeapi.co/api/v2/pokemon/${busqueda.toLowerCase()}`)
      .then((res) => {
        if (!res.ok) throw new Error('No encontrado');
        return res.json();
      })
      .then((data) => {
        setPokemonBuscado(data);
        setSeccion('busqueda');
      })
      .catch(() => alert('Pokémon no encontrado'));
  };

  const agregarFavorito = (name) => {
    if (!favoritos.includes(name)) {
      const nuevos = [...favoritos, name];
      setFavoritos(nuevos);
      localStorage.setItem('favoritos', JSON.stringify(nuevos));
    }
  };

  const quitarFavorito = (name) => {
    const nuevos = favoritos.filter((n) => n !== name);
    setFavoritos(nuevos);
    localStorage.setItem('favoritos', JSON.stringify(nuevos));
  };

  const agregarCapturado = (name) => {
    if (capturados.length >= 6) {
      alert('Solo puedes capturar hasta 6 Pokémon.');
      return;
    }
    if (!capturados.includes(name)) {
      const nuevos = [...capturados, name];
      setCapturados(nuevos);
      localStorage.setItem('capturados', JSON.stringify(nuevos));
    }
  };

  const quitarCapturado = (name) => {
    const nuevos = capturados.filter((n) => n !== name);
    setCapturados(nuevos);
    localStorage.setItem('capturados', JSON.stringify(nuevos));
  };

  const renderCard = (name) => (
    <div key={name} className="pokemon-card">
      <h3>{name.toUpperCase()}</h3>
      <img
        src={getSpriteUrl(name)}
        alt={name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://img.pokemondb.net/sprites/home/normal/pokeball.png';
        }}
      />
      <button
        className="btn-fav"
        onClick={() => agregarFavorito(name)}
        disabled={favoritos.includes(name)}
      >
        ❤️ Favorito
      </button>
      <button
        className="btn-capturar"
        onClick={() => agregarCapturado(name)}
        disabled={capturados.includes(name)}
      >
        🧺 Capturar
      </button>
    </div>
  );

  return (
    <>
      <style>{`
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f7f9fc;
          margin: 0;
          padding: 20px;
          color: #333;
        }

        h1 {
          text-align: center;
          color: #ef5350;
          margin-bottom: 20px;
        }

        input[type="text"] {
          width: 250px;
          padding: 8px 12px;
          font-size: 16px;
          border: 2px solid #ef5350;
          border-radius: 5px;
          margin-right: 8px;
        }

        button {
          cursor: pointer;
          background-color: #ef5350;
          border: none;
          color: white;
          padding: 8px 16px;
          font-weight: 600;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        button:hover:not(:disabled) {
          background-color: #c62828;
        }

        button:disabled {
          background-color: #ef9a9a;
          cursor: default;
        }

        #navBotones {
          margin: 20px 0;
          text-align: center;
        }

        #navBotones button {
          margin: 0 5px;
          padding: 10px 20px;
        }

        #navBotones button.active {
          background-color: #b71c1c;
          font-weight: bold;
          box-shadow: 0 0 10px #b71c1c;
        }

        #contenedorListados {
          max-width: 900px;
          margin: 0 auto;
        }

        #listadoPokemons,
        #favoritosDiv,
        #capturadosDiv {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
        }

        .pokemon-card {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 12px;
          width: 140px;
          text-align: center;
          user-select: none;
          transition: transform 0.2s ease;
        }

        .pokemon-card:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .pokemon-card h3 {
          margin: 8px 0;
          font-size: 16px;
          color: #ef5350;
        }

        .pokemon-card img {
          width: 96px;
          height: 96px;
          object-fit: contain;
          margin-bottom: 8px;
        }

        .btn-fav, .btn-capturar, .btn-eliminar {
          margin-top: 6px;
          width: 100%;
          font-weight: 600;
          border-radius: 8px;
          padding: 6px 0;
        }

        .btn-fav {
          background-color: #ff4081;
          color: white;
        }

        .btn-fav:disabled {
          background-color: #f8bbd0;
        }

        .btn-capturar {
          background-color: #42a5f5;
          color: white;
        }

        .btn-capturar:disabled {
          background-color: #bbdefb;
        }

        .btn-eliminar {
          background-color: #9e9e9e;
          color: white;
        }

        #cargarMasBtn {
          display: block;
          margin: 20px auto 40px;
          padding: 12px 24px;
          font-size: 18px;
          font-weight: 700;
          border-radius: 8px;
        }

        #resultado {
          max-width: 400px;
          margin: 20px auto;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
          padding: 20px;
          text-align: center;
        }

        #resultado h2 {
          color: #ef5350;
          margin-bottom: 12px;
        }

        #resultado img {
          width: 120px;
          height: 120px;
          object-fit: contain;
          margin-bottom: 12px;
        }

        #resultado p {
          font-size: 16px;
          margin: 6px 0;
        }
      `}</style>

      <div>
        <h1>Pokémon API - Favoritos y Capturados</h1>

        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Escribe el nombre del Pokémon"
        />
        <button onClick={manejarBusqueda}>Buscar</button>

        <div id="navBotones">
          <button
            className={seccion === 'listado' ? 'active' : ''}
            onClick={() => setSeccion('listado')}
          >
            Listado Completo
          </button>
          <button
            className={seccion === 'favoritos' ? 'active' : ''}
            onClick={() => setSeccion('favoritos')}
          >
            Favoritos ❤️
          </button>
          <button
            className={seccion === 'capturados' ? 'active' : ''}
            onClick={() => setSeccion('capturados')}
          >
            Capturados 🧺
          </button>
        </div>

        <div id="contenedorListados">
          {seccion === 'listado' && (
            <>
              <div id="listadoPokemons">
                {pokemonList.map((p) => renderCard(p.name))}
              </div>
              <button id="cargarMasBtn" onClick={cargarMasPokemon}>
                Cargar más Pokémon
              </button>
            </>
          )}

          {seccion === 'favoritos' && (
            <div id="favoritosDiv">
              {favoritos.length === 0 ? (
                <p>No tienes Pokémon favoritos aún.</p>
              ) : (
                favoritos.map((name) => (
                  <div key={name} className="pokemon-card">
                    <h3>{name.toUpperCase()}</h3>
                    <img src={getSpriteUrl(name)} alt={name} />
                    <button
                      className="btn-eliminar"
                      onClick={() => quitarFavorito(name)}
                    >
                      Eliminar Favorito
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {seccion === 'capturados' && (
            <div id="capturadosDiv">
              {capturados.length === 0 ? (
                <p>No has capturado ningún Pokémon aún.</p>
              ) : (
                capturados.map((name) => (
                  <div key={name} className="pokemon-card">
                    <h3>{name.toUpperCase()}</h3>
                    <img src={getSpriteUrl(name)} alt={name} />
                    <button
                      className="btn-eliminar"
                      onClick={() => quitarCapturado(name)}
                    >
                      Liberar Pokémon
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {seccion === 'busqueda' && pokemonBuscado && (
            <div id="resultado">
              <h2>{pokemonBuscado.name.toUpperCase()}</h2>
              <img
                src={
                  pokemonBuscado.sprites.front_default ||
                  'https://img.pokemondb.net/sprites/home/normal/pokeball.png'
                }
                alt={pokemonBuscado.name}
              />
              <p>Altura: {pokemonBuscado.height}</p>
              <p>Peso: {pokemonBuscado.weight}</p>
              <p>
                Tipo:{' '}
                {pokemonBuscado.types
                  .map((tipo) => tipo.type.name)
                  .join(', ')}
              </p>
              <button onClick={() => setSeccion('listado')}>
                Volver al listado
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
