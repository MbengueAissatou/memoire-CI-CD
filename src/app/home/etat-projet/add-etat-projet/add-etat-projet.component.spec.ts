import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEtatProjetComponent } from './add-etat-projet.component';

describe('AddEtatProjetComponent', () => {
  let component: AddEtatProjetComponent;
  let fixture: ComponentFixture<AddEtatProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEtatProjetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEtatProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
