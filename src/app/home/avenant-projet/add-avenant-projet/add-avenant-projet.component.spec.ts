import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAvenantProjetComponent } from './add-avenant-projet.component';

describe('AddAvenantProjetComponent', () => {
  let component: AddAvenantProjetComponent;
  let fixture: ComponentFixture<AddAvenantProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAvenantProjetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAvenantProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
