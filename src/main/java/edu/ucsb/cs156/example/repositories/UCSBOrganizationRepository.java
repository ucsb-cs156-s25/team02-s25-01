package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.UCSBOrganization;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * The UCSBOrganizationRepository is a repository for UCSBOrganization entities.
 */

@Repository
public interface UCSBOrganizationRepository extends CrudRepository<UCSBOrganization, Long> {

    Optional<UCSBOrganization> findByOrgCode(String orgCode);
}

