import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskPriority } from '../../../../core/models/taskPriority';
import { TaskStatus } from '../../../../core/models/taskStatus';
import { Task } from '../../../../core/models/task';
import { TaskService } from '../../../../core/services/task.service';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.css'
})
export class TaskModalComponent {
  @Output() taskCreated = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  isVisible = false;
  loading = false;
  error = '';
  isEditMode = false;

  task: Partial<Task> = this.emptyTask();

  priorities = [
    { value: TaskPriority.HIGH,   label: 'Alta' },
    { value: TaskPriority.MEDIUM, label: 'Media' },
    { value: TaskPriority.LOW,    label: 'Baja' }
  ];

  statuses = [
    { value: TaskStatus.PENDING,     label: 'Pendiente' },
    { value: TaskStatus.IN_PROGRESS, label: 'En proceso' },
    { value: TaskStatus.COMPLETED,   label: 'Completada' }
  ];

  constructor(private taskService: TaskService) {}

  open(): void {
    this.task = this.emptyTask();
    this.isEditMode = false;
    this.error = '';
    this.loading = false;
    this.isVisible = true;
    document.body.style.overflow = 'hidden';
  }

  openForEdit(task: Task): void {
    this.task = {
      ...task,
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : ''
    };
    this.isEditMode = true;
    this.error = '';
    this.loading = false;
    this.isVisible = true;
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.isVisible = false;
    document.body.style.overflow = '';
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close();
    }
  }

  submit(): void {
    if (!this.task.title?.trim()) {
      this.error = 'El título es obligatorio.';
      return;
    }

    this.loading = true;
    this.error = '';

    const taskToSend: Task = {
      ...this.task as Task,
      title: this.task.title!.trim(),
      description: this.task.description?.trim() || undefined,
      dueDate: this.task.dueDate ? `${this.task.dueDate}T00:00:00` : undefined
    };

    if (this.isEditMode && this.task.id) {
      this.taskService.update(this.task.id, taskToSend).subscribe({
        next: () => {
          this.loading = false;
          this.close();
          this.taskUpdated.emit();
        },
        error: () => {
          this.loading = false;
          this.error = 'No se pudo actualizar la tarea. Intentá de nuevo.';
        }
      });
    } else {
      this.taskService.create(taskToSend).subscribe({
        next: () => {
          this.loading = false;
          this.close();
          this.taskCreated.emit();
        },
        error: () => {
          this.loading = false;
          this.error = 'No se pudo crear la tarea. Intentá de nuevo.';
        }
      });
    }
  }

  private emptyTask(): Partial<Task> {
    return {
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.PENDING,
      dueDate: ''
    };
  }
}
