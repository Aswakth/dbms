package com.example.backend;

import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final AssignmentRepository assignmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final ResultRepository resultRepository;
    private final StudentQueryRepository queryRepository;

    public DataLoader(StudentRepository studentRepository,
                      TeacherRepository teacherRepository,
                      AssignmentRepository assignmentRepository,
                      AttendanceRepository attendanceRepository,
                      ResultRepository resultRepository,
                      StudentQueryRepository queryRepository) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.assignmentRepository = assignmentRepository;
        this.attendanceRepository = attendanceRepository;
        this.resultRepository = resultRepository;
        this.queryRepository = queryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (studentRepository.count() > 0) return; // don't double-insert

        Student s1 = studentRepository.save(new Student("Alice", "alice@example.com"));
        Student s2 = studentRepository.save(new Student("Bob", "bob@example.com"));

        Teacher t1 = teacherRepository.save(new Teacher("Dr. Smith", "smith@example.com"));

        Assignment a1 = new Assignment(); a1.setTitle("Math Quiz 1"); a1.setDescription("Ch 1-3"); assignmentRepository.save(a1);

        // attendance sample
        Attendance att1 = new Attendance(); att1.setStudent(s1); att1.setDate(LocalDate.now().minusDays(2)); att1.setPresent(true); attendanceRepository.save(att1);
        Attendance att2 = new Attendance(); att2.setStudent(s1); att2.setDate(LocalDate.now().minusDays(1)); att2.setPresent(false); attendanceRepository.save(att2);

        // results
    Result r1 = new Result(); r1.setStudent(s1); r1.setSemester("1"); r1.setMarks(85); r1.setMaxMarks(100); r1.setSubjectId("Math-101"); resultRepository.save(r1);
    Result r2 = new Result(); r2.setStudent(s1); r2.setSemester("2"); r2.setMarks(78); r2.setMaxMarks(100); r2.setSubjectId("Physics-101"); resultRepository.save(r2);

        // queries
        StudentQuery q1 = new StudentQuery(); q1.setStudent(s1); q1.setTeacher(t1); q1.setMessage("Can you explain Chapter 3?"); queryRepository.save(q1);

        System.out.println("Sample data loaded: students=" + studentRepository.count());
    }
}
