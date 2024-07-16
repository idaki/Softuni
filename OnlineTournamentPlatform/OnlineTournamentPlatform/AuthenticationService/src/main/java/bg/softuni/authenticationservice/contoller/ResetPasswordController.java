package bg.softuni.authenticationservice.contoller;

import bg.softuni.authenticationservice.model.DTO.ResetPasswordDTO;
import bg.softuni.userservice.service.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ResetPasswordController {

    private final PasswordService passwordService;

    @Autowired
    public ResetPasswordController(PasswordService passwordService) {
        this.passwordService = passwordService;
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO) {
        passwordService.generateResetToken(resetPasswordDTO.getEmail());
        return ResponseEntity.ok("Password reset token has been sent to your email.");
    }
}
