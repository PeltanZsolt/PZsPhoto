import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgElComponent } from './imageelement.component';

describe('ImgElComponent', () => {
  let component: ImgElComponent;
  let fixture: ComponentFixture<ImgElComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgElComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgElComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
