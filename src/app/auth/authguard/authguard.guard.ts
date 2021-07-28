import { Injectable } from '@angular/core';
import { CanLoad, Route,  Router,  UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardGuard implements CanLoad {

  constructor(private authService: AuthService,
    private router: Router) {}

  canLoad(route: Route, segments: UrlSegment[]): 
  Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isUserAuth.pipe(take(1), tap(isAuth => {
      if(!isAuth) {
        this.router.navigateByUrl('/auth')
      }
    }))
  }
}
