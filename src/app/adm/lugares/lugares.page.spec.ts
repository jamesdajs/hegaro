import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LugaresPage } from './lugares.page';

describe('LugaresPage', () => {
  let component: LugaresPage;
  let fixture: ComponentFixture<LugaresPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LugaresPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LugaresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
