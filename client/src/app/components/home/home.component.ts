import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: []
})
export class HomeComponent implements OnInit {

  public title: string;
  public identity;
  public url: string;    
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private titleService: Title
    ){
        this.title = 'Intedgroup SocialMedia';
        this.url = GLOBAL.url;
        this.titleService.setTitle( this.title );
    }
        
  ngOnInit(){
      //Call User Service to get user identity if available in global component
      this.identity = this._userService.getIdentity();
  }
    
  //With any change in components, refresh variables
    ngDoCheck(){
        this.identity = this._userService.getIdentity();
    }

}
