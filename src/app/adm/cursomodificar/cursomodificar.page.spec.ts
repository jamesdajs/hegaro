import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CursomodificarPage } from './cursomodificar.page';

describe('CursomodificarPage', () => {
  let component: CursomodificarPage;
  let fixture: ComponentFixture<CursomodificarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CursomodificarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CursomodificarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
