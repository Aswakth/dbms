package com.example.backend.controller;

import com.example.backend.model.Enrollment;
import com.example.backend.repository.EnrollmentRepository;
import com.example.backend.repository.AttendanceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;

    public DebugController(EnrollmentRepository enrollmentRepository, AttendanceRepository attendanceRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @GetMapping("/enrollments")
    public ResponseEntity<List<EnrollmentDto>> enrollments() {
        List<Enrollment> list = enrollmentRepository.findAll();
        List<EnrollmentDto> dto = list.stream().map(e -> {
            EnrollmentDto d = new EnrollmentDto();
            d.studentEmail = e.getStudent() != null ? e.getStudent().getEmail() : null;
            d.teacherEmail = e.getTeacher() != null ? e.getTeacher().getEmail() : null;
            d.subjectId = e.getSubjectId();
            return d;
        }).toList();
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/enrollments/search")
    public ResponseEntity<List<EnrollmentDto>> enrollmentsFor(@RequestParam(required = false) String teacherEmail,
                                                              @RequestParam(required = false) String subjectId) {
        List<Enrollment> list = enrollmentRepository.findAll();
        List<EnrollmentDto> dto = list.stream()
                .filter(e -> (teacherEmail == null || (e.getTeacher() != null && teacherEmail.equals(e.getTeacher().getEmail())))
                        && (subjectId == null || subjectId.equals(e.getSubjectId())))
                .map(e -> {
                    EnrollmentDto d = new EnrollmentDto();
                    d.studentEmail = e.getStudent() != null ? e.getStudent().getEmail() : null;
                    d.teacherEmail = e.getTeacher() != null ? e.getTeacher().getEmail() : null;
                    d.subjectId = e.getSubjectId();
                    return d;
                }).toList();
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceDto>> attendanceFor(@RequestParam(required = false) String studentEmail,
                                                             @RequestParam(required = false) String subjectId) {
        if (studentEmail == null || studentEmail.isBlank()) return ResponseEntity.ok(List.of());
        // find a student from enrollments (case-insensitive match)
        List<Enrollment> list = enrollmentRepository.findAll();
        List<Enrollment> matches = list.stream().filter(e -> e.getStudent() != null && studentEmail.equalsIgnoreCase(e.getStudent().getEmail())).toList();
        if (matches.isEmpty()) return ResponseEntity.ok(List.of());
        var student = matches.get(0).getStudent();
        List<com.example.backend.model.Attendance> rows = attendanceRepository.findByStudent(student);
        if (subjectId != null && !subjectId.isBlank()) {
            rows = rows.stream().filter(a -> subjectId.equals(a.getSubjectId())).toList();
        }
        List<AttendanceDto> dto = rows.stream().map(a -> {
            AttendanceDto d = new AttendanceDto();
            d.id = a.getId();
            d.date = a.getDate() != null ? a.getDate().toString() : null;
            d.subjectId = a.getSubjectId();
            d.present = a.isPresent();
            d.teacherEmail = a.getTeacher() != null ? a.getTeacher().getEmail() : null;
            return d;
        }).toList();
        return ResponseEntity.ok(dto);
    }

    public static class EnrollmentDto {
        public String studentEmail;
        public String teacherEmail;
        public String subjectId;
    }

    public static class AttendanceDto {
        public Long id;
        public String date;
        public String subjectId;
        public boolean present;
        public String teacherEmail;
    }
}
