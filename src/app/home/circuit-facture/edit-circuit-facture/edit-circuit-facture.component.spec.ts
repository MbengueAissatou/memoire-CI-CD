import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCircuitFactureComponent } from './edit-circuit-facture.component';

describe('EditCircuitFactureComponent', () => {
  let component: EditCircuitFactureComponent;
  let fixture: ComponentFixture<EditCircuitFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCircuitFactureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCircuitFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
