package bg.softuni.tournamentservice.model;

import bg.softuni.gameservice.model.Game;
import bg.softuni.locationservice.model.Country;
import bg.softuni.locationservice.model.Region;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name="tournaments")
public class Tournament {
    @Id
    private Long id;

    @Column
    private String name;
    @Column(name = "manager_id")
    private Long managerId;


    @OneToOne
    private Game game;

    @ElementCollection
    @CollectionTable(name = "tournament_teams", joinColumns = @JoinColumn(name = "tournament_id"))
    @Column(name = "team_id")
    private Set<Long> teamIds;

    @ManyToMany
    @JoinTable(name = "tournament_countries",
            joinColumns = @JoinColumn(name = "tournament_id"),
            inverseJoinColumns = @JoinColumn(name = "country_id"))
    private Set<Country> countries;

    @ManyToOne
    @JoinColumn(name = "region_id")
    private Region region;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public Set<Long> getTeamIds() {
        return teamIds;
    }

    public void setTeamIds(Set<Long> teamIds) {
        this.teamIds = teamIds;
    }
}
