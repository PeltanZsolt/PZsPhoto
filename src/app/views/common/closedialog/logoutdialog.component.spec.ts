import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedialogComponent } from './logoutdialog.component';

describe('ClosedialogComponent', () => {
  let component: ClosedialogComponent;
  let fixture: ComponentFixture<ClosedialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
