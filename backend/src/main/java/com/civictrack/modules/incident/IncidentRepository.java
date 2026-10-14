package com.civictrack.modules.incident;

import com.civictrack.modules.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, UUID>, JpaSpecificationExecutor<Incident> {

    Optional<Incident> findByIncidentNumber(String incidentNumber);

    boolean existsByIncidentNumber(String incidentNumber);

    Page<Incident> findByReporterAndMergedIntoIncidentIsNullOrderByCreatedAtDesc(User reporter, Pageable pageable);

    @Query("SELECT i FROM Incident i WHERE i.mergedIntoIncident IS NULL AND i.status != 'REJECTED' ORDER BY i.createdAt DESC")
    Page<Incident> findPublicActiveIncidents(Pageable pageable);

    @Query("SELECT i FROM Incident i WHERE i.mergedIntoIncident IS NULL AND i.status != 'REJECTED'")
    List<Incident> findAllPublicForMap();

    @Query("SELECT i FROM Incident i WHERE i.mergedIntoIncident IS NULL " +
           "AND i.latitude BETWEEN :minLat AND :maxLat " +
           "AND i.longitude BETWEEN :minLon AND :maxLon " +
           "AND i.status NOT IN ('CLOSED', 'REJECTED')")
    List<Incident> findNearbyCandidates(
            @Param("minLat") Double minLat,
            @Param("maxLat") Double maxLat,
            @Param("minLon") Double minLon,
            @Param("maxLon") Double maxLon
    );

    @Query("SELECT i FROM Incident i WHERE i.mergedIntoIncident.id = :survivingId ORDER BY i.createdAt ASC")
    List<Incident> findMergedIncidents(@Param("survivingId") UUID survivingId);

    long countByStatus(IncidentStatus status);
    long countByCategory(IncidentCategory category);
    long countByPriority(IncidentPriority priority);

    @Query("SELECT COUNT(i) FROM Incident i WHERE i.mergedIntoIncident IS NOT NULL")
    long countMergedIncidents();

    @Query("SELECT COUNT(i) FROM Incident i WHERE i.status = 'RESOLVED_AWAITING_VERIFICATION'")
    long countAwaitingVerification();

    @Query("SELECT COUNT(i) FROM Incident i WHERE i.status = 'REOPENED'")
    long countReopened();
}
