import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCircuitApprobationDesFacturesComponent } from './add-circuit-approbation-des-factures.component';

describe('AddCircuitApprobationDesFacturesComponent', () => {
  let component: AddCircuitApprobationDesFacturesComponent;
  let fixture: ComponentFixture<AddCircuitApprobationDesFacturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCircuitApprobationDesFacturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCircuitApprobationDesFacturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
