package com.example.backend.repository;

import com.example.backend.model.Enrollment;
import com.example.backend.model.Teacher;
import com.example.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByTeacherAndSubjectId(Teacher teacher, String subjectId);
    Optional<Enrollment> findByStudentAndSubjectId(Student student, String subjectId);
}
