import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCircuitApprobationDesFacturesComponent } from './list-circuit-approbation-des-factures.component';

describe('ListCircuitApprobationDesFacturesComponent', () => {
  let component: ListCircuitApprobationDesFacturesComponent;
  let fixture: ComponentFixture<ListCircuitApprobationDesFacturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCircuitApprobationDesFacturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCircuitApprobationDesFacturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
