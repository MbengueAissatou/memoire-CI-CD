import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAvenantComponent } from './details-avenant.component';

describe('DetailsAvenantComponent', () => {
  let component: DetailsAvenantComponent;
  let fixture: ComponentFixture<DetailsAvenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsAvenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsAvenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
