import { useState } from "react";
import "./index.css";

const API_KEY = "thewdb"; // Free demo key

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchMovies() {
    if (!query) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`
      );
      const data = await res.json();

      if (data.Response === "False") {
        setError("No movies found");
        setMovies([]);
      } else {
        setMovies(data.Search);
      }
    } catch (err) {
      setError("Error fetching data");
    }

    setLoading(false);
  }

  return (
    <div className="app">
      <h1>🎬 Movie Search App</h1>

      <div className="search">
        <input
          type="text"
          placeholder="Search movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchMovies}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="movies">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="card">
            <img src={movie.Poster} alt={movie.Title} />
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
