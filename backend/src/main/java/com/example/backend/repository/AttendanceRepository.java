package com.example.backend.repository;

import com.example.backend.model.Attendance;
import com.example.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentAndDateBetween(Student student, LocalDate start, LocalDate end);
    List<Attendance> findByStudent(Student student);
}
