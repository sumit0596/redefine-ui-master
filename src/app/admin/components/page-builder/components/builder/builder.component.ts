import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import grapesjs, {
  ComponentDefinition,
  ComponentModelDefinition,
  Editor,
  UndoManagerConfig,
} from 'grapesjs';
import { PageBuilderService } from '../../services/page-builder.service';
import { IPageDetails } from '../../model/interfaces';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonStoreService } from 'src/app/services/common-store.service';
import { BUILDER_CONSTANTS } from './models/constants';
import { rdBlocks } from './plugins/blocks-plugin';
import { imageUpload } from './plugins/image-upload-plugin';
import { MEDIA_TYPE, STATUS } from 'src/app/models/enum';
import { MatDialog } from '@angular/material/dialog';
import { customComponent } from './plugins/custom-components';
import { BuilderPopupService } from '../../services/builder-popup.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { PageFormComponent } from '../page-form/page-form.component';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import components from './plugins/custom-components/components';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'rd-builder',
  standalone: true,
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
  imports: [CommonModule, RouterModule, MatMenuModule],
})
export class BuilderComponent implements OnInit, OnDestroy {
  pageDetails!: IPageDetails | any;
  pageConfig: any;
  pageConfig$!: Observable<any>;
  destroySubject: Subject<void> = new Subject<void>();
  swv = 'sw-visibility';
  expt = 'export-template';
  osm = 'open-sm';
  otm = 'open-tm';
  ola = 'open-layers';
  obl = 'open-blocks';
  ful = 'fullscreen';
  prv = 'preview';
  customCssRules: string[] = [];
  status = STATUS;
  isPreview: boolean = false;
  searchText: string = '';
  environment: any = environment;

