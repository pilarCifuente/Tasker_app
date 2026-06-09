import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-search-bar.component.html',
  styleUrl: './task-search-bar.component.css'
})
export class TaskSearchBarComponent {
  @Output() searchChanged = new EventEmitter<string>();

  searchTerm: string = '';

  onSearch(): void {
    this.searchChanged.emit(this.searchTerm.trim().toLowerCase());
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchChanged.emit('');
  }
}
