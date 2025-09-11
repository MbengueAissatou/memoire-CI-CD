import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFichierComponent } from './list-fichier.component';

describe('ListFichierComponent', () => {
  let component: ListFichierComponent;
  let fixture: ComponentFixture<ListFichierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListFichierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListFichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
