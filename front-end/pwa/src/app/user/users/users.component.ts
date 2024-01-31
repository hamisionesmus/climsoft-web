import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { extend } from 'leaflet';
import { ViewUserDto } from 'src/app/core/models/dtos/view-user.dto';
import { ElementModel } from 'src/app/core/models/element.model';
import { UserRole } from 'src/app/core/models/enums/user-roles.enum';
import { ElementsService } from 'src/app/core/services/elements.service';
import { PagesDataService } from 'src/app/core/services/pages-data.service';
import { UsersService } from 'src/app/core/services/users.service';


interface ViewUser extends ViewUserDto {
  roleName?: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  users!: ViewUser[];

  constructor(
    private pagesDataService: PagesDataService,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute) {

    this.pagesDataService.setPageHeader('Users');

    this.usersService.getUsers().subscribe(data => {

      this.users = data.map(data => {

        const viewUser: ViewUser = { ...data }

        if (data.roleId === UserRole.Administrator) {
          viewUser.roleName = 'Administrator';
        }else  if (data.roleId === UserRole.Approver) {
          viewUser.roleName = 'Approver';
        }else  if (data.roleId === UserRole.EntryClerk) {
          viewUser.roleName = 'Entry Clerk';
        }else  if (data.roleId === UserRole.Viewer) {
          viewUser.roleName = 'Viewer';
        }

        return viewUser;
      });
    });


  }

  ngOnInit() {
  }

  onSearchClick() { }

  onNewUserClick() {
    this.router.navigate(['user-detail', 'new'], { relativeTo: this.route.parent });
  }

  onEditUserClick(viewUser: ViewUserDto) {
    this.router.navigate(['user-detail', viewUser.id], { relativeTo: this.route.parent });
  }
}