import { Component, Inject } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { debounceTime, first, map, Observable, shareReplay, startWith, Subject } from 'rxjs';
import { Memoize } from 'typescript-memoize';

const DEBOUNCE_TIME = 500;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private _originalPhrases = new Subject<string>();

  @Memoize()
  public get shuffeldPhrases$(): Observable<string[]> {
    return this._originalPhrases.asObservable().pipe(
      debounceTime(DEBOUNCE_TIME),
      map((originalPhrases) => this._shufflePhrases(originalPhrases)),
      startWith([]),
      shareReplay(1),
    );
  }

  @Memoize()
  public get hasShuffeldPhrases$(): Observable<boolean> {
    return this.shuffeldPhrases$.pipe(map((phrases) => phrases.length > 0));
  }

  constructor(
    private _clipboardService: ClipboardService,
    @Inject('shuffle') private _shuffle: (input: string[]) => string[],
  ) {}

  public updateOriginalPhrases(event: Event) {
    this._originalPhrases.next((event.target as any).value);
  }

  private _shufflePhrases(originalPhrases: string): string[] {
    return originalPhrases
      .split('\n')
      .map((phrase) => phrase.trim())
      .filter((phrase) => phrase.length > 0)
      .map((phrase) => phrase.split(' '))
      .map((words) => this._shuffle(words))
      .map((phrase) => phrase.join(' | '));
  }

  public copyToClipboard() {
    this.shuffeldPhrases$
      .pipe(first())
      .subscribe((phrases) => this._clipboardService.copyFromContent(phrases.join('\n')));
  }
}
