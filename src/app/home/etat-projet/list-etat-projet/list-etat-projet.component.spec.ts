import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEtatProjetComponent } from './list-etat-projet.component';

describe('ListEtatProjetComponent', () => {
  let component: ListEtatProjetComponent;
  let fixture: ComponentFixture<ListEtatProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEtatProjetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEtatProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
