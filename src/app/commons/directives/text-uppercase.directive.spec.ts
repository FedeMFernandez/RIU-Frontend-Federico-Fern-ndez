import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TextUppercaseDirective } from './text-uppercase.directive';

@Component({
  template: `<input type="text" textUppercase />`
})
class TestComponent {}

describe('TextUppercaseDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [TextUppercaseDirective]
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    inputElement = fixture.debugElement.query(By.directive(TextUppercaseDirective)).nativeElement;
  });

  it('should convert input value to uppercase', () => {
    inputElement.value = 'hello';
    inputElement.dispatchEvent(new Event('input'));

    expect(inputElement.value).toBe('HELLO');
  });
});
