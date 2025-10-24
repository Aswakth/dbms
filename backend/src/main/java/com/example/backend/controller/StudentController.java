package com.example.backend.controller;

import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private static final Logger log = LoggerFactory.getLogger(StudentController.class);

    private final StudentRepository studentRepository;
    private final AssignmentRepository assignmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final ResultRepository resultRepository;
    private final StudentQueryRepository queryRepository;
    private final TeacherRepository teacherRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final FileStorageService fileStorageService;
    private final SubmissionRepository submissionRepository;
    private final AssignmentSubmissionRepository assignmentSubmissionRepository;

    public StudentController(StudentRepository studentRepository,
                             AssignmentRepository assignmentRepository,
                             AttendanceRepository attendanceRepository,
                             ResultRepository resultRepository,
                             StudentQueryRepository queryRepository,
                             FileStorageService fileStorageService,
                             TeacherRepository teacherRepository,
                             EnrollmentRepository enrollmentRepository,
                             SubmissionRepository submissionRepository,
                             AssignmentSubmissionRepository assignmentSubmissionRepository) {
        this.studentRepository = studentRepository;
        this.assignmentRepository = assignmentRepository;
        this.attendanceRepository = attendanceRepository;
        this.resultRepository = resultRepository;
        this.queryRepository = queryRepository;
        this.fileStorageService = fileStorageService;
        this.teacherRepository = teacherRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.submissionRepository = submissionRepository;
        this.assignmentSubmissionRepository = assignmentSubmissionRepository;
    }

    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceDto>> getAttendance(@RequestParam(required = false) String subjectId,
                                                               @RequestParam(required = false) String studentEmail,
                                                               @RequestParam(required = false) Long studentId,
                                                               @RequestParam(required = false) String teacherEmail) {
        try {
            // Prefer explicit student identity if provided (email or id). Fallback to first student only for demo.
            log.info("getAttendance called with subjectId={}, studentEmail={}, studentId={}", subjectId, studentEmail, studentId);
            Student student = null;
            if (studentId != null) {
                Optional<Student> sOpt = studentRepository.findById(studentId);
                if (sOpt.isPresent()) student = sOpt.get();
            }
            if (student == null && studentEmail != null && !studentEmail.isBlank()) {
                student = studentRepository.findByEmailIgnoreCase(studentEmail.trim()).orElse(null);
            }
            if (student == null) {
                List<Student> students = studentRepository.findAll();
                if (students.isEmpty()) return ResponseEntity.ok(List.of());
                student = students.get(0);
            }

            List<Attendance> all = attendanceRepository.findByStudent(student);
            if (teacherEmail != null && !teacherEmail.isBlank()) {
                String tnorm = teacherEmail.trim().toLowerCase();
                all = all.stream().filter(a -> a.getTeacher() != null && tnorm.equals(a.getTeacher().getEmail() == null ? null : a.getTeacher().getEmail().trim().toLowerCase())).toList();
            }
            
            if (subjectId != null && !subjectId.isBlank()) {
                all = all.stream().filter(a -> subjectId.equals(a.getSubjectId())).toList();
            }

            // aggregate by subjectId
            var grouped = all.stream().collect(java.util.stream.Collectors.groupingBy(Attendance::getSubjectId));
            List<AttendanceDto> response = grouped.entrySet().stream().map(e -> {
                String subj = e.getKey() == null ? "unknown" : e.getKey();
                long total = e.getValue().size();
                long present = e.getValue().stream().filter(Attendance::isPresent).count();
                AttendanceDto d = new AttendanceDto();
                d.subject = subj;
                d.present = (int) present;
                d.total = (int) total;
                return d;
            }).toList();
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            log.error("error in getAttendance for studentEmail={} subjectId={}", studentEmail, subjectId, ex);
            return ResponseEntity.status(500).body(List.of());
        }
    }

    @PostMapping("/assignments/submit")
    public ResponseEntity<?> submitAssignment(@RequestParam("assignmentId") String assignmentId,
                                              @RequestParam("studentEmail") String studentEmail,
                                              @RequestParam(required = false) String submissionNotes,
                                              @RequestParam(value = "file", required = false) MultipartFile file) throws Exception {
        // validate assignment exists
        Long aid;
        try { aid = Long.parseLong(assignmentId); } catch (Exception e) { return ResponseEntity.badRequest().body("invalid assignmentId"); }
        Optional<Assignment> aOpt = assignmentRepository.findById(aid);
        if (aOpt.isEmpty()) return ResponseEntity.badRequest().body("assignment not found");

        // find student
        String studentEmailNorm = studentEmail.trim().toLowerCase();
        Optional<Student> studentOpt = studentRepository.findByEmailIgnoreCase(studentEmailNorm);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Student not found");
        }
        Student student = studentOpt.get();

        // Check if student already submitted this assignment
        Optional<AssignmentSubmission> existingSubmission = assignmentSubmissionRepository.findByStudentAndAssignment(student, aOpt.get());
        if (existingSubmission.isPresent()) {
            return ResponseEntity.badRequest().body("Assignment already submitted");
        }

        AssignmentSubmission submission = new AssignmentSubmission();
        submission.setStudent(student);
        submission.setAssignment(aOpt.get());
        submission.setSubmissionNotes(submissionNotes);
        
        // store file if provided
        if (file != null && !file.isEmpty()) {
            String path = fileStorageService.storeFile(file);
            submission.setFilePath(path);
        }
        
        assignmentSubmissionRepository.save(submission);
        
        return ResponseEntity.ok().build();
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<AssignmentDto>> getAssignments(@RequestParam(required = false) String subjectId,
                                                              @RequestParam(required = false) String studentEmail) {
        try {
            // Find the current student
            Student student = null;
            if (studentEmail != null && !studentEmail.isBlank()) {
                student = studentRepository.findByEmailIgnoreCase(studentEmail.trim()).orElse(null);
            }
            if (student == null) {
                List<Student> students = studentRepository.findAll();
                if (students.isEmpty()) return ResponseEntity.ok(List.of());
                student = students.get(0);
            }

            List<Assignment> assignments;
            if (subjectId != null && !subjectId.isBlank()) {
                assignments = assignmentRepository.findBySubjectId(subjectId);
            } else {
                assignments = assignmentRepository.findAll();
            }

            final Student finalStudent = student; // Make student effectively final
            List<AssignmentDto> dtoList = assignments.stream().map(a -> {
                AssignmentDto dto = new AssignmentDto();
                dto.id = a.getId();
                dto.title = a.getTitle();
                dto.description = a.getDescription();
                dto.subjectId = a.getSubjectId();
                dto.filePath = a.getFilePath();
                dto.createdAt = a.getCreatedAt().toString();
                
                // Check if student has submitted this assignment
                Optional<AssignmentSubmission> submission = assignmentSubmissionRepository.findByStudentAndAssignment(finalStudent, a);
                dto.submitted = submission.isPresent();
                if (submission.isPresent()) {
                    dto.submissionNotes = submission.get().getSubmissionNotes();
                    dto.submittedAt = submission.get().getSubmittedAt().toString();
                }
                
                return dto;
            }).toList();
            
            return ResponseEntity.ok(dtoList);
        } catch (Exception ex) {
            log.error("error fetching assignments for studentEmail={} subjectId={}", studentEmail, subjectId, ex);
            return ResponseEntity.status(500).body(List.of());
        }
    }

    @PostMapping("/queries")
    public ResponseEntity<?> submitQuery(@RequestBody SubmitQuery body) {
        // Try to resolve teacher by id or email
        Optional<Teacher> teacherOpt = Optional.empty();
        try {
            Long tid = Long.parseLong(body.teacherId);
            teacherOpt = Optional.ofNullable(null);
        } catch (Exception ignored) {}
        StudentQuery q = new StudentQuery();
        q.setMessage(body.message);
        // Attach student if provided
        if (body.studentEmail != null) {
            Optional<Student> sOpt = studentRepository.findByEmail(body.studentEmail);
            sOpt.ifPresent(q::setStudent);
        }
        // Attach teacher if provided
        if (body.teacherId != null) {
            Optional<Teacher> tOpt = teacherRepository.findByEmail(body.teacherId);
            tOpt.ifPresent(q::setTeacher);
        }
        queryRepository.save(q);
        return ResponseEntity.ok().build();
    }

    public static class SubmitQuery {
        public String teacherId;
        public String message;
        public String studentEmail;
    }

    @GetMapping("/results")
    public ResponseEntity<List<ResultDto>> getResults(@RequestParam(required = false) String semester, 
                                                      @RequestParam(required = false) String subjectId,
                                                      @RequestParam(required = false) String studentEmail,
                                                      @RequestParam(required = false) Long studentId,
                                                      @RequestParam(required = false) String teacherEmail) {
        try {
            // Prefer explicit student identity if provided (email or id). Fallback to first student only for demo.
            log.info("getResults called with subjectId={}, studentEmail={}, studentId={}, teacherEmail={}", subjectId, studentEmail, studentId, teacherEmail);
            Student student = null;
            if (studentId != null) {
                Optional<Student> sOpt = studentRepository.findById(studentId);
                if (sOpt.isPresent()) student = sOpt.get();
            }
            if (student == null && studentEmail != null && !studentEmail.isBlank()) {
                student = studentRepository.findByEmailIgnoreCase(studentEmail.trim()).orElse(null);
            }
            if (student == null) {
                List<Student> students = studentRepository.findAll();
                if (students.isEmpty()) return ResponseEntity.ok(List.of());
                student = students.get(0);
            }

            List<com.example.backend.model.Result> all = resultRepository.findByStudent(student);
            
            // Filter by teacher if provided
            if (teacherEmail != null && !teacherEmail.isBlank()) {
                String tnorm = teacherEmail.trim().toLowerCase();
                final Student finalStudent = student; // Make student effectively final
                all = all.stream().filter(r -> {
                    // Check if student is enrolled with this teacher for this subject
                    if (r.getSubjectId() != null) {
                        Optional<Enrollment> enrollment = enrollmentRepository.findByStudentAndSubjectId(finalStudent, r.getSubjectId());
                        if (enrollment.isPresent() && enrollment.get().getTeacher() != null) {
                            String teacherEmailFromEnrollment = enrollment.get().getTeacher().getEmail();
                            return teacherEmailFromEnrollment != null && tnorm.equals(teacherEmailFromEnrollment.trim().toLowerCase());
                        }
                    }
                    return false;
                }).toList();
            }
            
            if (subjectId != null && !subjectId.isBlank()) {
                all = all.stream().filter(r -> subjectId.equals(r.getSubjectId())).toList();
            }
            
            if (semester != null && !semester.isBlank()) {
                all = all.stream().filter(r -> semester.equals(r.getSemester())).toList();
            }

            // aggregate by subjectId
            var grouped = all.stream().collect(java.util.stream.Collectors.groupingBy(com.example.backend.model.Result::getSubjectId));
            List<ResultDto> response = grouped.entrySet().stream().map(e -> {
                String subj = e.getKey() == null ? "unknown" : e.getKey();
                // Get the latest result for this subject (by semester or latest created)
                com.example.backend.model.Result latestResult = e.getValue().stream()
                    .max((r1, r2) -> {
                        // First compare by semester if both have semester
                        if (r1.getSemester() != null && r2.getSemester() != null) {
                            return r1.getSemester().compareTo(r2.getSemester());
                        }
                        // Otherwise compare by ID (creation order)
                        return Long.compare(r1.getId(), r2.getId());
                    }).orElse(e.getValue().get(0));
                
                ResultDto d = new ResultDto();
                d.subject = subj;
                d.semester = latestResult.getSemester();
                d.marks = latestResult.getMarks();
                d.maxMarks = latestResult.getMaxMarks();
                return d;
            }).toList();
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            log.error("error in getResults for studentEmail={} subjectId={} teacherEmail={}", studentEmail, subjectId, teacherEmail, ex);
            return ResponseEntity.status(500).body(List.of());
        }
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationDto>> notifications(@RequestParam(required = false) String studentEmail) {
        try {
            // Find the current student - prefer explicit email if provided, otherwise use first student for demo
            Student student = null;
            if (studentEmail != null && !studentEmail.isBlank()) {
                student = studentRepository.findByEmailIgnoreCase(studentEmail.trim()).orElse(null);
            }
            if (student == null) {
                List<Student> students = studentRepository.findAll();
                if (students.isEmpty()) return ResponseEntity.ok(List.of());
                student = students.get(0);
            }

            // Get queries for this specific student
            List<StudentQuery> studentQueries = queryRepository.findByStudent(student);
            
            List<NotificationDto> list = studentQueries.stream().map(q -> {
                NotificationDto n = new NotificationDto();
                n.id = String.valueOf(q.getId());
                n.message = q.getMessage();
                n.date = q.getCreatedAt().toLocalDate().toString();
                // Include reply if available
                if (q.getReply() != null && !q.getReply().isBlank()) {
                    n.reply = q.getReply();
                }
                return n;
            }).toList();
            return ResponseEntity.ok(list);
        } catch (Exception ex) {
            log.error("error fetching student notifications for studentEmail={}", studentEmail, ex);
            return ResponseEntity.status(500).body(List.of());
        }
    }

    @DeleteMapping("/notifications/{id}")
    public ResponseEntity<?> clearNotification(@PathVariable Long id, @RequestParam(required = false) String studentEmail) {
        try {
            // Find the current student
            Student student = null;
            if (studentEmail != null && !studentEmail.isBlank()) {
                student = studentRepository.findByEmailIgnoreCase(studentEmail.trim()).orElse(null);
            }
            if (student == null) {
                List<Student> students = studentRepository.findAll();
                if (students.isEmpty()) return ResponseEntity.notFound().build();
                student = students.get(0);
            }

            // Find the query and verify it belongs to this student
            Optional<StudentQuery> queryOpt = queryRepository.findById(id);
            if (queryOpt.isPresent() && queryOpt.get().getStudent() != null && 
                queryOpt.get().getStudent().getId().equals(student.getId())) {
                queryRepository.deleteById(id);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception ex) {
            log.error("error clearing notification for studentEmail={}, id={}", studentEmail, id, ex);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/link-teacher")
    public ResponseEntity<?> linkTeacher(@RequestBody LinkRequest body) {
        if (body.studentEmail == null || body.teacherEmail == null || body.subjectId == null || body.subjectId.isBlank()) return ResponseEntity.badRequest().body("subjectId is required");

        String studentEmail = body.studentEmail == null ? null : body.studentEmail.trim().toLowerCase();
        String teacherEmail = body.teacherEmail == null ? null : body.teacherEmail.trim().toLowerCase();

        Student student = studentRepository.findByEmail(studentEmail).orElseGet(() -> {
            Student s = new Student(); s.setEmail(studentEmail); s.setName(body.studentName == null ? (studentEmail != null ? studentEmail.split("@")[0] : null) : body.studentName); return studentRepository.save(s);
        });

        Teacher teacher = teacherRepository.findByEmail(teacherEmail).orElseGet(() -> {
            Teacher t = new Teacher(); t.setEmail(teacherEmail); t.setName(body.teacherName == null ? (teacherEmail != null ? teacherEmail.split("@")[0] : null) : body.teacherName); return teacherRepository.save(t);
        });

        student.setTeacher(teacher);
        if (body.subjectId != null) student.setSubject(body.subjectId);
        studentRepository.save(student);

        // create enrollment for student-teacher-subject (avoid duplicates)
        if (body.subjectId != null) {
            Optional<Enrollment> existing = enrollmentRepository.findByStudentAndSubjectId(student, body.subjectId);
            if (existing.isEmpty()) {
                Enrollment e = new Enrollment();
                e.setStudent(student);
                e.setTeacher(teacher);
                e.setSubjectId(body.subjectId);
                enrollmentRepository.save(e);
            }
        }

        return ResponseEntity.ok().build();
    }

    public static class LinkRequest {
        public String studentEmail;
        public String studentName;
        public String teacherEmail;
        public String teacherName;
        public String subjectId;
    }

    public static class NotificationDto { 
        public String id; 
        public String message; 
        public String date; 
        public String reply; // Add reply field for teacher responses
    }

    public static class ResultDto {
        public String subject;
        public String semester;
        public Integer marks;
        public Integer maxMarks;
    }

    public static class AttendanceDto {
        public String subject;
        public Integer present;
        public Integer total;
    }

    public static class AssignmentDto {
        public Long id;
        public String title;
        public String description;
        public String subjectId;
        public String filePath;
        public String createdAt;
        public boolean submitted;
        public String submissionNotes;
        public String submittedAt;
    }
}
