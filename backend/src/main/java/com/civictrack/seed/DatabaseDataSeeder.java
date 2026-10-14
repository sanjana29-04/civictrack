package com.civictrack.seed;

import com.civictrack.modules.comment.IncidentComment;
import com.civictrack.modules.comment.CommentRepository;
import com.civictrack.modules.duplicate.CandidateStatus;
import com.civictrack.modules.duplicate.DuplicateCandidate;
import com.civictrack.modules.duplicate.DuplicateCandidateRepository;
import com.civictrack.modules.incident.Incident;
import com.civictrack.modules.incident.IncidentCategory;
import com.civictrack.modules.incident.IncidentPriority;
import com.civictrack.modules.incident.IncidentRepository;
import com.civictrack.modules.incident.IncidentStatus;
import com.civictrack.modules.notification.NotificationService;
import com.civictrack.modules.resolution.ResolutionEvidence;
import com.civictrack.modules.resolution.ResolutionEvidenceRepository;
import com.civictrack.modules.timeline.TimelineEventType;
import com.civictrack.modules.timeline.TimelineService;
import com.civictrack.modules.user.Role;
import com.civictrack.modules.user.User;
import com.civictrack.modules.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class DatabaseDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseDataSeeder.class);

    private final UserRepository userRepository;
    private final IncidentRepository incidentRepository;
    private final DuplicateCandidateRepository duplicateCandidateRepository;
    private final ResolutionEvidenceRepository resolutionEvidenceRepository;
    private final CommentRepository commentRepository;
    private final TimelineService timelineService;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;

    public DatabaseDataSeeder(UserRepository userRepository,
                              IncidentRepository incidentRepository,
                              DuplicateCandidateRepository duplicateCandidateRepository,
                              ResolutionEvidenceRepository resolutionEvidenceRepository,
                              CommentRepository commentRepository,
                              TimelineService timelineService,
                              NotificationService notificationService,
                              PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.incidentRepository = incidentRepository;
        this.duplicateCandidateRepository = duplicateCandidateRepository;
        this.resolutionEvidenceRepository = resolutionEvidenceRepository;
        this.commentRepository = commentRepository;
        this.timelineService = timelineService;
        this.notificationService = notificationService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial development seed.");
            return;
        }

        log.info("Seeding realistic development demonstration data for CivicTrack 2.0...");

        // 1. Seed Demo Accounts
        String defaultPasswordHash = passwordEncoder.encode("Password123!");

        User citizen = new User("citizen@civictrack.org", defaultPasswordHash, "Priya Sharma", "+91 98765 43210", Role.ROLE_CITIZEN);
        User moderator = new User("moderator@civictrack.org", defaultPasswordHash, "Rajesh Patel", "+91 98765 43211", Role.ROLE_MODERATOR);
        User staff = new User("staff@civictrack.org", defaultPasswordHash, "Anil Verma (PWD)", "+91 98765 43212", Role.ROLE_OPERATIONS);
        User citizen2 = new User("arun.nair@example.com", defaultPasswordHash, "Arun Nair", "+91 98765 43213", Role.ROLE_CITIZEN);

        citizen = userRepository.save(citizen);
        moderator = userRepository.save(moderator);
        staff = userRepository.save(staff);
        citizen2 = userRepository.save(citizen2);

        Instant now = Instant.now();

        // 2. Incident 1: Severe Road Pothole (In Progress, high priority)
        Incident inc1 = new Incident();
        inc1.setIncidentNumber("CIV-2026-1011");
        inc1.setTitle("Dangerous deep crater pothole near City Center Metro Junction");
        inc1.setDescription("Deep pothole spanning approximately 1.5 meters across the left vehicular lane directly opposite the metro station exit. Causes severe skidding for two-wheelers especially during evening traffic.");
        inc1.setCategory(IncidentCategory.ROADS_POTHOLES);
        inc1.setStatus(IncidentStatus.IN_PROGRESS);
        inc1.setPriority(IncidentPriority.CRITICAL);
        inc1.setPriorityReason("Evaluated as CRITICAL due to explicit vehicular safety hazard, deep asphalt depression, and high commute traffic density.");
        inc1.setAiSuggestedCategory(IncidentCategory.ROADS_POTHOLES);
        inc1.setAiSuggestedPriority(IncidentPriority.CRITICAL);
        inc1.setAiPriorityReason("Severe road surface cavity identified. High accident risk for two-wheelers.");
        inc1.setAiConfidence(0.92);
        inc1.setAiSimulated(true);
        inc1.setLatitude(12.9716);
        inc1.setLongitude(77.5946);
        inc1.setAddress("MG Road, Metro Pillar 142");
        inc1.setLandmark("Opposite Metro Station Exit B");
        inc1.setIsApproximateLocation(false);
        inc1.setPrimaryPhotoUrl("https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80");
        inc1.setReporter(citizen);
        inc1.setAssignedTeam("Roads & Bridges Quick Response Team 4");
        inc1.setAssignedStaff(staff);
        inc1.setSupportCount(14);
        inc1.setOfficialReferenceNumber("BBMP-RD-2026-8941");
        inc1 = incidentRepository.save(inc1);

        timelineService.recordEvent(inc1, TimelineEventType.REPORT_SUBMITTED, citizen.getFullName(), "CITIZEN", "Citizen submitted report with photograph.", inc1.getPrimaryPhotoUrl(), true);
        timelineService.recordEvent(inc1, TimelineEventType.REVIEW_COMPLETED, moderator.getFullName(), "ROLE_MODERATOR", "Verified as acute road safety hazard. Triage priority confirmed.", null, true);
        timelineService.recordEvent(inc1, TimelineEventType.ASSIGNED, staff.getFullName(), "ROLE_OPERATIONS", "Assigned to PWD Quick Response Team 4 with priority work order.", null, true);
        timelineService.recordEvent(inc1, TimelineEventType.WORK_STARTED, staff.getFullName(), "ROLE_OPERATIONS", "Asphalt hot-mix road patch crew dispatched on-site.", null, true);

        // 3. Incident 2: Possible Duplicate of Incident 1 (Near same junction)
        Incident inc2 = new Incident();
        inc2.setIncidentNumber("CIV-2026-1012");
        inc2.setTitle("Big pothole on MG Road near Metro pillar 145");
        inc2.setDescription("Large crater in the middle of the road causing heavy traffic slowdown and dangerous bike swerving near pillar 145.");
        inc2.setCategory(IncidentCategory.ROADS_POTHOLES);
        inc2.setStatus(IncidentStatus.UNDER_REVIEW);
        inc2.setPriority(IncidentPriority.HIGH);
        inc2.setPriorityReason("Roads category with explicit danger and traffic disruption keyword match.");
        inc2.setAiSuggestedCategory(IncidentCategory.ROADS_POTHOLES);
        inc2.setAiSuggestedPriority(IncidentPriority.HIGH);
        inc2.setAiPriorityReason("Road surface defect located near major public transit terminal.");
        inc2.setAiConfidence(0.88);
        inc2.setAiSimulated(true);
        inc2.setLatitude(12.9720);
        inc2.setLongitude(77.5950);
        inc2.setAddress("MG Road, Metro Pillar 145");
        inc2.setLandmark("Near Metro Gate 3");
        inc2.setIsApproximateLocation(false);
        inc2.setPrimaryPhotoUrl("https://images.unsplash.com/photo-1599818815779-7128532442ee?w=800&auto=format&fit=crop&q=80");
        inc2.setReporter(citizen2);
        inc2.setSupportCount(3);
        inc2 = incidentRepository.save(inc2);

        timelineService.recordEvent(inc2, TimelineEventType.REPORT_SUBMITTED, citizen2.getFullName(), "CITIZEN", "Submitted report for pothole near pillar 145.", inc2.getPrimaryPhotoUrl(), true);

        // Register duplicate candidate between inc2 and inc1 (approx 60 meters apart)
        DuplicateCandidate dupCandidate = new DuplicateCandidate(
                inc2,
                inc1,
                65.4,
                0.78,
                true,
                0.86,
                "Located 65 meters away on identical MG Road corridor. Both describe severe pothole craters affecting traffic."
        );
        duplicateCandidateRepository.save(dupCandidate);

        // 4. Incident 3: Resolved - Awaiting Verification (With before and after evidence!)
        Incident inc3 = new Incident();
        inc3.setIncidentNumber("CIV-2026-1025");
        inc3.setTitle("Blocked drainage culvert causing knee-deep waterlogging on 12th Main");
        inc3.setDescription("Severe monsoon water stagnation due to plastic and debris blockage in the stormwater conduit. Pedestrian walkway completely submerged.");
        inc3.setCategory(IncidentCategory.DRAINAGE_WATERLOGGING);
        inc3.setStatus(IncidentStatus.RESOLVED_AWAITING_VERIFICATION);
        inc3.setPriority(IncidentPriority.HIGH);
        inc3.setPriorityReason("Drainage blockage causing public health risk and pedestrian obstruction.");
        inc3.setAiSuggestedCategory(IncidentCategory.DRAINAGE_WATERLOGGING);
        inc3.setAiSuggestedPriority(IncidentPriority.HIGH);
        inc3.setAiPriorityReason("Stormwater runoff impediment detected.");
        inc3.setAiConfidence(0.90);
        inc3.setAiSimulated(true);
        inc3.setLatitude(12.9352);
        inc3.setLongitude(77.6245);
        inc3.setAddress("12th Main Road, Koramangala 4th Block");
        inc3.setLandmark("Near Community Park Entry");
        inc3.setIsApproximateLocation(false);
        inc3.setPrimaryPhotoUrl("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80");
        inc3.setReporter(citizen);
        inc3.setAssignedTeam("Stormwater Sanitation Wing");
        inc3.setAssignedStaff(staff);
        inc3.setSupportCount(8);
        inc3.setResolvedAt(now.minus(4, ChronoUnit.HOURS));
        inc3.setOfficialReferenceNumber("SWD-2026-4421");
        inc3 = incidentRepository.save(inc3);

        timelineService.recordEvent(inc3, TimelineEventType.REPORT_SUBMITTED, citizen.getFullName(), "CITIZEN", "Waterlogging report submitted.", inc3.getPrimaryPhotoUrl(), true);
        timelineService.recordEvent(inc3, TimelineEventType.REVIEW_COMPLETED, moderator.getFullName(), "ROLE_MODERATOR", "Triage confirmed.", null, true);
        timelineService.recordEvent(inc3, TimelineEventType.ASSIGNED, staff.getFullName(), "ROLE_OPERATIONS", "Assigned to stormwater desilting crew.", null, true);
        timelineService.recordEvent(inc3, TimelineEventType.RESOLUTION_PROPOSED, staff.getFullName(), "ROLE_OPERATIONS", "Desilted 40 meters of stormwater culvert, removed debris obstruction, and restored full hydraulic outflow.", "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80", true);

        // Save resolution evidence record
        ResolutionEvidence resEvidence = new ResolutionEvidence();
        resEvidence.setIncident(inc3);
        resEvidence.setProposedBy(staff);
        resEvidence.setResolutionSummary("Excavated silt and plastic blockage from 12th Main culvert. Water completely drained and culvert flow rate verified.");
        resEvidence.setInternalNotes("Contractor ref: KOR-SWD-981. Disposed 1.2 metric tons of silt at designated processing facility.");
        resEvidence.setBeforePhotoUrl(inc3.getPrimaryPhotoUrl());
        resEvidence.setAfterPhotoUrl("https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80");
        resEvidence.setWorkOrderReference("WO-SWD-981");
        resEvidence.setConfirmationCount(1);
        resEvidence.setDisputeCount(0);
        resolutionEvidenceRepository.save(resEvidence);

        // 5. Incident 4: Reopened Incident (Demonstrating citizen dispute accountability)
        Incident inc4 = new Incident();
        inc4.setIncidentNumber("CIV-2026-1030");
        inc4.setTitle("Broken streetlight pole with dangling live cables near Primary School");
        inc4.setDescription("Heavy pole leaning at 45 degrees with exposed wiring hanging near children's pedestrian sidewalk.");
        inc4.setCategory(IncidentCategory.STREETLIGHTS);
        inc4.setStatus(IncidentStatus.REOPENED);
        inc4.setPriority(IncidentPriority.CRITICAL);
        inc4.setPriorityReason("Critical electrocution and structural collapse hazard adjacent to school.");
        inc4.setAiSuggestedCategory(IncidentCategory.STREETLIGHTS);
        inc4.setAiSuggestedPriority(IncidentPriority.CRITICAL);
        inc4.setAiPriorityReason("Live wire and pedestrian vulnerability identified in school zone.");
        inc4.setAiConfidence(0.95);
        inc4.setAiSimulated(true);
        inc4.setLatitude(12.9279);
        inc4.setLongitude(77.6271);
        inc4.setAddress("80 Feet Road, 6th Block");
        inc4.setLandmark("Beside St. Paul's School");
        inc4.setIsApproximateLocation(false);
        inc4.setPrimaryPhotoUrl("https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop&q=80");
        inc4.setReporter(citizen2);
        inc4.setAssignedTeam("Electrical & Streetlight Grid");
        inc4.setAssignedStaff(staff);
        inc4.setSupportCount(19);
        inc4 = incidentRepository.save(inc4);

        timelineService.recordEvent(inc4, TimelineEventType.REPORT_SUBMITTED, citizen2.getFullName(), "CITIZEN", "Initial report submitted.", inc4.getPrimaryPhotoUrl(), true);
        timelineService.recordEvent(inc4, TimelineEventType.RESOLUTION_PROPOSED, staff.getFullName(), "ROLE_OPERATIONS", "Temporary tape applied to wiring.", null, true);
        timelineService.recordEvent(inc4, TimelineEventType.RESOLUTION_DISPUTED, citizen2.getFullName(), "CITIZEN", "Citizen disputed: Wire insulation detached within 2 hours; pole remains structurally tilted. Immediate replacement required.", "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop&q=80", true);
        timelineService.recordEvent(inc4, TimelineEventType.REOPENED, moderator.getFullName(), "ROLE_MODERATOR", "Moderator reviewed dispute and reopened incident for full pole re-installation.", null, true);

        // 6. Incident 5: Garbage & Sanitation (Confirmed, awaiting assignment)
        Incident inc5 = new Incident();
        inc5.setIncidentNumber("CIV-2026-1044");
        inc5.setTitle("Illegal garbage dumping and overflowing municipal bin");
        inc5.setDescription("Multiple cubic meters of commercial and domestic waste overflowing onto sidewalk for past 4 days.");
        inc5.setCategory(IncidentCategory.GARBAGE_SANITATION);
        inc5.setStatus(IncidentStatus.CONFIRMED);
        inc5.setPriority(IncidentPriority.MEDIUM);
        inc5.setPriorityReason("Public sanitation and neighborhood hygiene concern.");
        inc5.setLatitude(12.9856);
        inc5.setLongitude(77.6057);
        inc5.setAddress("Commercial Street Cross, Tasker Town");
        inc5.setLandmark("Behind Municipal Market Complex");
        inc5.setPrimaryPhotoUrl("https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80");
        inc5.setReporter(citizen);
        inc5.setSupportCount(6);
        inc5 = incidentRepository.save(inc5);

        timelineService.recordEvent(inc5, TimelineEventType.REPORT_SUBMITTED, citizen.getFullName(), "CITIZEN", "Report submitted.", inc5.getPrimaryPhotoUrl(), true);
        timelineService.recordEvent(inc5, TimelineEventType.REVIEW_COMPLETED, moderator.getFullName(), "ROLE_MODERATOR", "Verified with sanitation supervisor.", null, true);

        // Add comments
        IncidentComment c1 = new IncidentComment(inc1, citizen, "This pothole caused a delivery rider to slip this morning. Please fix urgently!", false);
        IncidentComment c2 = new IncidentComment(inc1, staff, "PWD hot-mix repair truck is en route. Expected completion by 4:00 PM today.", false);
        IncidentComment c3 = new IncidentComment(inc1, staff, "INTERNAL: Traffic police permission secured for 1-lane closure between 2 PM and 4 PM.", true);
        commentRepository.save(c1);
        commentRepository.save(c2);
        commentRepository.save(c3);

        // Add notifications
        notificationService.createNotification(citizen, "Resolution Proposed for CIV-2026-1025", "Operations proposed completion for your drainage report. Please verify.", inc3.getId(), "RESOLUTION_PROPOSED");
        notificationService.createNotification(citizen2, "Incident Reopened: CIV-2026-1030", "Your dispute regarding the leaning streetlight was approved. PWD will replace pole.", inc4.getId(), "INCIDENT_REOPENED");

        log.info("Successfully seeded CivicTrack demonstration data!");
        log.info("Demo accounts created: citizen@civictrack.org, moderator@civictrack.org, staff@civictrack.org (Password: Password123!)");
    }
}
