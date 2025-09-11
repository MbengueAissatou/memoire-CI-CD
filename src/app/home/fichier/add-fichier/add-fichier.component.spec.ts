import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFichierComponent } from './add-fichier.component';

describe('AddFichierComponent', () => {
  let component: AddFichierComponent;
  let fixture: ComponentFixture<AddFichierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFichierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
