package com.adminservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.adminservice.dto.ContactFormDTO;

@Service
public class EmailService {

	@Autowired
	private JavaMailSender mailSender;
	
	
	public void sendContactForm(ContactFormDTO form, String toEmail) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(toEmail);
		message.setFrom(form.getEmail());
		message.setSubject("Contact Form Submission from " + form.getName());
		message.setText("Name: " + form.getName() + "\n" + "Email: " + form.getEmail() + "\n" + "Message: "
				+ form.getMessage());
		mailSender.send(message);
	}
	
	
	
	
}
