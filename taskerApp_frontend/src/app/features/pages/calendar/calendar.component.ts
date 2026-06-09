import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../core/models/task';
import { TaskModalComponent } from '../../dashboard/components/task-modal/task-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, TaskModalComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {

  @ViewChild('taskModal') taskModal!: TaskModalComponent;

  tasks: Task[] = [];
  currentDate: Date = new Date();
  currentYear: number = this.currentDate.getFullYear();
  currentMonth: number = this.currentDate.getMonth();
  calendarDays: { date: Date; muted: boolean; isToday: boolean; tasks: Task[] }[] = [];

  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(
    private router: Router,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAll().subscribe({
      next: (data) => {
        this.tasks = data;
        this.buildCalendar();
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error al cargar tareas', err)
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  openTaskModal(task: Task, event: MouseEvent): void {
    event.stopPropagation();
    this.taskModal.openForEdit(task);
  }

  prevMonth(): void {
    if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; }
    else { this.currentMonth--; }
    this.buildCalendar();
    this.cdr.markForCheck();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; }
    else { this.currentMonth++; }
    this.buildCalendar();
    this.cdr.markForCheck();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonth = this.currentDate.getMonth();
    this.buildCalendar();
    this.cdr.markForCheck();
  }

  get currentMonthName(): string {
    return `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
  }

  getEventClass(task: Task): string {
    const map: Record<string, string> = {
      HIGH: 'calendar-event--danger',
      MEDIUM: 'calendar-event--warning',
      LOW: 'calendar-event--success'
    };
    return map[task.priority] ?? 'calendar-event--progress';
  }

  private buildCalendar(): void {
    const today = new Date();
    const days: { date: Date; muted: boolean; isToday: boolean; tasks: Task[] }[] = [];

    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(this.currentYear, this.currentMonth, -i);
      days.push({ date: d, muted: true, isToday: false, tasks: [] });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(this.currentYear, this.currentMonth, i);
      const isToday =
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate();
      days.push({ date: d, muted: false, isToday, tasks: this.getTasksForDate(d) });
    }

    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(this.currentYear, this.currentMonth + 1, i);
        days.push({ date: d, muted: true, isToday: false, tasks: [] });
      }
    }

    this.calendarDays = days;
  }

  private getTasksForDate(date: Date): Task[] {
    return this.tasks.filter(task => {
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate);
      return (
        due.getFullYear() === date.getFullYear() &&
        due.getMonth() === date.getMonth() &&
        due.getDate() === date.getDate()
      );
    });
  }
}
