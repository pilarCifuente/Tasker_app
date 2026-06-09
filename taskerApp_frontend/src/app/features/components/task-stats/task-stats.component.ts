import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Task } from '../../../core/models/task';

@Component({
  selector: 'app-task-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-stats.component.html',
  styleUrl: './task-stats.component.css'
})
export class TaskStatsComponent {

  @Input() tasks: Task[] = [];

  get totalTasks(): number {
    return this.tasks.length;
  }

  get pendingTasks(): number {
    return this.tasks.filter(task => task.status === 'PENDING').length;
  }

  get inProcessTasks(): number {
    return this.tasks.filter(task => task.status === 'IN_PROGRESS').length;
  }

  get completedTasks(): number {
    return this.tasks.filter(task => task.status === 'COMPLETED').length;
  }
}
