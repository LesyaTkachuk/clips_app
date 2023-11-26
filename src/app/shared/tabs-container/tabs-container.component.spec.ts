import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { TabsContainerComponent } from './tabs-container.component';
import { TabComponent } from '../tab/tab.component';

// creating additional component and provide content to it
@Component({
  template: `
    <app-tabs-container>
      <app-tab tabTitle="Tab 1">Tab 1</app-tab>
      <app-tab tabTitle="Tab 2">Tab 2</app-tab>
    </app-tabs-container>
  `,
})
class TestHostComponent {}

describe('TabsContainerComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsContainerComponent, TabComponent, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have two tabs', () => {
    // grab the tabs with the help of css selector
    const tabs = fixture.debugElement.queryAll(By.css('li'));

    const containerComponent = fixture.debugElement.query(
      By.directive(TabsContainerComponent)
    );
    const tabsProp = containerComponent.componentInstance.tabs;

    // we can add custom error messages to detect which test has faild
    expect(tabs.length).withContext('Tabs length is not equal to two').toBe(2);
    expect(tabsProp.length).withContext('Tabs property is wrong ').toBe(2);
  });
});
