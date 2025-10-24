package com.example.backend.repository;

import com.example.backend.model.AssignmentSubmission;
import com.example.backend.model.Assignment;
import com.example.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    List<AssignmentSubmission> findByStudent(Student student);
    List<AssignmentSubmission> findByAssignment(Assignment assignment);
    Optional<AssignmentSubmission> findByStudentAndAssignment(Student student, Assignment assignment);
    List<AssignmentSubmission> findByAssignmentAndStudent(Assignment assignment, Student student);
}
