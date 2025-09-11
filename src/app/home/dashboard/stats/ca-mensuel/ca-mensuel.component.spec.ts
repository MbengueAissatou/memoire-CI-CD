import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaMensuelComponent } from './ca-mensuel.component';

describe('CaMensuelComponent', () => {
  let component: CaMensuelComponent;
  let fixture: ComponentFixture<CaMensuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaMensuelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaMensuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
