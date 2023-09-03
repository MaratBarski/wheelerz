import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PhotoGalleryComponent } from 'src/app/components/photo-gallery/photo-gallery.component';
import { ImageComponent } from 'src/app/components/image/image.component';

@Component({
  selector: 'app-policy',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ImageComponent],
  templateUrl: './policy.component.html',
  providers: [MatDialogConfig],
  styleUrls: ['./policy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PolicyComponent {
  constructor(public dialogRef: MatDialogRef<PhotoGalleryComponent>) { }
  close(): void {
    this.dialogRef.close()
  }
}
