import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessdialogComponent } from './successdialog.component';

describe('ClosedialogComponent', () => {
  let component: SuccessdialogComponent;
  let fixture: ComponentFixture<SuccessdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessdialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
