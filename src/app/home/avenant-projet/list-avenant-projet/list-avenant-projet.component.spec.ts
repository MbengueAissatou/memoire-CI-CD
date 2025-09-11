import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAvenantProjetComponent } from './list-avenant-projet.component';

describe('ListAvenantProjetComponent', () => {
  let component: ListAvenantProjetComponent;
  let fixture: ComponentFixture<ListAvenantProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAvenantProjetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAvenantProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
