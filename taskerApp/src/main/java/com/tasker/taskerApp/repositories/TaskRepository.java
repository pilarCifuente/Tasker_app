package com.tasker.taskerApp.repositories;

import com.tasker.taskerApp.entities.TaskEntity;
import com.tasker.taskerApp.entities.enums.TaskStatus;
import com.tasker.taskerApp.services.TaskService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, Integer> {
    List<TaskEntity> findByStatus(TaskStatus status);
}
