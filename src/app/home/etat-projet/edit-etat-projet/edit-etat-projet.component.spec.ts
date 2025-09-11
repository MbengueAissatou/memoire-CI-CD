import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEtatProjetComponent } from './edit-etat-projet.component';

describe('EditEtatProjetComponent', () => {
  let component: EditEtatProjetComponent;
  let fixture: ComponentFixture<EditEtatProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEtatProjetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEtatProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
