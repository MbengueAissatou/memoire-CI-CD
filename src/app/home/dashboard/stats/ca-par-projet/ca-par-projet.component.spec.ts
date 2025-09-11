import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaParProjetComponent } from './ca-par-projet.component';

describe('CaParProjetComponent', () => {
  let component: CaParProjetComponent;
  let fixture: ComponentFixture<CaParProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaParProjetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaParProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
