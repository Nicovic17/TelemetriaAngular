import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatDialogComponent } from './mat-dialog/mat-dialog.component';

import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('AppComponent', () => {


  let appComponent: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      providers: [],
      declarations: [
        AppComponent,
        MatDialogComponent
      ],

    })
    .overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [MatDialogComponent]
      }
    })
    .compileComponents().then(() => {

    });

    fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.componentInstance;
    fixture.detectChanges();
  }));


});
