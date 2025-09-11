import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TauxFacturationComponent } from './taux-facturation.component';

describe('TauxFacturationComponent', () => {
  let component: TauxFacturationComponent;
  let fixture: ComponentFixture<TauxFacturationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TauxFacturationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TauxFacturationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
