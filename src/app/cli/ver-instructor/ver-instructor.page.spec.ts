import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerInstructorPage } from './ver-instructor.page';

describe('VerInstructorPage', () => {
  let component: VerInstructorPage;
  let fixture: ComponentFixture<VerInstructorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerInstructorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerInstructorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
