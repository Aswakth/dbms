package com.example.backend.repository;

import com.example.backend.model.Assignment;
import com.example.backend.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByTeacher(Teacher teacher);
    List<Assignment> findBySubjectId(String subjectId);
    List<Assignment> findByTeacherAndSubjectId(Teacher teacher, String subjectId);
}