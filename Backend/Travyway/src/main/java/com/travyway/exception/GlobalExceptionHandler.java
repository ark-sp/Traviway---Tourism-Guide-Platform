package com.travyway.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        String errorMessage = ex.getMessage();
        HttpStatus status;

        // Check for messages that imply a duplicate resource conflict (409)
        if (errorMessage.contains("already exists") || errorMessage.contains("already reviewed") || errorMessage.contains("already marked") || errorMessage.contains("already in the wishlist")) {
            status = HttpStatus.CONFLICT;
        } else {
            // Other illegal arguments are likely due to bad client input (400)
            status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<>(errorMessage, status);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}
