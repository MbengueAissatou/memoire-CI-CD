import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PourcentagePartenaireComponent } from './pourcentage-partenaire.component';

describe('PourcentagePartenaireComponent', () => {
  let component: PourcentagePartenaireComponent;
  let fixture: ComponentFixture<PourcentagePartenaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PourcentagePartenaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PourcentagePartenaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
