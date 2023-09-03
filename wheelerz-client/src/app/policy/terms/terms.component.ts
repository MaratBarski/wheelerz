import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { PhotoGalleryComponent } from 'src/app/components/photo-gallery/photo-gallery.component';
import { ImageComponent } from 'src/app/components/image/image.component';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ImageComponent],
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  providers: [MatDialogConfig],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsComponent {
  constructor(public dialogRef: MatDialogRef<PhotoGalleryComponent>) { }
  close(): void {
    this.dialogRef.close()
  }
}
