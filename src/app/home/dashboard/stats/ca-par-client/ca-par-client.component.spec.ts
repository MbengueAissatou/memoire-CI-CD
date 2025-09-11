import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaParClientComponent } from './ca-par-client.component';

describe('CaParClientComponent', () => {
  let component: CaParClientComponent;
  let fixture: ComponentFixture<CaParClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaParClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaParClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
