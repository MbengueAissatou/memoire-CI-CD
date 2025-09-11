import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStatutFactureComponent } from './edit-statut-facture.component';

describe('EditStatutFactureComponent', () => {
  let component: EditStatutFactureComponent;
  let fixture: ComponentFixture<EditStatutFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStatutFactureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStatutFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
