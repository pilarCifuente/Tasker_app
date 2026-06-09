package com.tasker.taskerApp.services.implementations;

import com.tasker.taskerApp.DTOs.TaskRequestDTO;
import com.tasker.taskerApp.DTOs.TaskResponseDTO;
import com.tasker.taskerApp.entities.TaskEntity;
import com.tasker.taskerApp.entities.enums.TaskPriority;
import com.tasker.taskerApp.entities.enums.TaskStatus;
import com.tasker.taskerApp.exceptions.ResourceNotFoundException;
import com.tasker.taskerApp.repositories.TaskRepository;
import com.tasker.taskerApp.services.TaskService;
import jakarta.persistence.EntityNotFoundException;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Data
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Override
    public TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO) {

        if (taskRequestDTO.getTitle() == null || taskRequestDTO.getTitle().isBlank()) {
            throw new IllegalArgumentException("El título es obligatorio");
        }

        TaskEntity task = new TaskEntity();
        task.setTitle(taskRequestDTO.getTitle());
        task.setDescription(taskRequestDTO.getDescription());
        task.setDueDate(taskRequestDTO.getDueDate());
        task.setCreatedAt(LocalDateTime.now());

        task.setStatus(taskRequestDTO.getStatus() != null ? taskRequestDTO.getStatus() : TaskStatus.PENDING);
        task.setPriority(taskRequestDTO.getPriority() != null ? taskRequestDTO.getPriority() : TaskPriority.MEDIUM);

        TaskEntity savedTask = taskRepository.save(task);

        return mapToResponseDTO(savedTask);
    }


    @Override
    public List<TaskResponseDTO> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Override
    public TaskResponseDTO getTaskById(Integer id) {
        TaskEntity task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task no encontrada con id: " + id));

        return mapToResponseDTO(task);
    }

    @Override
    public TaskResponseDTO updateTask(Integer id, TaskRequestDTO taskRequestDTO) {
        TaskEntity taskEntity = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task no encontrada con id: " + id));

        if (taskRequestDTO.getTitle() != null) {
            taskEntity.setTitle(taskRequestDTO.getTitle());
        }

        if (taskRequestDTO.getDescription() != null) {
            taskEntity.setDescription(taskRequestDTO.getDescription());
        }

        if (taskRequestDTO.getDueDate() != null) {
            taskEntity.setDueDate(taskRequestDTO.getDueDate());
        }

        if (taskRequestDTO.getStatus() != null) {
            taskEntity.setStatus(taskRequestDTO.getStatus());
        }

        if (taskRequestDTO.getPriority() != null) {
            taskEntity.setPriority(taskRequestDTO.getPriority());
        }

        taskEntity.setUpdatedAt(LocalDateTime.now());

        TaskEntity savedTaskEntity = taskRepository.save(taskEntity);

        return mapToResponseDTO(savedTaskEntity);
    }

    @Override
    public TaskResponseDTO  taskInProcess(Integer id) {
        TaskEntity taskEntity = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task no encontrada con id: " + id));
        if (taskEntity.getStatus() == TaskStatus.COMPLETED) {
            return mapToResponseDTO(taskEntity);
        }
        taskEntity.setStatus(TaskStatus.IN_PROGRESS);
        taskEntity.setUpdatedAt(LocalDateTime.now());
        TaskEntity savedTaskEntity = taskRepository.save(taskEntity);
        return mapToResponseDTO(savedTaskEntity);
    }

    @Override
    public TaskResponseDTO  completeTask(Integer id) {
        TaskEntity taskEntity = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task no encontrada con id: " + id));
        if (taskEntity.getStatus() == TaskStatus.COMPLETED) {
            return mapToResponseDTO(taskEntity);
        }
        taskEntity.setStatus(TaskStatus.COMPLETED);
        taskEntity.setUpdatedAt(LocalDateTime.now());
        TaskEntity savedTaskEntity = taskRepository.save(taskEntity);
        return mapToResponseDTO(savedTaskEntity);
    }

    @Override
    public void deleteTask(Integer id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task no encontrada con id: " + id);
        }
        taskRepository.deleteById(id);
    }

    @Override
    public List<TaskResponseDTO> getTasksByStatus(TaskStatus status) {

        List<TaskEntity> tasks = taskRepository.findByStatus(status);

        if (tasks.isEmpty()) {
            throw new ResourceNotFoundException("No hay tareas con status: " + status);
        }

        return tasks.stream()
                .map(this::mapToResponseDTO)
                .toList();
    }



    @Override
    public TaskResponseDTO mapToResponseDTO(TaskEntity task) {
         return TaskResponseDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                 .createdAt(task.getCreatedAt())
                 .updatedAt(task.getUpdatedAt())
                .dueDate(task.getDueDate())
                .status(task.getStatus())
                 .priority(task.getPriority())
                .build();
    }

    @Override
    public TaskEntity mapToEntity(TaskRequestDTO taskRequestDTO) {
        return TaskEntity.builder()
                .title(taskRequestDTO.getTitle())
                .description(taskRequestDTO.getDescription())
                .dueDate(taskRequestDTO.getDueDate())
                .status(taskRequestDTO.getStatus())
                .priority(taskRequestDTO.getPriority())
                .build();
    }
}
