import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStatutFactureComponent } from './add-statut-facture.component';

describe('AddStatutFactureComponent', () => {
  let component: AddStatutFactureComponent;
  let fixture: ComponentFixture<AddStatutFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStatutFactureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStatutFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
