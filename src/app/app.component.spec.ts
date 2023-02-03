import { fakeAsync, tick } from '@angular/core/testing';
import { v4 } from 'uuid';
import { AppComponent } from './app.component';

const DEBOUNCE_TIME = 500;

describe('AppComponent', () => {
  describe('@hasShuffeldPhrases$', () => {
    it('should be false on init', () => {
      let result: boolean;
      const component = createCompponent();

      component.hasShuffeldPhrases$.subscribe((value) => (result = value));

      expect(result!).toBe(false);
    });

    it('should be true when shuffeldPhrases$ has values', fakeAsync(() => {
      let result: boolean;
      const component = createCompponent();
      component.hasShuffeldPhrases$.pipe().subscribe((value) => (result = value));

      component.updateOriginalPhrases(createEvent());

      tick(DEBOUNCE_TIME);
      expect(result!).toBe(true);
    }));
  });

  describe('@shuffeldPhrases$', () => {
    it('should be empty list on init', () => {
      let result: string[];
      const component = createCompponent();

      component.shuffeldPhrases$.subscribe((value) => (result = value));

      expect(result!).toEqual([]);
    });

    it('should be one shuffeld phrase when originalPhrases has one phrase', fakeAsync(() => {
      let result: string[];
      const shuffle = (_: string[]) => [..._].reverse();
      const component = createCompponent({ shuffle });
      component.shuffeldPhrases$.subscribe((value) => (result = value));

      component.updateOriginalPhrases(createEvent('one phrase'));

      tick(DEBOUNCE_TIME);
      expect(result!).toEqual(['phrase | one']);
    }));

    it('should be two shuffeld phrases when originalPhrases has two phrases', fakeAsync(() => {
      let result: string[];
      const shuffle = (_: string[]) => [..._].reverse();
      const component = createCompponent({ shuffle });
      component.shuffeldPhrases$.subscribe((value) => (result = value));

      component.updateOriginalPhrases(createEvent('one phrase\ntwo phrase'));

      tick(DEBOUNCE_TIME);
      expect(result!).toEqual(['phrase | one', 'phrase | two']);
    }));
  });

  describe('#copyToClipboard', () => {
    it('should copy shuffeld phrases to clipboard', fakeAsync(() => {
      const shuffle = (_: string[]) => _;
      const clipboardService = jasmine.createSpyObj('clipboardService', ['copyFromContent']);
      const component = createCompponent({ shuffle, clipboardService });
      component.hasShuffeldPhrases$.subscribe();
      component.updateOriginalPhrases(createEvent('one phrase\nanother phrase'));
      tick(DEBOUNCE_TIME);

      component.copyToClipboard();

      expect(clipboardService.copyFromContent).toHaveBeenCalledWith('one | phrase\nanother | phrase');
    }));
  });
});

function createCompponent({
  clipboardService = jasmine.createSpyObj('clipboardService', ['copyFromContent']),
  shuffle = (_: string[]) => [] as string[],
} = {}): AppComponent {
  return new AppComponent(clipboardService, shuffle);
}

function createEvent(value: string = v4()): Event {
  return { target: { value } } as any;
}
