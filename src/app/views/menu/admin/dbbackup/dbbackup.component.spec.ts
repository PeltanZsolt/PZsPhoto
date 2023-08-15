import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbbackupComponent } from './dbbackup.component';

describe('DbbackupComponent', () => {
  let component: DbbackupComponent;
  let fixture: ComponentFixture<DbbackupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DbbackupComponent]
    });
    fixture = TestBed.createComponent(DbbackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
