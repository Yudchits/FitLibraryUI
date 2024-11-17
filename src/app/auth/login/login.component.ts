import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../common/services/auth.service';
import { UserLogin } from '../common/models/user-login.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  message: string = null;
  isSubmitted: boolean = false;

  private returnUrl: string;

  private onDestroy$ = new Subject<void>();
  private requestCancel$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onLoginClick(): void {
    this.requestCancel$.next();

    this.isSubmitted = true;
    if (this.loginForm.valid) {

      const userLogin: UserLogin = {
        email: this.loginForm.get('email').value,
        password: this.loginForm.get('password').value
      };

      this.authService.login(userLogin)
      .pipe(takeUntil(this.requestCancel$), takeUntil(this.onDestroy$))
        .subscribe(
          (result) => {
            if (result && result.token) {
              this.router.navigate([this.returnUrl]);
            }
          },
          (error) => {
            this.message = error.error.message;
          }
        );
    }
    
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
