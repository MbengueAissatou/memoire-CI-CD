import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBailleurComponent } from './list-bailleur.component';

describe('ListBailleurComponent', () => {
  let component: ListBailleurComponent;
  let fixture: ComponentFixture<ListBailleurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBailleurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBailleurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
