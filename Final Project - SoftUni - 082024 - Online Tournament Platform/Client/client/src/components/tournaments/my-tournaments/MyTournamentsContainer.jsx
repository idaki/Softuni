import React, { useState, useEffect, useContext } from 'react';
import TournamentCard from '../tournament-card/TournamentCard';
import * as tournamentService from '../../../services/api/tournamentService';
import TournamentProductPageContainer from '../tournament-product-page/Product-Page-Container/TournamentProducPageContainer';
import { getCsrfToken, fetchCsrfToken } from '../../../utils/csrfUtils';
import ViewContext from '../../../context/viewContext';
import CreateTournamentModal from '../tournament-create/CreateTournamentModal';

export default function MyTournamentsContainer() {
  const { mainContent } = useContext(ViewContext);
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (mainContent !== 'tournaments') return;

    const fetchTournaments = async () => {
      try {
        let csrfToken = getCsrfToken();
        if (!csrfToken) {
          csrfToken = await fetchCsrfToken();
        }

        const result = await tournamentService.getMyTournaments();
        setTournaments(result);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch tournaments:', error);
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, [mainContent]);

  const handleLearnMore = async (tournamentId) => {
    try {
      let csrfToken = getCsrfToken();
        if (!csrfToken) {
          csrfToken = await fetchCsrfToken();
        }
      const tournamentData = await tournamentService.getTournamentById(tournamentId);
      setSelectedTournament(tournamentData);
    } catch (error) {
      console.error('Failed to fetch tournament:', error);
    }
  };

  const handleCreateTournament = async () => {
    setShowCreateModal(false);
    setIsLoading(true);
    const fetchTournaments = async () => {
      try {
        let csrfToken = getCsrfToken();
        if (!csrfToken) {
          csrfToken = await fetchCsrfToken();
        }

        const result = await tournamentService.getMyTournaments();
        setTournaments(result);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch tournaments:', error);
        setIsLoading(false);
      }
    };
    await fetchTournaments();
  };

  if (selectedTournament) {
    return <TournamentProductPageContainer tournament={selectedTournament} />;
  }

  return (
    <section className="py-5 min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <button className="btn btn-primary mb-3" onClick={() => setShowCreateModal(true)}>
          Create Tournament
        </button>
        {showCreateModal && (
          <CreateTournamentModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateTournament}
          />
        )}
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center h-70">
            Loading...
          </div>
        ) : tournaments.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center h-70">
            No tournaments available
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {tournaments.map(tournament => (
              <div key={tournament.id} className="col">
                <TournamentCard
                  id={tournament.id}
                  title={tournament.name}
                  description={tournament.description}
                  img={tournament.url}
                  onLearnMore={() => handleLearnMore(tournament.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
