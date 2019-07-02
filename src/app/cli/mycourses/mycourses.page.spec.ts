import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MycoursesPage } from './mycourses.page';

describe('MycoursesPage', () => {
  let component: MycoursesPage;
  let fixture: ComponentFixture<MycoursesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycoursesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MycoursesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
