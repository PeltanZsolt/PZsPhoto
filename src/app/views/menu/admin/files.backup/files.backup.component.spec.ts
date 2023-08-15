import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesBackupComponent } from './files.backup.component';

describe('FilesBackupComponent', () => {
  let component: FilesBackupComponent;
  let fixture: ComponentFixture<FilesBackupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilesBackupComponent]
    });
    fixture = TestBed.createComponent(FilesBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
