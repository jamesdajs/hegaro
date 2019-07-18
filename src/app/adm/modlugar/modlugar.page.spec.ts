import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModlugarPage } from './modlugar.page';

describe('ModlugarPage', () => {
  let component: ModlugarPage;
  let fixture: ComponentFixture<ModlugarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModlugarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModlugarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
