package bg.softuni.passwordservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication
@ComponentScan(basePackages = {"bg.softuni.passwordservice", "bg.softuni.userservice"})
@EnableWebSecurity
public class PasswordServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PasswordServiceApplication.class, args);
    }

}