  @ViewChild('grapesJsEditor') grapesJsEditorRef: ElementRef =
    new ElementRef<any>(undefined);
  private editor!: Editor;
  constructor(
    private pageBuilderService: PageBuilderService,
    private commonStoreService: CommonStoreService,
    private dialog: MatDialog,
    private builderPopupService: BuilderPopupService,
    private toasterService: ToastrService
  ) {}
  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
    if (this.editor) {
      this.editor.destroy();
    }
  }
  ngOnInit(): void {
    this.getConfig();
    this.addSearchInputField();
  }
  async getConfig() {
    this.pageConfig = await this.commonStoreService.getFormConfig();
    // this.pageConfig$ = of(this.pageConfig);
    if (this.pageConfig.id) {
      this.getPageDetails(this.pageConfig.id);
    } else {
      this.getPageData();
    }
  }
  getPageData() {
    this.pageBuilderService
      .getPage()
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: (res: IPageDetails) => {
          this.pageDetails = res;
          this.initializeBuilder();
        },
        error: (error: Error) => {},
      });
  }
  initializeBuilder() {
    this.editor = grapesjs.init({
      container: '#grapesJsEditor',
      forceClass: false,
      // styleManager: {
      //   sectors: [],
      // },
      storageManager: false,
      selectorManager: {
        componentFirst: true, // keep this true, as this avoids adding style changes in common class
      },
      plugins: [
        (editor: Editor) => rdBlocks(editor, { pageDetails: this.pageConfig }),
        (editor: Editor) =>
          imageUpload(editor, { uploadService: this.pageBuilderService }),
        (editor: Editor) =>
          customComponent(editor, {
            builderPopupService: this.builderPopupService,
          }),
      ],
      assetManager: {
        showUrlInput: false,
        uploadFile: (ev: any) => {
          const files = ev.dataTransfer
            ? ev.dataTransfer.files
            : ev.target.files;
          if (files && files.length) {
            this.uploadMedia(files[0]);
          }
        },
        assets: [],
      },
      canvas: {
        styles: [
          '/assets/styles/buttons.css',
          '/assets/styles/builder/components.css',
          'https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css',
        ],
        scripts: [
          'https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js',
        ],
      },
      blockManager: {
        blocks: [],
      },
      panels: {
        defaults: [
          {
            id: 'devices',
            buttons: [
              {
                id: 'deviceDesktop',
                command: () => {
                  return this.editor.setDevice('Desktop');
                },
                active: true,
                className: 'fa fa-desktop',
              },
              {
                id: 'deviceTablet',
                command: () => {
                  return this.editor.setDevice('Tablet');
                },
                className: 'fa fa-tablet',
              },
              {
                id: 'deviceMobile',
                command: () => {
                  return this.editor.setDevice('Mobile portrait');
                },
                className: 'fa fa-mobile',
              },
            ],
          },
          {
            id: 'options',
            buttons: [
              {
                id: 'undo',
                className: 'fa fa-undo',
                command: 'core:undo',
                attributes: { title: 'Undo' },
              },
              {
                id: 'redo',
                className: 'fa fa-repeat',
                command: 'core:redo',
                attributes: { title: 'Redo' },
              },
              {
                active: true,
                id: this.swv,
                className: 'fa fa-square-o',
                command: 'core:component-outline',
                context: this.swv,
                attributes: { title: 'View components' },
              },
              {
                id: this.prv,
                className: 'fa fa-eye',
                command: this.prv,
                context: this.prv,
                attributes: { title: 'Preview' },
              },
              {
                id: this.ful,
                className: 'fa fa-arrows-alt',
                command: this.ful,
                context: this.ful,
                attributes: { title: 'Fullscreen' },
              },
            ],
          },
          {
            id: 'views',
            buttons: [
              {
                id: this.obl,
                className: 'fa fa-th-large',
                command: this.obl,
                active: true,
                togglable: true,
                attributes: { title: 'Open Components' },
              },
              {
                id: this.osm,
                className: 'fa fa-paint-brush',
                command: this.osm,
                togglable: true,
                attributes: { title: 'Open Style Manager' },
              },
              {
                id: this.otm,
                className: 'fa fa-cog',
                command: this.otm,
                togglable: true,
                attributes: { title: 'Settings' },
              },
              {
                id: this.ola,
                className: 'fa fa-bars',
                command: this.ola,
                togglable: true,
                attributes: { title: 'Open Layer Manager' },
              },
            ],
          },
        ],
      },
      deviceManager: {
        default: '',
        devices: [
          {
            id: 'desktop',
            name: 'Desktop',
            width: '',
          },
          {
            id: 'tablet',
            name: 'Tablet',
            width: '770px',
            widthMedia: '992px',
          },
          {
            id: 'mobileLandscape',
            name: 'Mobile landscape',
            width: '568px',
            widthMedia: '768px',
          },
          {
            id: 'mobilePortrait',
            name: 'Mobile portrait',
            width: '320px',
            widthMedia: '480px',
          },
        ],
      },
    });
    this.editor.on('load', () => {
      let um = this.editor.UndoManager;
      [...this.editor.AssetManager.getAll()].forEach((asset: any) => {
        if (asset.get('type') === 'css') {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = asset.get('src');
          document.head.appendChild(cssLink);
        }
      });
      if (this.pageConfig.id) {
        this.editor.setComponents(this.pageDetails.Html);
        this.editor.Css.addRules(this.pageDetails.Css);
        um.clear();
      } else {
        this.setPageBanner(this.pageDetails.Title);
        um.clear();
      }
    });
    this.editor.on('component:remove', (component: any) => {
      if (component) {
        let attrs = component.getAttributes();
        if (attrs['data-type-id'] == 'rd-user-card') {
          this.editor.Css.remove(
            `[data-people-id="${attrs['data-people-id']}"]`
          );
          this.editor.Css.remove(
            `[data-people-name="${attrs['data-people-name']}"]`
          );
        }
      }
    });
    this.editor.on('component:add', (ele: any, args: any) => {
      ele.setAttributes({
        ...ele.getAttributes(),
        'data-custom-page': 'true',
      });

      ele.attributes.components.models.forEach((model: any) => {
        model.setAttributes({
          ...model.getAttributes(),
          'data-custom-page': 'true',
        });
      });
    });
    this.editor.on('block:drag:stop', (component: any, block: any) => {
      this.setPopupId(component);
      if (environment.CUSTOM_SLIDER_CAROUSEL) {
        this.setCarouselId(component);
      }
    });
  }
  setPopupId(component: any) {
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    component.components().forEach((child: any) => {
      if (
        child.getAttributes()['data-bs-target'] ===
        `#${BUILDER_CONSTANTS.POPUP_ID}`
      ) {
        child.setAttributes({
          ...child.getAttributes(),
          'data-bs-target': `#popup_${uniqueId}`,
        });
      }
      if (child.getAttributes()['id'] === BUILDER_CONSTANTS.POPUP_ID) {
        child.setAttributes({
          ...child.getAttributes(),
          id: `popup_${uniqueId}`,
        });
      }
    });
  }
  setCarouselId(component: any) {
    if (environment.CUSTOM_SLIDER_CAROUSEL) {
      const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      if (
        component.getAttributes()['id'] === BUILDER_CONSTANTS.SLIDER_CAROUSEL_ID
      ) {
        component.setAttributes({
          ...component.getAttributes(),
          id: `carousel_${uniqueId}`,
        });
      }
      component.components().forEach((child: any) => {
        if (
          child.getAttributes()['data-bs-target'] ===
          `#${BUILDER_CONSTANTS.SLIDER_CAROUSEL_ID}`
        ) {
          child.setAttributes({
            ...child.getAttributes(),
            'data-bs-target': `#carousel_${uniqueId}`,
          });
        }
      });
    }
  }
  /**
   * Get the page details by making an API call
   * @method getPageDetails
   * @param pageId pageId defining the unique page/menu id
   */
  getPageDetails(pageId: number) {
    this.pageBuilderService.getPageDetails(pageId).subscribe({
      next: (res: any) => {
        this.pageDetails = res.data;
        this.initializeBuilder();
      },
      error: (error: Error) => {},
    });
  }
  editPage() {
    const dialogRef = this.dialog
      .open(PageFormComponent, {
        data: {
          Title: this.pageDetails.Title,
          Route: this.pageDetails.Route,
          ParentId: this.pageDetails.ParentId,
          Portal: this.pageDetails.Portal,
        },
        minWidth: '40vw',
        minHeight: '50vh',
      })
      .afterClosed()
      .subscribe({
        next: (result: any) => {
          if (result) {
            this.pageDetails = {
              ...this.pageDetails,
              Title: result.Title,
              Route: result.Route,
              ParentId: result.ParentId,
              Portal: result.Portal,
            };
          }
        },
        error: (error: any) => {
          console.error('Error :: updating page:', error);
        },
        complete: () => {
          dialogRef.unsubscribe();
        },
      });
  }

  searchInput(event: Event) {
    if (environment.CUSTOM_COMPONENT_SEARCH) {
      this.searchText = (event.target as HTMLInputElement).value.toLowerCase();
      const blocks = document.querySelectorAll('.gjs-block');
      const allDivs = document.querySelectorAll('.gjs-block-category.gjs-open');
      let anyMatchFound = false;
      blocks.forEach((div: any) => {
        const title = div.getAttribute('title').toLowerCase();
        if (title && title.includes(this.searchText)) {
          div.style.display = 'block';
          anyMatchFound = true;
        } else {
          div.style.display = 'none';
        }
      });
      if (anyMatchFound) {
        allDivs.forEach((mainDiv: any) => {
          mainDiv.style.display = 'block';
        });
      } else {
        allDivs.forEach((mainDiv: any) => {
          mainDiv.style.display = 'none';
        });
      }
    }
  }

  addSearchInputField() {
    if (environment.CUSTOM_COMPONENT_SEARCH) {
      const searchContainer = document.createElement('div');
      searchContainer.classList.add('search-container');
      searchContainer.classList.add('component-search-container');
      const inputField = document.createElement('input');
      const searchIcon = document.createElement('img');
      searchIcon.setAttribute('src', 'assets/images/search.svg');
      inputField.setAttribute('type', 'text');
      inputField.setAttribute('name', 'search');
      inputField.setAttribute('id', 'componentSearch');
      inputField.setAttribute('placeholder', 'Search');
      inputField.addEventListener('input', this.searchInput);
      searchContainer.appendChild(inputField);
      searchContainer.appendChild(searchIcon);
      setTimeout(() => {
        const divPanel = document.querySelector('.gjs-block-categories');
        divPanel?.prepend(searchContainer);
      }, 3000);
    }
  }

  /**
   * Sets the default banner to the page
   * @param title The title for the page
   */
  setPageBanner(title: string) {
    const blockManager = this.editor.BlockManager;
    let targetBlock: any = blockManager.get('rd-banner').getContent();
    if (targetBlock) {
      targetBlock = {
        ...targetBlock,
        components: [...targetBlock.components].map((component: any) => {
          if (component && component.id == BUILDER_CONSTANTS.BANNER_TITLE) {
            return { ...component, content: title };
          }
          return component;
        }),
      };
      this.editor.addComponents(targetBlock);
    }
  }
  /**
   * Makes an API call to upload the media
   * @param file The file is an image
   */
  uploadMedia(file: any) {
    this.pageBuilderService
      .uploadMedia(file, MEDIA_TYPE.CUSTOM_PAGES)
      .subscribe({
        next: (res: any) => {
          this.editor.AssetManager.add(res.Url);
        },
        error: (error: Error) => {},
      });
  }
  displayError(error: any) {
    let errors = JSON.parse(error);
    Object.keys(errors).forEach((err: any) => {
      this.toasterService.error(errors[err][0]);
    });
  }
  onSave(status: STATUS) {
    let pageDetails: IPageDetails = {
      Title: this.pageDetails.Title,
      Portal: this.pageDetails.Portal,
      Route: this.pageDetails.Route,
      ParentId: this.pageDetails.ParentId,
      Html: this.editor.getHtml({ cleanId: true }),
      Css: this.editor.getCss(),
      Status: status,
    };
    if (this.pageConfig.id) {
      this.pageBuilderService
        .updatePage(pageDetails, this.pageConfig.id)
        .subscribe({
          next: (res: any) => {
            this.toasterService.success(res.message);
          },
          error: (error: HttpErrorResponse) => {
            error.error.errors
              ? this.displayError(error.error.errors)
              : this.toasterService.error(error.error.message);
          },
        });
    } else {
      this.pageBuilderService.addPage(pageDetails).subscribe({
        next: (res: any) => {
          this.pageConfig = {
            ...this.pageConfig,
            id: res.data.MenuId,
          };
          this.commonStoreService.setFormConfig(this.pageConfig);
          this.toasterService.success(res.message);
        },
        error: (error: HttpErrorResponse) => {
          error.error.errors
            ? this.displayError(error.error.errors)
            : this.toasterService.error(error.error.message);
        },
      });
    }
  }

  preview() {
    if (environment.PREVIEW_CHANGES) {
      this.editor.runCommand('page-preview', {
        pageDetails: this.pageDetails,
        pageConfig: this.pageConfig,
      });
    }
  }
}
