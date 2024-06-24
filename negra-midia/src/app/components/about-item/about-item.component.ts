import { Component, Input } from '@angular/core';
import { TeamMember } from '../../interfaces/team-members';

@Component({
  selector: 'app-about-item',
  templateUrl: './about-item.component.html',
  styleUrl: './about-item.component.css'
})
export class AboutItemComponent {

  @Input()
  member!: TeamMember;
}
