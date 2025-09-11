import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PourcentageMontantComponent } from './pourcentage-montant.component';

describe('PourcentageMontantComponent', () => {
  let component: PourcentageMontantComponent;
  let fixture: ComponentFixture<PourcentageMontantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PourcentageMontantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PourcentageMontantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
