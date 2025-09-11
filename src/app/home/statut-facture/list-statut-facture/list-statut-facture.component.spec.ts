import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStatutFactureComponent } from './list-statut-facture.component';

describe('ListStatutFactureComponent', () => {
  let component: ListStatutFactureComponent;
  let fixture: ComponentFixture<ListStatutFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListStatutFactureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListStatutFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
