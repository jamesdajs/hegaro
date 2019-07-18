import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearlugarPage } from './crearlugar.page';

describe('CrearlugarPage', () => {
  let component: CrearlugarPage;
  let fixture: ComponentFixture<CrearlugarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearlugarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearlugarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
