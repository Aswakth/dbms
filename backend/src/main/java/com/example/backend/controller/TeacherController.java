package com.example.backend.controller;

import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    private final AssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final StudentQueryRepository queryRepository;
    private final ResultRepository resultRepository;
    private final FileStorageService fileStorageService;
    private final TeacherRepository teacherRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AssignmentSubmissionRepository assignmentSubmissionRepository;

    public TeacherController(AssignmentRepository assignmentRepository,
                             StudentRepository studentRepository,
                             AttendanceRepository attendanceRepository,
                             StudentQueryRepository queryRepository,
                             ResultRepository resultRepository,
                             FileStorageService fileStorageService,
                             TeacherRepository teacherRepository,
                             EnrollmentRepository enrollmentRepository,
                             AssignmentSubmissionRepository assignmentSubmissionRepository) {
        this.assignmentRepository = assignmentRepository;
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.queryRepository = queryRepository;
        this.resultRepository = resultRepository;
        this.fileStorageService = fileStorageService;
        this.teacherRepository = teacherRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.assignmentSubmissionRepository = assignmentSubmissionRepository;
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationDto>> notifications(@RequestParam(required = false) String teacherEmail) {
        System.out.println("Teacher notifications requested for email: " + teacherEmail);
        List<StudentQuery> allQueries = queryRepository.findAll();
        System.out.println("Found " + allQueries.size() + " total queries");
        
        List<NotificationDto> list = allQueries.stream().map(q -> {
            NotificationDto n = new NotificationDto();
            n.id = String.valueOf(q.getId());
            // Show student's email (helps teacher identify sender). If student missing, show "No Student" placeholder.
            n.studentName = q.getStudent() != null ? q.getStudent().getEmail() : "No Student";
            n.query = q.getMessage();
            n.date = q.getCreatedAt().toLocalDate().toString();
            // Include reply if available
            if (q.getReply() != null && !q.getReply().isBlank()) {
                n.reply = q.getReply();
                System.out.println("Query " + q.getId() + " has reply: " + q.getReply());
            } else {
                System.out.println("Query " + q.getId() + " has no reply");
            }
            return n;
        }).toList();
        
        System.out.println("Returning " + list.size() + " notifications");
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/notifications/{id}")
    public ResponseEntity<?> clearNotification(@PathVariable Long id, @RequestParam(required = false) String teacherEmail) {
        try {
            System.out.println("Attempting to delete notification with id: " + id);
            // Find the query and delete it (teachers can delete any query)
            Optional<StudentQuery> queryOpt = queryRepository.findById(id);
            if (queryOpt.isPresent()) {
                System.out.println("Found query to delete: " + queryOpt.get().getMessage());
                queryRepository.deleteById(id);
                System.out.println("Successfully deleted query with id: " + id);
                return ResponseEntity.ok().build();
            } else {
                System.out.println("Query with id " + id + " not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception ex) {
            System.out.println("Error deleting query: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    public static class NotificationDto { 
        public String id; 
        public String studentName; 
        public String query; 
        public String date; 
        public String reply; // Add reply field for teacher responses
    }

    @PostMapping("/assignments/upload")
    public ResponseEntity<?> uploadAssignment(@RequestParam("title") String title,
                                              @RequestParam("description") String description,
                                              @RequestParam("subjectId") String subjectId,
                                              @RequestParam("teacherEmail") String teacherEmail,
                                              @RequestParam(value = "file", required = false) MultipartFile file) throws Exception {
        // Find the teacher
        String teacherEmailNorm = teacherEmail.trim().toLowerCase();
        Optional<Teacher> teacherOpt = teacherRepository.findByEmail(teacherEmailNorm);
        if (teacherOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Teacher not found");
        }
        
        Assignment a = new Assignment();
        a.setTitle(title);
        a.setDescription(description);
        a.setSubjectId(subjectId);
        a.setTeacher(teacherOpt.get());
        
        if (file != null && !file.isEmpty()) {
            String path = fileStorageService.storeFile(file);
            a.setFilePath(path);
        }
        
        assignmentRepository.save(a);
        
        // Create notifications for all students enrolled in this subject
        List<Enrollment> enrollments = enrollmentRepository.findByTeacherAndSubjectId(teacherOpt.get(), subjectId);
        for (Enrollment enrollment : enrollments) {
            StudentQuery notification = new StudentQuery();
            notification.setStudent(enrollment.getStudent());
            notification.setMessage("New assignment posted: " + title);
            notification.setTeacher(teacherOpt.get());
            queryRepository.save(notification);
        }
        
        return ResponseEntity.ok().build();
    }

    @GetMapping("/assignments/{assignmentId}/submissions")
    public ResponseEntity<List<AssignmentSubmissionDto>> getAssignmentSubmissions(@PathVariable Long assignmentId) {
        Optional<Assignment> assignmentOpt = assignmentRepository.findById(assignmentId);
        if (assignmentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<AssignmentSubmission> submissions = assignmentSubmissionRepository.findByAssignment(assignmentOpt.get());
        List<AssignmentSubmissionDto> dtoList = submissions.stream().map(s -> {
            AssignmentSubmissionDto dto = new AssignmentSubmissionDto();
            dto.id = s.getId();
            dto.studentName = s.getStudent().getName();
            dto.studentEmail = s.getStudent().getEmail();
            dto.filePath = s.getFilePath();
            dto.submissionNotes = s.getSubmissionNotes();
            dto.submittedAt = s.getSubmittedAt().toString();
            return dto;
        }).toList();
        
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/assignments/submissions")
    public ResponseEntity<List<AssignmentSubmissionDto>> getAssignmentSubmissionsByTeacher(@RequestParam String teacherEmail) {
        String teacherEmailNorm = teacherEmail.trim().toLowerCase();
        Optional<Teacher> teacherOpt = teacherRepository.findByEmail(teacherEmailNorm);
        if (teacherOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        List<Assignment> assignments = assignmentRepository.findByTeacher(teacherOpt.get());
        List<AssignmentSubmissionDto> allSubmissions = new ArrayList<>();
        
        for (Assignment assignment : assignments) {
            List<AssignmentSubmission> submissions = assignmentSubmissionRepository.findByAssignment(assignment);
            for (AssignmentSubmission submission : submissions) {
                AssignmentSubmissionDto dto = new AssignmentSubmissionDto();
                dto.id = submission.getId();
                dto.studentName = submission.getStudent().getName();
                dto.studentEmail = submission.getStudent().getEmail();
                dto.assignmentTitle = submission.getAssignment().getTitle();
                dto.subjectId = submission.getAssignment().getSubjectId();
                dto.submissionNotes = submission.getSubmissionNotes();
                dto.submittedAt = submission.getSubmittedAt().toString();
                dto.filePath = submission.getFilePath();
                allSubmissions.add(dto);
            }
        }
        
        return ResponseEntity.ok(allSubmissions);
    }

    @GetMapping("/queries")
    public ResponseEntity<List<QueryDto>> listQueries() {
        List<QueryDto> list = queryRepository.findAll().stream().map(q -> {
            QueryDto d = new QueryDto();
            d.id = String.valueOf(q.getId());
            d.studentEmail = q.getStudent() != null ? q.getStudent().getEmail() : "unknown@";
            d.message = q.getMessage();
            d.reply = q.getReply();
            d.date = q.getCreatedAt().toLocalDate().toString();
            return d;
        }).toList();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/queries/{id}/reply")
    public ResponseEntity<?> replyToQuery(@PathVariable Long id, @RequestBody Map<String,String> body) {
        Optional<StudentQuery> q = queryRepository.findById(id);
        if (q.isPresent()) {
            StudentQuery sq = q.get();
            sq.setReply(body.get("reply"));
            queryRepository.save(sq);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/classes/{teacherEmail}/students")
    public ResponseEntity<List<StudentDto>> studentsInClass(@PathVariable String teacherEmail,
                                                            @RequestParam String subjectId,
                                                            @RequestParam(required = false) String date,
                                                            @RequestParam(required = false) String semester) {
        String teacherEmailNorm = teacherEmail == null ? null : teacherEmail.trim().toLowerCase();
        Optional<Teacher> t = teacherRepository.findByEmail(teacherEmailNorm);
        if (t.isEmpty()) return ResponseEntity.ok(List.of());
        List<Enrollment> enrollments = enrollmentRepository.findByTeacherAndSubjectId(t.get(), subjectId);
        List<StudentDto> list = enrollments.stream().map(e -> {
            Student s = e.getStudent(); StudentDto d = new StudentDto(); d.id = s.getId(); d.name = s.getName(); return d;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping("/classes/{teacherEmail}/attendance")
    public ResponseEntity<?> submitAttendance(@PathVariable String teacherEmail, @RequestParam String subjectId, @RequestBody AttendanceSubmit body) {
        String teacherEmailNorm = teacherEmail == null ? null : teacherEmail.trim().toLowerCase();
        Optional<Teacher> t = teacherRepository.findByEmail(teacherEmailNorm);
        if (t.isEmpty()) return ResponseEntity.badRequest().build();
        Teacher teacher = t.get();
        if (body.date == null || body.date.isBlank()) return ResponseEntity.badRequest().body("date is required");
        for (AttendanceSubmit.Att a : body.attendance) {
            Optional<Student> sOpt = studentRepository.findById(a.id);
            if (sOpt.isPresent()) {
                Attendance att = new Attendance();
                att.setStudent(sOpt.get());
                att.setDate(LocalDate.parse(body.date));
                att.setPresent(a.present);
                att.setTeacher(teacher);
                att.setSubjectId(subjectId);
                attendanceRepository.save(att);
            }
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/classes/{teacherEmail}/results")
    public ResponseEntity<List<ResultDto>> getResultsForClass(@PathVariable String teacherEmail,
                                                              @RequestParam String subjectId) {
        String teacherEmailNorm = teacherEmail == null ? null : teacherEmail.trim().toLowerCase();
        Optional<Teacher> t = teacherRepository.findByEmail(teacherEmailNorm);
        if (t.isEmpty()) return ResponseEntity.ok(List.of());
        
        List<Enrollment> enrollments = enrollmentRepository.findByTeacherAndSubjectId(t.get(), subjectId);
        List<ResultDto> results = new ArrayList<>();
        
        for (Enrollment enrollment : enrollments) {
            List<Result> studentResults = resultRepository.findByStudentAndSubjectId(enrollment.getStudent(), subjectId);
            for (Result result : studentResults) {
                ResultDto dto = new ResultDto();
                dto.studentId = result.getStudent().getId();
                dto.studentName = result.getStudent().getName();
                dto.subject = result.getSubjectId();
                dto.semester = result.getSemester();
                dto.marks = result.getMarks();
                dto.maxMarks = result.getMaxMarks();
                results.add(dto);
            }
        }
        
        return ResponseEntity.ok(results);
    }

    @PostMapping("/classes/{teacherEmail}/results")
    public ResponseEntity<?> submitResults(@PathVariable String teacherEmail, 
                                           @RequestParam String subjectId, 
                                           @RequestBody ResultSubmit body) {
        String teacherEmailNorm = teacherEmail == null ? null : teacherEmail.trim().toLowerCase();
        Optional<Teacher> t = teacherRepository.findByEmail(teacherEmailNorm);
        if (t.isEmpty()) return ResponseEntity.badRequest().build();
        Teacher teacher = t.get();
        
        if (body.semester == null || body.semester.isBlank()) {
            return ResponseEntity.badRequest().body("semester is required");
        }
        
        for (ResultSubmit.ResultData resultData : body.results) {
            Optional<Student> sOpt = studentRepository.findById(resultData.studentId);
            if (sOpt.isPresent()) {
                Result result = new Result();
                result.setStudent(sOpt.get());
                result.setSemester(body.semester);
                result.setMarks(resultData.marks);
                result.setMaxMarks(resultData.maxMarks != null ? resultData.maxMarks : 100);
                result.setSubjectId(subjectId);
                resultRepository.save(result);
            }
        }
        return ResponseEntity.ok().build();
    }

    public static class StudentDto { public Long id; public String name; }

    public static class QueryDto { public String id; public String studentEmail; public String message; public String reply; public String date; }

    public static class AttendanceSubmit {
        public String date;
        public List<Att> attendance;
        public static class Att { public Long id; public boolean present; }
    }

    public static class ResultDto {
        public Long studentId;
        public String studentName;
        public String subject;
        public String semester;
        public Integer marks;
        public Integer maxMarks;
    }

    public static class ResultSubmit {
        public String semester;
        public List<ResultData> results;
        public static class ResultData {
            public Long studentId;
            public Integer marks;
            public Integer maxMarks;
        }
    }

    public static class AssignmentSubmissionDto {
        public Long id;
        public String studentName;
        public String studentEmail;
        public String assignmentTitle;
        public String subjectId;
        public String filePath;
        public String submissionNotes;
        public String submittedAt;
    }
}
