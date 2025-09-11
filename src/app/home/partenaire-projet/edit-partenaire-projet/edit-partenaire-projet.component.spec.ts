import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPartenaireProjetComponent } from './edit-partenaire-projet.component';

describe('EditPartenaireProjetComponent', () => {
  let component: EditPartenaireProjetComponent;
  let fixture: ComponentFixture<EditPartenaireProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPartenaireProjetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPartenaireProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
