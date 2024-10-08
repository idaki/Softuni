package bg.softuni.userservice.repository;

import bg.softuni.userservice.models.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);

    Optional<User> findByUserSecurity_Password_ResetPasswordToken(String resetPasswordToken);

    @Query("SELECT u FROM User u WHERE u.username = :username OR u.userProfile.firstName = :firstName OR u.userProfile.lastName = :lastName")
    Optional<User> findByUsernameOrFirstNameOrLastName(@Param("username") String username,
                                                       @Param("firstName") String firstName,
                                                       @Param("lastName") String lastName);

    Optional<User> findByUserProfile_FirstName(String firstName);

    Optional<User> findByUserProfile_LastName(String lastName);
}
