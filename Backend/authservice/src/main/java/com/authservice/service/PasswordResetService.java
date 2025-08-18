package com.authservice.service;

import com.authservice.dto.ResetPasswordRequest;
import com.authservice.model.PasswordResetToken;
import com.authservice.model.User;
import com.authservice.repository.PasswordResetTokenRepository;
import com.authservice.repository.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetTokenRepository otpRepo;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    public void generateAndSendOtp(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            String otp = String.format("%06d", new Random().nextInt(999999));
            PasswordResetToken token = new PasswordResetToken();
            token.setEmail(email);
            token.setOtp(otp);
            token.setExpiryTime(LocalDateTime.now().plusMinutes(10));
            otpRepo.save(token);

            sendOtpEmail(email, otp);
        }
        // Silently ignore if user not found for security
    }

    private void sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Your Password Reset OTP");
            message.setText("Your OTP for password reset is: " + otp + "\nIt is valid for 10 minutes.");
            mailSender.send(message);
        } catch (Exception e) {
            // log error, or rethrow if you want
            e.printStackTrace();
        }
    }

    public boolean verifyOtp(String email, String otp) {
        Optional<PasswordResetToken> tokenOpt = otpRepo.findByEmailAndOtp(email, otp);
        if (tokenOpt.isPresent()) {
            PasswordResetToken token = tokenOpt.get();
            if (token.getExpiryTime().isAfter(LocalDateTime.now())) {
                return true;
            } else {
                otpRepo.delete(token); // expired token cleanup
            }
        }
        return false;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest req) {
        // your existing logic
        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        User user = userRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        otpRepo.deleteAllByEmail(req.getEmail()); // This needs a transaction
    }
}
