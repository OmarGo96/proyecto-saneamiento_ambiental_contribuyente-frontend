import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompaniesFilesDialogComponent } from './add-companies-files-dialog.component';

describe('AddCompaniesFilesDialogComponent', () => {
  let component: AddCompaniesFilesDialogComponent;
  let fixture: ComponentFixture<AddCompaniesFilesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCompaniesFilesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCompaniesFilesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
