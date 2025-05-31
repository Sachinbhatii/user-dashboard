import { Component, effect, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { HighlightDirective } from '../../shared/directives/highlight.directive';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HighlightDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(AuthService);

  users = signal<any[]>([]);
  searchTerm = signal('');
  selectedUser: any = null;

  currentPage = signal(1);
  pageSize = 5;

  readonly hasError = signal(false);

  constructor() {
    this.loadUsers();

    // Reset to page 1 when search changes
    effect(() => {
      this.searchTerm();
      this.currentPage.set(1);
    }, { allowSignalWrites: true });

  }

  loadUsers() {
    this.http.get('https://jsonplaceholder.typicode.com/users')
      .subscribe({
        next: (data) => {
          this.users.set(data as any);
          this.hasError.set(false);
        }, error: () => {
          console.error('Failed to load users');
          this.hasError.set(true);
        }
      });
  }

  retryFetch() {
    this.loadUsers();
  }

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.users().filter(user =>
      JSON.stringify(user).toLowerCase().includes(term)
    );
  });

  totalPages = computed(() => Math.ceil(this.filteredUsers().length / this.pageSize));

  paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredUsers().slice(start, start + this.pageSize);
  });

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  selectUser(user: any) {
    this.selectedUser = JSON.parse(JSON.stringify(user));
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}