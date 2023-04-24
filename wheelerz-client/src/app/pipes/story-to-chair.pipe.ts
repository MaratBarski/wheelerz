import { Pipe, PipeTransform } from '@angular/core';
import { Story } from '../models/story';
import { Chair } from '../models/chair';

@Pipe({
  name: 'storyToChair',
  standalone: true
})
export class StoryToChairPipe implements PipeTransform {

  transform(value: Story): Chair {
    return {
      seatHeight: Math.ceil(value.height || 0),
      width: Math.ceil(value.width || 0),
      length: Math.ceil(value.length || 0),
      messure: 'cm'
    }
  }

}
