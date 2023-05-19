import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavLink } from 'src/app/models/navigation';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';

@Component({
  selector: 'app-tabulator',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './tabulator.component.html',
  styleUrls: ['./tabulator.component.scss']
})
export class TabulatorComponent {
  @Input() tabs!: NavLink[];
  private router = inject(Router);

  isActive(url: string | undefined): boolean {
    if (!url) return false;
    return this.router.url.toLowerCase().endsWith(url.toLowerCase());
  }
}
