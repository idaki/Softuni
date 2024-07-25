import React, { useState, useEffect } from 'react';
import TeamCard from './TeamCard';
import * as teamService from '../../services/teamService';
import Pagination from '../pagination/PaginationModal';

export default function TeamContainer() {
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [teamsPerPage, setTeamsPerPage] = useState(6); // Initial number of teams per page
  
    useEffect(() => {
      const storedTeams = sessionStorage.getItem('teamsList');
      if (storedTeams) {
        setTeams(JSON.parse(storedTeams));
        setIsLoading(false);
      } else {
        teamService.getAll()
          .then(result => {
            setTeams(result);
            sessionStorage.setItem('teamsList', JSON.stringify(result));
            setIsLoading(false);
          })
          .catch(err => {
            console.log(err);
            setIsLoading(false);
          });
      }
    }, []);
  
    // Get current teams
    const indexOfLastTeam = currentPage * teamsPerPage;
    const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
    const currentTeams = teams.slice(indexOfFirstTeam, indexOfLastTeam);
  
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    return (
      <section className="py-5 min-vh-100 d-flex align-items-center justify-content-center">
        <div className="container">
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center h-70">
              Loading...
            </div>
          ) : teams.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center h-70">
              No teams available
            </div>
          ) : (
            <>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {currentTeams.map(team => (
                  <div key={team.id} className="col">
                    <TeamCard
                      id={team.id}
                      first_name={team.first_name}
                      img={team.img} // Assuming img is a part of the team's data
                    />
                  </div>
                ))}
              </div>
              <Pagination
                teamsPerPage={teamsPerPage}
                totalTeams={teams.length}
                paginate={paginate}
                currentPage={currentPage}
              />
              <div className="d-flex justify-content-center align-items-center mt-3">
                <label htmlFor="teamsPerPage" className="me-2">Teams per page:</label>
                <select
                  id="teamsPerPage"
                  value={teamsPerPage}
                  onChange={(e) => setTeamsPerPage(Number(e.target.value))}
                  className="form-select w-auto"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={18}>18</option>
                  <option value={24}>24</option>
                </select>
              </div>
            </>
          )}
        </div>
      </section>
    );
  }
