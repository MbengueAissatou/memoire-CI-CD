import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MontantComparerComponent } from './montant-comparer.component';

describe('MontantComparerComponent', () => {
  let component: MontantComparerComponent;
  let fixture: ComponentFixture<MontantComparerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MontantComparerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MontantComparerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
