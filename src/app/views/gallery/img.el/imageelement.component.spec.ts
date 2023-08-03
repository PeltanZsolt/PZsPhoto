import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageElementComponent } from './imageelement.component';

describe('ImgElComponent', () => {
  let component: ImageElementComponent;
  let fixture: ComponentFixture<ImageElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageElementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
