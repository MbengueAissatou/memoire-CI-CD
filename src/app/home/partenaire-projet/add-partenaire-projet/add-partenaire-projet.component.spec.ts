import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPartenaireProjetComponent } from './add-partenaire-projet.component';

describe('AddPartenaireProjetComponent', () => {
  let component: AddPartenaireProjetComponent;
  let fixture: ComponentFixture<AddPartenaireProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPartenaireProjetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPartenaireProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
