package com.example.backend.repository;

import com.example.backend.model.StudentQuery;
import com.example.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentQueryRepository extends JpaRepository<StudentQuery, Long> {
    List<StudentQuery> findByTeacherId(Long teacherId);
    List<StudentQuery> findByStudent(Student student);
}
