import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecthorarioPage } from './selecthorario.page';

describe('SelecthorarioPage', () => {
  let component: SelecthorarioPage;
  let fixture: ComponentFixture<SelecthorarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecthorarioPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecthorarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
