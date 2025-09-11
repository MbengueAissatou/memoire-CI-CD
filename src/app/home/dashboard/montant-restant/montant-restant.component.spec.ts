import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MontantRestantComponent } from './montant-restant.component';

describe('MontantRestantComponent', () => {
  let component: MontantRestantComponent;
  let fixture: ComponentFixture<MontantRestantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MontantRestantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MontantRestantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
