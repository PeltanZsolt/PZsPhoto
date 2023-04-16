import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputdialogComponent } from './inputdialog.component';

describe('InputdialogComponent', () => {
  let component: InputdialogComponent;
  let fixture: ComponentFixture<InputdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputdialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
