import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosinactivosPage } from './cursosinactivos.page';

describe('CursosinactivosPage', () => {
  let component: CursosinactivosPage;
  let fixture: ComponentFixture<CursosinactivosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CursosinactivosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CursosinactivosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
