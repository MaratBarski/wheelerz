import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { StoryListComponent } from 'src/app/components/story-list/story-list.component';
import { TranslateAsyncPipe } from 'src/app/pipes/translate.pipe';
import { titles } from 'src/app/consts';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.page.html',
  styleUrls: ['./stories.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, StoryListComponent, TranslateAsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoriesPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  type = 1
  types: any = {
    road: 1,
    hotel: 2,
    city: 3
  }

  get pageTitle(): string {
    return titles[this.type - 1]
  }

  ngOnInit() {
    this.type = this.types[this.activatedRoute.snapshot.paramMap.get('type') || 'road']
  }

}
