import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFichierComponent } from './edit-fichier.component';

describe('EditFichierComponent', () => {
  let component: EditFichierComponent;
  let fixture: ComponentFixture<EditFichierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFichierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
