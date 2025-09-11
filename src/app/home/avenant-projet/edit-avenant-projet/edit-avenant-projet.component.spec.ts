import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAvenantProjetComponent } from './edit-avenant-projet.component';

describe('EditAvenantProjetComponent', () => {
  let component: EditAvenantProjetComponent;
  let fixture: ComponentFixture<EditAvenantProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAvenantProjetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAvenantProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
