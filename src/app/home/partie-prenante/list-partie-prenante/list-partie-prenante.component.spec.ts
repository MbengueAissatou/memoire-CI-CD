import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPartiePrenanteComponent } from './list-partie-prenante.component';

describe('ListPartiePrenanteComponent', () => {
  let component: ListPartiePrenanteComponent;
  let fixture: ComponentFixture<ListPartiePrenanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPartiePrenanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPartiePrenanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
