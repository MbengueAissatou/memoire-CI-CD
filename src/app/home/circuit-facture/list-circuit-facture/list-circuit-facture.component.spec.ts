import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCircuitFactureComponent } from './list-circuit-facture.component';

describe('ListCircuitFactureComponent', () => {
  let component: ListCircuitFactureComponent;
  let fixture: ComponentFixture<ListCircuitFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCircuitFactureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCircuitFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
