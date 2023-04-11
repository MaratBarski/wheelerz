import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, KeyValue } from '@angular/common';
import { WizardItem, WizardRadioItem } from 'src/app/models/accesability';
import { RadioComponent } from '../radio/radio.component';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { UploadComponent } from '../upload/upload.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { DirectionDirective } from 'src/app/directives/direction.directive';
import { FileImage } from 'src/app/models/fileImage';

@Component({
  selector: 'app-accessibility-wizard',
  standalone: true,
  imports: [CommonModule, RadioComponent, FormsModule, TranslatePipe, UploadComponent, ProgressBarComponent, DirectionDirective],
  templateUrl: './accessibility-wizard.component.html',
  styleUrls: ['./accessibility-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessibilityWizardComponent {
  @Input() wizard: WizardItem[] = []
  @Input() current = 0
  @Input() showPrev = false
  @Output() onDone = new EventEmitter<WizardItem[]>()
  @Output() onNext = new EventEmitter<number>()
  @Output() onInit = new EventEmitter<void>()

  get currentWizard(): WizardItem {
    return this.wizard[this.current]
  }

  next(i: number): void {
    if (this.current + i < 0) this.onInit.emit()
    this.current = Math.min(Math.max(0, this.current + i), this.wizard.length - 1)
    this.onNext.emit(this.current)
  }

  change(data: KeyValue<string, string>, item: WizardRadioItem): void {
    item.selectedValue = data.value
    item.selectedKey = data.key
  }

  updateFiles(files: FileImage[]): void {
    this.currentWizard.photos = files;
  }

  done(): void {
    this.onDone.emit(this.wizard)
  }
}
