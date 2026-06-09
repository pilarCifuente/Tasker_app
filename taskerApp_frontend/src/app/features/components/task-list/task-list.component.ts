import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../core/models/task';
import { TaskStatus } from '../../../core/models/taskStatus';
import { TaskPriority } from '../../../core/models/taskPriority';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];

  @Output() editTask = new EventEmitter<Task>();


  constructor(private taskService: TaskService) {}

  deleteTask(id: number): void {
    this.taskService.delete(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== id);
      }
    });
  }

  onEditClick(task: Task): void {
    this.editTask.emit(task);
  }
  
  getCardClass(task: Task): string {
    const map: Record<string, string> = {
      PENDING: 'task-card--pending',
      IN_PROGRESS: 'task-card--progress',
      COMPLETED: 'task-card--completed'
    };
    return map[task.status] ?? '';
  }

  getPriorityClass(priority: TaskPriority): string {
    const map: Record<string, string> = {
      HIGH: 'priority-high',
      MEDIUM: 'priority-medium',
      LOW: 'priority-low'
    };
    return map[priority] ?? '';
  }

  getPriorityLabel(priority: TaskPriority): string {
    const map: Record<string, string> = {
      HIGH: 'Alta', MEDIUM: 'Media', LOW: 'Baja'
    };
    return map[priority] ?? priority;
  }

  getStatusLabel(status: TaskStatus): string {
    const map: Record<string, string> = {
      PENDING: 'Pendiente', IN_PROGRESS: 'En proceso', COMPLETED: 'Completada'
    };
    return map[status] ?? status;
  }

  getStatusClass(status: TaskStatus): string {
    const map: Record<string, string> = {
      PENDING: 'pending', IN_PROGRESS: 'progress', COMPLETED: 'completed'
    };
    return map[status] ?? '';
  }

  getDueDateLabel(task: Task): string {
    if (task.status === TaskStatus.COMPLETED) return 'Finalizada';
    if (!task.dueDate) return '';
    const due = new Date(task.dueDate);
    const today = new Date();
    const days = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return `Venció ${this.formatDate(due)}`;
    if (days === 0) return 'Vence hoy';
    return `Vence ${this.formatDate(due)}`;
  }

  getDueDateClass(task: Task): string {
    if (task.status === TaskStatus.COMPLETED) return 'done';
    if (!task.dueDate) return '';
    const due = new Date(task.dueDate);
    const today = new Date();
    if (due < today) return 'warning';
    const days = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 3) return 'overdue';
    return '';
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
  }
}
