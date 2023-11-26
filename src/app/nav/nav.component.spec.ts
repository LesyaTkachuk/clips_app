import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { NavComponent } from './nav.component';
import { AuthService } from '../services/auth.service';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  // create a mock of authentication service to isolate a test
  const mockedAuthService = jasmine.createSpyObj(
    'AuthService',
    ['createUser', 'logout'],
    {
      isAuthenticated$: of(true),
    }
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavComponent],

      // to avoid router testing errors
      imports: [RouterTestingModule],

      // to inject fake auth service
      providers: [{ provide: AuthService, useValue: mockedAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have logout link', () => {
    const links = fixture.debugElement.queryAll(By.css('li'));
    const logoutItem = links[2];

    const logoutLink = fixture.debugElement.query(By.css('li:nth-child(3) a'));

    expect(logoutItem).toBeTruthy();
    expect(logoutLink).withContext('Not loged in').toBeTruthy();

    // to trigger an logout event on click
    logoutLink.triggerEventHandler('click');

    // to retreave an injecting into the component service
    const service = TestBed.inject(AuthService);
    expect(service.logout)
      .withContext('Could not click on Logout btn')
      .toHaveBeenCalledTimes(1);
  });
});
