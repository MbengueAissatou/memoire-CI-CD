import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCircuitApprobationDesFacturesComponent } from './edit-circuit-approbation-des-factures.component';

describe('EditCircuitApprobationDesFacturesComponent', () => {
  let component: EditCircuitApprobationDesFacturesComponent;
  let fixture: ComponentFixture<EditCircuitApprobationDesFacturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCircuitApprobationDesFacturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCircuitApprobationDesFacturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
