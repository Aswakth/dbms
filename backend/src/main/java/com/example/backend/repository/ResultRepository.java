package com.example.backend.repository;

import com.example.backend.model.Result;
import com.example.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudentAndSemester(Student student, String semester);
    List<Result> findByStudent(Student student);
    List<Result> findByStudentAndSubjectId(Student student, String subjectId);
}
