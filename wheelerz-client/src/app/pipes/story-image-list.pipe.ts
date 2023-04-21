import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'storyImageList',
  standalone: true
})
export class StoryImageListPipe implements PipeTransform {

  transform(value: any[], min: number, max: number): any[] {
    return value.filter((x, i) => i < max && i >= min)
  }

}
