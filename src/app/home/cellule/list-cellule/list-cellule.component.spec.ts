import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCelluleComponent } from './list-cellule.component';

describe('ListCelluleComponent', () => {
  let component: ListCelluleComponent;
  let fixture: ComponentFixture<ListCelluleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCelluleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCelluleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
