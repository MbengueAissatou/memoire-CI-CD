import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPartenaireProjetComponent } from './list-partenaire-projet.component';

describe('ListPartenaireProjetComponent', () => {
  let component: ListPartenaireProjetComponent;
  let fixture: ComponentFixture<ListPartenaireProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPartenaireProjetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPartenaireProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
