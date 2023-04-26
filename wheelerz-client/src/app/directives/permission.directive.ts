import { Directive, TemplateRef, inject, Input, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';
import { UserService } from '../services/user.service';

@Directive({
  selector: '[appPermission]',
  standalone: true
})
export class PermissionDirective implements OnChanges {
  userService = inject(UserService)

  @Input() appPermission = 0

  constructor(private template: TemplateRef<any>, private view: ViewContainerRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.update()
  }

  private update(): void {
    this.view.clear()
    if (this.userService.hasPermission(this.appPermission))
      this.view.createEmbeddedView(this.template)
  }

}
