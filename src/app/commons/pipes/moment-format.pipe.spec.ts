import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MomentFormatPipe } from './moment-format.pipe';

@Component({
  template: `<p>{{ 682743600 | momentFormat:format }}</p>`,
})
class TestComponent {
  format: string | undefined = undefined;
}

describe('MomentFormatPipe', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let paragraphElement: HTMLParagraphElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [MomentFormatPipe]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(MomentFormatPipe).toBeTruthy();
  });

  it('should convert date from unix to DD/MM/YYYY', () => {
    paragraphElement = fixture.debugElement.query(By.css('p')).nativeElement;

    component.format = 'DD/MM/YYYY';
    fixture.detectChanges();

    expect(paragraphElement.innerHTML).toBe('21/08/1991');
  });
});
