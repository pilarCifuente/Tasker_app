import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TaskStatsComponent } from '../../components/task-stats/task-stats.component';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { TaskSearchBarComponent } from '../../components/task-search-bar/task-search-bar.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Task } from '../../../core/models/task';
import { TaskService } from '../../../core/services/task.service';
import { TaskModalComponent } from '../../dashboard/components/task-modal/task-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TaskStatsComponent, TaskListComponent, TaskSearchBarComponent, CommonModule, TaskModalComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  tasks: Task[] = [];
  selectedPriorities: string[] = [];
  currentDate: Date = new Date();
  activeFilter: string = 'ALL';
  searchTerm: string = '';
  dateFrom: string = '';
  dateTo: string = '';
  showDateFilter: boolean = false;

  constructor(
    private router: Router,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAll().subscribe({
      next: (data: Task[]) => {
        this.tasks = data;
      },
      error: (err) => {
        console.error('Error al obtener las tareas', err);
      }
    });
  }

  goToCalendar(): void {
    this.router.navigate(['/calendar']);
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
  }

  onSearchChanged(term: string): void {
    this.searchTerm = term;
  }

  toggleDateFilter(): void {
    this.showDateFilter = !this.showDateFilter;
  }

  clearDateFilter(): void {
    this.dateFrom = '';
    this.dateTo = '';
    this.selectedPriorities = [];
  }

  get activeTasksCount(): number {
    return this.tasks.filter(t =>
      t.status === 'PENDING' || t.status === 'IN_PROGRESS'
    ).length;
  }

  get isDateFilterActive(): boolean {
    return !!this.dateFrom || !!this.dateTo || this.selectedPriorities.length > 0;
  }



  private getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'pendiente',
      IN_PROGRESS: 'en proceso',
      COMPLETED: 'completada'
    };
    return map[status] ?? status;
  }

  

  togglePriority(priority: string): void {
    const idx = this.selectedPriorities.indexOf(priority);
    if (idx === -1) {
      this.selectedPriorities.push(priority);
    } else {
      this.selectedPriorities.splice(idx, 1);
    }
  }


  get filteredTasks(): Task[] {
    let result = this.tasks;

    if (this.activeFilter !== 'ALL') {
      result = result.filter(t => t.status === this.activeFilter);
    }

    if (this.searchTerm) {
      result = result.filter(t =>
        t.title.toLowerCase().includes(this.searchTerm) ||
        t.description?.toLowerCase().includes(this.searchTerm) ||
        this.getStatusLabel(t.status).toLowerCase().includes(this.searchTerm)
      );
    }

    if (this.dateFrom) {
      const from = new Date(this.dateFrom);
      result = result.filter(t => t.dueDate && new Date(t.dueDate) >= from);
    }

    if (this.dateTo) {
      const to = new Date(this.dateTo);
      to.setHours(23, 59, 59);
      result = result.filter(t => t.dueDate && new Date(t.dueDate) <= to);
    }

    if (this.selectedPriorities.length > 0) {
      result = result.filter(t => this.selectedPriorities.includes(t.priority));
    }

    return result;
  }
}
