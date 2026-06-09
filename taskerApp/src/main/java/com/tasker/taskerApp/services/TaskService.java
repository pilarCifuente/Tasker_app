package com.tasker.taskerApp.services;

import com.tasker.taskerApp.DTOs.TaskRequestDTO;
import com.tasker.taskerApp.DTOs.TaskResponseDTO;
import com.tasker.taskerApp.entities.TaskEntity;
import com.tasker.taskerApp.entities.enums.TaskStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TaskService {
    TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO);

    List<TaskResponseDTO> getAllTasks();

    TaskResponseDTO getTaskById(Integer id);

    TaskResponseDTO updateTask(Integer id, TaskRequestDTO task);

    TaskResponseDTO taskInProcess(Integer id);

    TaskResponseDTO completeTask(Integer id);

    void deleteTask(Integer id);

    List<TaskResponseDTO> getTasksByStatus(TaskStatus status);

    TaskResponseDTO mapToResponseDTO(TaskEntity task);

    TaskEntity mapToEntity(TaskRequestDTO taskRequestDTO);
}
