import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAllGames } from '../../../services/api/gameService';
import { createTournament } from '../../../services/api/tournamentService';
import { validateCreateTournamentForm } from '../../../services/formValidator/createTournamentFormValidator';
import { getCsrfToken, fetchCsrfToken } from '../../../utils/csrfUtils';
import ViewContext from '../../../context/viewContext';

export default function CreateTournamentModal({ onClose, onCreate }) {
  const { setMainContent } = useContext(ViewContext);
  const [formData, setFormData] = useState({
    name: '',
    game: '',
    category: '',
    summary: '',
    startDate: '',
    endDate: '',
    numberOfTeams: '',
    teamSize: '',
  });

  const [errors, setErrors] = useState({});
  const [games, setGames] = useState([]);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gamesData = await getAllGames();
        setGames(gamesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { valid, errors } = validateCreateTournamentForm(formData);
    if (valid) {
      try {
        let csrfToken = getCsrfToken();

        if (!csrfToken) {
          csrfToken = await fetchCsrfToken();
        }

        const createdTournament = await createTournament(formData);

        if (typeof onCreate === 'function') {
          onCreate();
        } else {
          console.error('onCreate is not a function');
        }

        if (typeof onClose === 'function') {
          onClose();
        } else {
          console.error('onClose is not a function');
        }

        // Switch view to "My Tournaments" after successful creation
        setMainContent('tournaments');
      } catch (error) {
        console.error('Failed to create tournament:', error);
        setServerError(error.message);
      }
    } else {
      setErrors(errors);
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <h1>Create Tournament</h1>

        {serverError && <div className="alert alert-danger">{serverError}</div>}

        <div className="form-group mb-3">
          <label htmlFor="name">Tournament name:</label>
          <input
            type="text"
            className={`form-control ${errors.name && 'is-invalid'}`}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter tournament name..."
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="game">Legendary title:</label>
          <select
            className={`form-control ${errors.game && 'is-invalid'}`}
            id="game"
            name="game"
            value={formData.game}
            onChange={handleChange}
          >
            <option key="default" value="">Select a game...</option>
            {games.map(game => (
              <option key={game.id} value={game.title}>{game.title}</option>
            ))}
          </select>
          {errors.game && <div className="invalid-feedback">{errors.game}</div>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            className={`form-control ${errors.category && 'is-invalid'}`}
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Enter game category..."
          />
          {errors.category && <div className="invalid-feedback">{errors.category}</div>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="summary">Summary:</label>
          <textarea
            className={`form-control ${errors.summary && 'is-invalid'}`}
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
          ></textarea>
          {errors.summary && <div className="invalid-feedback">{errors.summary}</div>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            className={`form-control ${errors.startDate && 'is-invalid'}`}
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
          {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            className={`form-control ${errors.endDate && 'is-invalid'}`}
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
          {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="numberOfTeams">Number of Teams:</label>
          <input
            type="number"
            className={`form-control ${errors.numberOfTeams && 'is-invalid'}`}
            id="numberOfTeams"
            name="numberOfTeams"
            value={formData.numberOfTeams}
            onChange={handleChange}
            min="1"
          />
          {errors.numberOfTeams && <div className="invalid-feedback">{errors.numberOfTeams}</div>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="teamSize">Team Size:</label>
          <input
            type="number"
            className={`form-control ${errors.teamSize && 'is-invalid'}`}
            id="teamSize"
            name="teamSize"
            value={formData.teamSize}
            onChange={handleChange}
            min="1"
          />
          {errors.teamSize && <div className="invalid-feedback">{errors.teamSize}</div>}
        </div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">Create Tournament</button>
        </div>
      </form>
    </div>
  );
}
