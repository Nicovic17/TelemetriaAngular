import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleIndexGalleryComponent } from './article-index-gallery.component';

describe('ArticleIndexGalleryComponent', () => {
  let component: ArticleIndexGalleryComponent;
  let fixture: ComponentFixture<ArticleIndexGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleIndexGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleIndexGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 /* it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
