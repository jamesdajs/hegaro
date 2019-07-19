import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoalumnosPage } from './cursoalumnos.page';

describe('CursoalumnosPage', () => {
  let component: CursoalumnosPage;
  let fixture: ComponentFixture<CursoalumnosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CursoalumnosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoalumnosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
