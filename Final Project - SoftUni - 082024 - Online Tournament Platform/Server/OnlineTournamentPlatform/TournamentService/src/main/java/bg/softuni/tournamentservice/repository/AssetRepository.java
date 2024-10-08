package bg.softuni.tournamentservice.repository;


import bg.softuni.tournamentservice.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {

    Optional<List<Asset>> findAllByGameId(long gameId);
}
