import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosnetPage } from './pagosnet.page';

describe('PagosnetPage', () => {
  let component: PagosnetPage;
  let fixture: ComponentFixture<PagosnetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagosnetPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagosnetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
