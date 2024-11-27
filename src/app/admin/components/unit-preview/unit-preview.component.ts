import { Component, ViewChild } from '@angular/core';
import { SESSION, FEATURE_AMENITIES } from 'src/app/models/constants';
import { LoaderService } from 'src/app/shared/services/loader/loader.service';
import { UnitPreviewService } from '../../services/unit-preview.service';
import { UnitService } from '../../services/unit.service';
import { Router } from '@angular/router';
import { CommonStoreService } from 'src/app/services/common-store.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { IPdfDoc } from '../../models/interfaces';
import { PLACEHOLDER } from '../../models/base64-image';
import { ToastrService } from 'ngx-toastr';
import { parse } from 'node-html-parser';
import { SECTOR } from 'src/app/models/sector';
import { UserStoreService } from 'src/app/services/user-store.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { PROPERTY_IMAGE } from '../../models/base64-property-image';
import { MatDialog } from '@angular/material/dialog';
import { CarouselDialogComponent } from 'src/app/frontend/shared/carousel-dialog/carousel-dialog.component';
(pdfMake as any).vfs =
pdfFonts && pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : globalThis.pdfMake.vfs;

const pdfConfig = Object.freeze({
  pageWidth: 596,
  pageHeight: 842,
  pageMargins: [20, 120, 20, 60],
  pageOrientation: 'portrait',
  colors: {
    grey: '#58595b',
    midGrey: '#999999',
    lightGrey: '#cccccc',
    darkGrey: '#333333',
    deepRed: '#aa0015',
  },
});
@Component({
  selector: 'app-unit-preview',
  templateUrl: './unit-preview.component.html',
  styleUrls: ['./unit-preview.component.scss'],
})
export class UnitPreviewComponent {
  unitDetails: any;
  formConfig!: any;
  userInfo: any;
  docDefinition!: IPdfDoc | any;
  imagePlaceholder: string = 'assets/images/property-default-image.jpg';
  imagePlaceholders: any[] = [
    {
      Url: this.imagePlaceholder,
    },
    {
      Url: this.imagePlaceholder,
    },
    {
      Url: this.imagePlaceholder,
    },
  ];
  media: any;
  id = 53;
  leaseValues: any;
  brochure: boolean = false;
  attributeImage!: string;
  logoImage!: string;
  propertyImage!: string;
  pdfProgress: number = 0;
  starsArray!: {
    columns: { image: string; width: number; height: number }[];
    columnGap: number;
  };
  greenStarRatingSubfeaturelength: any;

  constructor(
    private router: Router,
    private unitService: UnitService,
    private userStore: UserStoreService,
    private loaderService: LoaderService,
    private toasterService: ToastrService,
    private unitPreviewService: UnitPreviewService,
    private commonStoreService: CommonStoreService,
    private commonService: CommonService,
    public dialog: MatDialog
  ) {
    this.getUnitPreviewDetails();
    this.getUserInfo();
  }

  data: any;
  async getUserInfo() {
    (await this.userStore.getUser()).subscribe((result: any) => {
      this.userInfo = result;
    });
  }
  async getUnitPreviewDetails() {
    this.formConfig = await this.commonStoreService.getFormConfig();
    this.loaderService.show();
    this.unitPreviewService.unitPreviewDetails(this.formConfig.id).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.unitDetails = res.data;
        this.media = res.data.PropertyMedia;
        this.leaseValues = this.unitService.onNetRentalSelect(
          this.unitDetails.details.BaseRental,
          this.unitDetails.details.OperationalCost,
          this.unitDetails.details.Rates,
          this.unitDetails.details.UnitSize,
          this.unitDetails.details.NetRental,
          this.unitDetails.details.OpsRental
        );
      },
      error: (error: any) => {
        this.loaderService.hide();
      },
    });
  }

  openCarousel(index: any): void {
    if (this.unitDetails.PropertyMedia.Image) {
      const dialogRef = this.dialog.open(CarouselDialogComponent, {
        data: {
          images: this.unitDetails.PropertyMedia?.Image,
          startIndex: index,
        },
        height: '100vh',
        width: '100vw',
        maxWidth: '100vw',
      });
      dialogRef.afterClosed().subscribe((action: any) => {
        if (action === 'send') {
          // Handle any actions after closing the dialog if needed
        }
      });
    }
  }

  goToManage() {
    sessionStorage.removeItem(SESSION.FORM_CONFIG);
    this.router.navigate(['/admin/dashboard']);
  }

  getFeatureIcon(name: string): string {
    return this.commonService.getFeatureIcons(name);
  }
  /**
   * Download the custom brochure PDF
   */
  async createPdf() {
    this.loaderService.show();
    this.docDefinition = {
      ...this.docDefinition,
      content: [
        // Property - Banner image
        { fit: [790, 600], image: 'property_1', margin: [-20, -120, -20, 0] },
        this.headerContent(false, false),
        // Property - contact details
        {
          table: {
            widths: ['50%', '50%'],
            body: [
              [
                ...(this.userInfo && this.userInfo.CompanyLogo
                  ? [
                      {
                        image: 'logo',
                        fit: [100, 100],
                        margin: [10, 30],
                        alignment: 'center',
                      },
                    ]
                  : [
                      {
                        text: '',
                        fit: [200, 200],
                        margin: [10, 30],
                        alignment: 'center',
                      },
                    ]),
                {
                  columns: [
                    {
                      stack: [
                        {
                          text: 'CONTACT BROKER',
                          margin: [55, 0, 0, 10],
                          characterSpacing: 1,
                        },
                        {
                          text: `${this.userInfo.FirstName} ${this.userInfo.LastName}`,
                          fontSize: 12,
                          margin: [55, 0, 0, 15],
                          characterSpacing: 1,
                        },
                        {
                          text: [
                            { text: 'P: ', fontSize: 12 },
                            {
                              text: this.isNullOrEmpty(
                                this.userInfo.OfficeNumber
                              ),
                              color: 'grey',
                            },
                          ],
                          fontSize: 12,
                          margin: [55, 0, 0, 8],
                        },
                        {
                          text: [
                            { text: 'E: ', fontSize: 12 },
                            {
                              text: this.isNullOrEmpty(this.userInfo.Email),
                              color: 'grey',
                            },
                          ],
                          fontSize: 12,
                          margin: [55, 0, 0, 8],
                        },
                      ],
                    },
                  ],
                },
              ],
            ],
          },
          layout: {
            vLineWidth: (i: number) => {
              return 2;
            },
            hLineColor: (i: number, node: any) => {
              return i === 0 || i === node.table.body.length ? '#fff' : '#fff';
            },
            vLineColor: (i: number, node: any) => {
              return i === 0 || i === node.table.widths.length
                ? '#fff'
                : pdfConfig.colors.darkGrey;
            },
            paddingTop: (i: number, node: any) => {
              return 15;
            },
            paddingBottom: (i: number, node: any) => {
              return 15;
            },
          },
          margin: [0, 25, 0, 0],
          pageBreak: 'after',
        },
        // Property - Image grid
        this.getImageGrid('property'),
        // Property - link
        {
          text: this.isNullOrEmpty(this.unitDetails.details.WebsiteUrl),
          ...(this.unitDetails.details.WebsiteUrl
            ? { link: this.unitDetails.details.WebsiteUrl }
            : null),
          style: 'link',
          fontSize: 11,
          alignment: 'right',
          margin: [0, 10, 0, 20],
        },
        // Property - Address
        [
          { text: 'Address', fontSize: 13, margin: [0, 0, 0, 5] },
          {
            text: this.isNullOrEmpty(this.unitDetails.details.Address),
            fontSize: 12,
            color: 'grey',
            margin: [0, 0, 0, 20],
          },
        ],
        // Property - Province City and Suburb
        [
          {
            columns: [
              {
                width: '33%',
                text: [
                  { text: 'Province: ' },
                  {
                    text: this.isNullOrEmpty(
                      this.unitDetails.details.ProvinceName
                    ),
                    color: 'grey',
                  },
                ],
              },
              {
                width: '33%',
                text: [
                  { text: 'City: ' },
                  {
                    text: this.isNullOrEmpty(this.unitDetails.details.City),
                    color: 'grey',
                  },
                ],
              },
              {
                width: '33%',
                text: [
                  { text: 'Suburb: ' },
                  {
                    text: this.isNullOrEmpty(this.unitDetails.details.Suburb),
                    color: 'grey',
                  },
                ],
              },
            ],
            fontSize: 11,
            margin: [0, 0, 0, 0],
          },
        ],
        //  GPS Coordinates
        [
          { text: 'GPS Coordinates', fontSize: 13, margin: [0, 20, 0, 10] },
          {
            columns: [
              {
                width: '33%',
                text: [
                  { text: 'Latitude: ' },
                  {
                    text: this.isNullOrEmpty(this.unitDetails.details.Latitude),
                    color: 'grey',
                  },
                ],
              },
              {
                width: '33%',
                text: [
                  { text: 'Longitude: ' },
                  {
                    text: this.isNullOrEmpty(
                      this.unitDetails.details.Longitude
                    ),
                    color: 'grey',
                  },
                ],
              },
            ],
            fontSize: 11,
            margin: [0, 0, 0, 20],
          },
        ],
        this.hLine(),
        // Description
        ...(this.unitDetails.details.PropertyDescription != null
          ? [
              {
                text: 'Description',
                fontSize: 13,
                margin: [0, 20, 0, 10],
              },
              {
                text: parse(this.unitDetails.details.PropertyDescription),
                fontSize: 11,
                alignment: 'justify',
                color: 'grey',
                margin: [0, 0, 0, 20],
              },
            ]
          : []),
        this.hLine(),
        // Property - Parking details
        ...(this.unitDetails.details.SectorName !== SECTOR.INDUSTRIAL
          ? [
              [
                {
                  text: 'Parking details',
                  fontSize: 13,
                  margin: [0, 20, 0, 10],
                },
                {
                  columns: [
                    {
                      width: '33%',
                      text: [
                        { text: 'Parking ratio: ' },
                        {
                          text:
                            this.unitDetails.details.ParkingRatio != null
                              ? this.unitDetails.details.ParkingRatio
                              : '0.0',
                          color: 'grey',
                        },
                      ],
                    },
                    {
                      width: '33%',
                      text: [
                        { text: 'Basement bays (R/bays): ' },
                        {
                          text:
                            this.unitDetails.details.BasementBays != null
                              ? this.unitDetails.details.BasementBays
                              : '0.0',
                          color: 'grey',
                        },
                      ],
                    },
                    {
                      width: '33%',
                      text: [
                        { text: 'Shaded bays (R/bays): ' },
                        {
                          text:
                            this.unitDetails.details.ShadedBays != null
                              ? this.unitDetails.details.ShadedBays
                              : '0.0',
                          color: 'grey',
                        },
                      ],
                    },
                  ],
                  fontSize: 11,
                  margin: [0, 0, 0, 20],
                },
                {
                  columns: [
                    {
                      width: '33%',
                      text: [
                        { text: 'Open bays (R/bays): ' },
                        {
                          text:
                            this.unitDetails.details.OpenBays != null
                              ? this.unitDetails.details.OpenBays
                              : '0.0',
                          color: 'grey',
                        },
                      ],
                    },
                  ],
                  fontSize: 11,
                  margin: [0, 0, 0, 20],
                },
              ],
              this.hLine(),
            ]
          : []),
        this.hLine(),
        ...(this.unitDetails.details.SectorName === SECTOR.INDUSTRIAL &&
        this.unitDetails.details.Density != null
          ? [
              [
                {
                  text: 'Density details',
                  fontSize: 13,
                  margin: [0, 20, 0, 10],
                },
                {
                  columns: [
                    {
                      width: '100%',
                      text: [
                        { text: 'Density amount: ' },
                        {
                          text: this.unitDetails.details.Density,
                          color: 'grey',
                        },
                      ],
                    },
                  ],
                  fontSize: 11,
                  margin: [0, 0, 0, 20],
                },
              ],
            ]
          : []),
        this.hLine(),
        ...(this.unitDetails.details.SectorName === SECTOR.INDUSTRIAL &&
        this.unitDetails.details.GradeType != null
          ? [
              [
                {
                  text: 'Grade details',
                  fontSize: 13,
                  margin: [0, 20, 0, 10],
                },
                {
                  columns: [
                    {
                      width: '100%',
                      text: [
                        { text: 'Grade type: ' },
                        {
                          text: this.unitDetails.details.GradeType,
                          color: 'grey',
                        },
                      ],
                    },
                  ],
                  fontSize: 11,
                  margin: [0, 0, 0, 20],
                },
              ],
            ]
          : []),
        this.hLine(),
        ...(this.unitDetails.details.SectorName === SECTOR.RETAIL &&
        this.unitDetails.details.AnnualFootCount != null
          ? [
              [
                {
                  text: 'Annual Foot Count',
                  fontSize: 13,
                  margin: [0, 20, 0, 10],
                },
                {
                  columns: [
                    {
                      width: '100%',
                      text: [
                        { text: 'Foot count: ' },
                        {
                          text: this.unitDetails.details.AnnualFootCount,
                          color: 'grey',
                        },
                      ],
                    },
                  ],
                  fontSize: 11,
                  margin: [0, 0, 0, 20],
                },
              ],
            ]
          : []),
        this.hLine(),
        ...(this.unitDetails.details.SectorName === SECTOR.RETAIL &&
        this.unitDetails.details.AnchorTenant != null
          ? [
              [
                {
                  text: 'Anchor Tenants',
                  fontSize: 13,
                  margin: [0, 20, 0, 10],
                },
                {
                  columns: [
                    {
                      width: '100%',
                      text: [
                        { text: 'Name of anchor tenants: ' },
                        {
                          text: this.unitDetails.details.AnchorTenant,
                          color: 'grey',
                        },
                      ],
                    },
                  ],
                  fontSize: 11,
                  margin: [0, 0, 0, 20],
                },
              ],
            ]
          : []),
        this.hLine(),
        ...(this.unitDetails.details.SectorName === SECTOR.RETAIL &&
        this.unitDetails.details.TotalTenants != null
          ? [
              [
                {
                  text: 'Total Tenant',
                  fontSize: 13,
                  margin: [0, 20, 0, 10],
                },
                {
                  columns: [
                    {
                      width: '100%',
                      text: [
                        { text: 'Amount of tenants: ' },
                        {
                          text: this.isNullOrEmpty(
                            this.unitDetails.details.TotalTenants
                          ),
                          color: 'grey',
                        },
                      ],
                    },
                  ],
                  fontSize: 11,
                  margin: [0, 0, 0, 20],
                },
              ],
              this.hLine(),
            ]
          : []),
        this.getFeatureAmenities(
          'Feature and amenities',
          this.unitDetails.propertyfeatures
        ),
        this.hLine(),
        // Property - Features and Amenities Additional information
        // [
        //   {
        //     text: parse(
        //       this.isNullOrEmpty(this.unitDetails.details.FeatureAmenitiesAddtionalDetails)
        //     ),
        //     alignment: 'justify',
        //     color: 'grey',
        //     fontSize: 11,
        //     margin: [0, 0, 0, 20],
        //   },
        // ],
        ...(this.unitDetails.details.FeatureAmenitiesAddtionalDetails != null
          ? [
              [
                { text: 'Access and Comments', style: 'header' },
                {
                  text: parse(
                    this.unitDetails.details.FeatureAmenitiesAddtionalDetails
                  ),
                  fontSize: 11,
                  alignment: 'justify',
                  style: 'grey',
                  margin: [0, 0, 0, 20],
                  noWrap: false,
                },
              ],
              this.hLine(),
            ]
          : []),
        // Property - attributes
        this.getFeatureAmenities(
          'Property attributes',
          this.unitDetails.propertyattributes
        ),
        this.hLine(),
        this.getAdvertisingOpportunities(
          this.unitDetails.propertyadvertisments
        ),

        //esg features
        this.getEsgFeatures(this.unitDetails.propertyesgfeatures),

        /** Unit section start from here */
        this.getImageGrid('unit'),
        ...(this.unitDetails.details.UnitAvailableDate != null
          ? [
              [
                {
                  text: [
                    { text: 'Availability: ', style: 'header' },
                    {
                      text: this.unitDetails.details.UnitAvailableDate,
                      style: 'grey',
                    },
                  ],
                  margin: [0, 20, 0, 20],
                },
              ],
              this.hLine(),
            ]
          : []),
        //this.hLine(),
        // Unit - Description
        ...(this.unitDetails.details.UnitDescription != null
          ? [
              [
                { text: 'Description', style: 'header' },
                {
                  text: parse(
                    this.isNullOrEmpty(this.unitDetails.details.UnitDescription)
                  ),
                  fontSize: 11,
                  alignment: 'justify',
                  style: 'grey',
                  margin: [0, 0, 0, 20],
                  noWrap: false,
                },
              ],
              this.hLine(),
            ]
          : []),
        //  this.hLine(),
        // Unit - Rental details
        [
          { text: 'Rental details', style: 'header' },
          {
            columns: [
              {
                width: '33%',
                text: [
                  { text: 'Net rental (R/sqm): ' },
                  {
                    text: this.isNullOrEmpty(
                      this.unitDetails.details.BaseRental
                    ),
                    color: 'grey',
                  },
                ],
              },
              {
                width: '33%',
                text: [
                  { text: 'Operational costs (R/sqm): ' },
                  {
                    text: this.isNullOrEmpty(
                      this.unitDetails.details.OperationalCost
                    ),
                    color: 'grey',
                  },
                ],
              },
              {
                width: '33%',
                text: [
                  { text: 'Rates (R/sqm): ' },
                  {
                    text: this.isNullOrEmpty(this.unitDetails.details.Rates),
                    color: 'grey',
                  },
                ],
              },
            ],
            fontSize: 11,
            margin: [0, 0, 0, 20],
          },
          {
            columns: [
              {
                width: '33%',
                text: [
                  { text: 'Gross rental (R/sqm): ' },
                  {
                    text: this.isNullOrEmpty(
                      this.unitDetails.details.GrossRental
                    ),
                    color: 'grey',
                  },
                ],
              },
              {
                width: '33%',
                text: [
                  { text: 'CID levy (R/sqm): ' },
                  {
                    text:
                      this.unitDetails.details.CIDLevey != null
                        ? this.unitDetails.details.CIDLevey
                        : '0.0',
                    color: 'grey',
                  },
                ],
              },
            ],
            fontSize: 11,
            margin: [0, 0, 0, 20],
          },
        ],
        this.hLine(),
        // Unit - Parking details
        ...(this.unitDetails.details.SectorName !== SECTOR.INDUSTRIAL
          ? [
              [
                { text: 'Parking details', style: 'header' },
                {
                  columns: [
                    {
                      width: '33%',
                      text: [
                        { text: 'Parking ratio: ' },
                        {
                          text:
                            this.unitDetails.details.ParkingRatio != null
                              ? this.unitDetails.details.ParkingRatio
                              : '0.0',
                          color: 'grey',
                        },
                      ],
                    },
                    {
                      width: '33%',
                      text: [
                        { text: 'Basement bays (R/bays): ' },
                        {
                          text:
                            this.unitDetails.details.BasementBays != null
                              ? this.unitDetails.details.BasementBays
                              : '0.0',
                          color: 'grey',
                        },
                      ],
                    },
                    {
                      width: '33%',
                      text: [
                        { text: 'Shaded bays (R/bays): ' },
                        {
                          text:
                            this.unitDetails.details.ShadedBays != null
                              ? this.unitDetails.details.ShadedBays
                              : '0.0',
                          color: 'grey',
                        },
                      ],
                    },
                  ],
                  fontSize: 11,
                  margin: [0, 0, 0, 20],
                },
                {
                  columns: [
                    {
                      width: '33%',
                      text: [
                        { text: 'Open bays (R/bays): ' },
                        {
                          text:
                            this.unitDetails.details.OpenBays != null
                              ? this.unitDetails.details.OpenBays
                              : '0.0',
                          color: 'grey',
                        },
                      ],
                    },
                  ],
                  fontSize: 11,
                  margin: [0, 0, 0, 20],
                },
              ],
              this.hLine(),
            ]
          : []),
        //  Unit - Feature amenities
        this.getUnitFeatureAmenities(
          this.unitDetails.unitfeatureamenities.features
        ),
        this.hLine(),
        // Unit - incentives
        this.getFeatureAmenities(
          'Incentives',
          this.unitDetails.propertyincentives
        ),
        this.hLine(),
        ...(this.leaseValues != undefined
          ? [
              [
                {
                  text: 'Total Space2Spec value contribution',
                  style: 'header',
                },
                {
                  margin: [0, 0, 0, 20],
                  layout: 'noBorders',
                  fontSize: 11,
                  table: {
                    widths: [80, 80, pdfConfig.pageWidth - 215],
                    body: [
                      [
                        {
                          text: '3-Years Lease',
                        },
                        {
                          text: `R${this.leaseValues?.threeYearsLease}`,
                          italics: true,
                          color: 'grey',
                        },
                        {
                          text: `R${this.leaseValues?.threeYearsmSquare} per m²`,
                          alignment: 'right',
                          margin: [0, 0, 0, 10],
                        },
                      ],
                      [
                        {
                          text: '5-Years Lease',
                        },
                        {
                          text: `R${this.leaseValues?.fiveYearsLease}`,
                          italics: true,
                          color: 'grey',
                        },
                        {
                          text: `R${this.leaseValues?.fiveYearsmSquare}/m²`,
                          alignment: 'right',
                        },
                      ],
                    ],
                  },
                },
              ],
            ]
          : []),
        this.hLine(),
        ...(this.unitDetails.details.UnitAccessName != null
          ? [
              [
                { text: 'Access note', style: 'header' },
                {
                  text: this.unitDetails.details.UnitAccessName,
                  fontSize: 11,
                  alignment: 'justify',
                  color: 'grey',
                  margin: [0, 0, 0, 20],
                },
              ],
            ]
          : []),
        this.hLine(),
        ...(this.unitDetails.details.AddtionalInformation != null
          ? [
              [
                {
                  text: 'Additional Information',
                  style: 'header',
                },
                {
                  text: parse(this.unitDetails.details.AddtionalInformation),
                  fontSize: 11,
                  alignment: 'justify',
                  color: 'grey',
                  margin: [0, 0, 0, 20],
                },
              ],
            ]
          : []),
        this.hLine(),
        ...(this.unitDetails.details.TenentAllowance != null
          ? [
              [
                {
                  text: 'Tenant installation allowance',
                  style: 'header',
                },
                {
                  text: parse(this.unitDetails.details.TenentAllowance),
                  fontSize: 11,
                  alignment: 'justify',
                  color: 'grey',
                  margin: [0, 0, 0, 20],
                },
              ],
            ]
          : []),
      ],
      header: (currentPage: number, pageCount: number, pageSize: number) => {
        let isUnitSection = false;
        for (var l = 0; l < this.docDefinition.content.length; l++) {
          if (
            this.docDefinition.content[l].table &&
            this.docDefinition.content[l].table.id == 'unit' &&
            currentPage >=
              this.docDefinition.content[l].positions[0]?.pageNumber
          ) {
            isUnitSection = true;
            break;
          }
        }
        if (currentPage != 1) {
          return this.headerContent(isUnitSection);
        } else {
          return null;
        }
      },
      footer: [
        this.hLine(true),
        {
          columns: [
            {
              width: '25%',
              text: [
                { text: 'Company: ', bold: true },
                {
                  text: this.isNullOrEmpty(this.userInfo.CompanyName),
                  color: 'grey',
                },
              ],
            },
            {
              width: '25%',
              text: [
                { text: 'Office number: ', bold: true },
                {
                  text: this.isNullOrEmpty(this.userInfo.OfficeNumber),
                  color: 'grey',
                },
              ],
            },
            {
              width: '50%',
              text: [
                { text: 'Company address: ', bold: true },
                {
                  text: this.isNullOrEmpty(this.userInfo.CompanyAddress),
                  color: 'grey',
                },
              ],
            },
          ],
          fontSize: 8,
          margin: [20, 25, 20, 0],
        },
      ],
      styles: {
        header: {
          fontSize: 13,
          margin: [0, 20, 0, 10],
        },
        subheader: {
          fontSize: 11,
          margin: [0, 20, 0, 10],
        },
        paragraph: {
          fontSize: 12,
        },
        quote: {
          italics: true,
        },
        small: {
          fontSize: 8,
        },
        link: {
          color: '#aa0015',
          decoration: 'underline',
        },
        grey: {
          color: 'grey',
        },
      },
      images: await this.getPdfImages(),
      pageSize: { width: pdfConfig.pageWidth, height: pdfConfig.pageHeight },
      pageOrientation: pdfConfig.pageOrientation,
      pageMargins: pdfConfig.pageMargins,
      pageBreakBefore: function (
        currentNode: any,
        followingNodesOnPage: any,
        nodesOnNextPage: any,
        previousNodesOnPage: any
      ) {
        return (
          currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
        );
      },
    };
    console.dir(this.docDefinition, { depth: null });
    this.downloadPdf(this.docDefinition);
  }
  /**
   * Create and downloads ped
   * @param docDefinition
   */
  downloadPdf(docDefinition: any) {
    try {
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      // pdfDocGenerator.open();
      pdfDocGenerator.download(
        `Redefined_Brochure_${new Date().getDay()}-${new Date().getMonth()}-${new Date().getFullYear()}`,
        () => {
          this.loaderService.hide();
        }
      );
    } catch (error) {
      this.toasterService.error('Failed to download brochure');
      this.loaderService.hide();
    }
  }
  /**
   *
   * @returns
   */
  headerContent(isUnit: boolean = false, isHeader: boolean = true) {
    return {
      layout: 'noBorders',
      ...(!isHeader ? { margin: [-20, 0, -20, 0] } : null),
      table: {
        widths: ['60%', '40%'],
        heights: 40,
        body: [
          ...(isHeader
            ? [
                [
                  ...(this.userInfo && this.userInfo.CompanyLogo
                    ? [
                        {
                          image: 'logo',
                          fit: [40, 40],
                          color: '#ffffff',
                          alignment: 'right',
                          colSpan: 2,
                          margin: [0, 10, 10, 0],
                        },
                      ]
                    : [
                        {
                          text: '',
                          fit: [100, 100],
                          color: '#ffffff',
                          alignment: 'right',
                          colSpan: 2,
                          margin: [0, 10, 10, 0],
                        },
                      ]),
                  { text: '' },
                ],
              ]
            : []),
          [
            {
              text: isUnit
                ? `Unit: ${this.isNullOrEmpty(
                    this.unitDetails.details.NameAndLocation
                  )}`
                : this.isNullOrEmpty(this.unitDetails.details.PropertyName),
              fontSize: 15,
              color: '#ffffff',
              alignment: '',
              margin: [20, 13, 0, 10],
              fillColor: pdfConfig.colors.darkGrey,
            },
            {
              text: isUnit
                ? `Size: ${this.isNullOrEmpty(
                    this.unitDetails.details.UnitSize
                  )} m²`
                : `Sector: ${this.isNullOrEmpty(
                    this.unitDetails.details.SectorName
                  )}     GLA: ${this.isNullOrEmpty(
                    this.unitDetails.details.Gla
                  )} m²`,
              alignment: 'right',
              fontSize: 11,
              color: '#ffffff',
              margin: [0, 15, 20, 15],
              fillColor: pdfConfig.colors.darkGrey,
            },
          ],
        ],
      },
    };
  }
  /**
   *
   * @returns
   */
  hLine(isFooter: boolean = false) {
    return {
      canvas: [
        {
          type: 'line',
          x1: isFooter ? 20 : 0,
          y1: 0,
          x2: isFooter ? pdfConfig.pageWidth - 20 : pdfConfig.pageWidth - 40,
          y2: 0,
          lineWidth: 1,
          lineColor: 'grey',
        },
      ],
    };
  }

  /**
   *
   * @returns
   */
  underLine(feature?: any) {
    if (feature === 'Green Star Rating' || feature === 'WELL Health & Safety') {
      return {
        margin: [10, 0, 10, 10],
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 10,
            x2: pdfConfig.pageWidth - 450,
            y2: 10,
            lineWidth: 2,
            lineColor: 'white',
          },
        ],
      };
    } else {
      return {
        margin: [10, 0, 10, 10],
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 10,
            x2: 140,
            y2: 10,
            lineWidth: 2,
            lineColor: 'white',
          },
        ],
      };
    }
  }

  /**
   *
   * @returns
   */
  thinUnderLine(feature?: any) {
    if (feature === 'Green Star Rating' || feature === 'WELL Health & Safety') {
      return {
        margin: [0, 0, 0, 20],
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 10,
            x2: pdfConfig.pageWidth - 420,
            y2: 10,
            lineWidth: 1,
            lineColor: 'white',
          },
        ],
      };
    } else {
      return {
        margin: [0, 0, 0, 20],
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 10,
            x2: pdfConfig.pageWidth - 380,
            y2: 10,
            lineWidth: 1,
            lineColor: 'white',
          },
        ],
      };
    }
  }

  async getPdfImages() {
    return {
      logo:
        this.userInfo && this.userInfo.CompanyLogo
          ? this.userInfo.CompanyLogo
          : '', //await this.getBase64ImageFromURL('/assets/images/Logo.png'),
      attribute: await this.getBase64ImageFromURL(
        '/assets/images/attribute.png'
      ),
      wiFi: await this.getBase64ImageFromURL('/assets/images/pdf/wi-fi.png'),
      fibre: await this.getBase64ImageFromURL('/assets/images/pdf/fibre.png'),
      barricade: await this.getBase64ImageFromURL(
        '/assets/images/pdf/barricade.png'
      ),
      crane: await this.getBase64ImageFromURL('/assets/images/pdf/crane.png'),
      cylinder: await this.getBase64ImageFromURL(
        '/assets/images/pdf/cylinder.png'
      ),
      drop: await this.getBase64ImageFromURL('/assets/images/pdf/drop.png'),
      house: await this.getBase64ImageFromURL('/assets/images/pdf/house.png'),
      lightning: await this.getBase64ImageFromURL(
        '/assets/images/pdf/lightning.png'
      ),
      outsideGantries: await this.getBase64ImageFromURL(
        '/assets/images/pdf/outside-gantries.png'
      ),
      shield: await this.getBase64ImageFromURL('/assets/images/pdf/shield.png'),
      shower: await this.getBase64ImageFromURL('/assets/images/pdf/shower.png'),
      stairs: await this.getBase64ImageFromURL('/assets/images/pdf/stairs.png'),
      sun: await this.getBase64ImageFromURL('/assets/images/pdf/sun.png'),
      truck: await this.getBase64ImageFromURL('/assets/images/pdf/truck.png'),
      greenstarrating: await this.getBase64ImageFromURL(
        '/assets/images/green-star-rating.png'
      ),
      warehouse: await this.getBase64ImageFromURL(
        '/assets/images/pdf/warehouse.png'
      ),
      star: await this.getBase64ImageFromURL(
        '/assets/images/star-white-filled.svg'
      ),
      netzero: await this.getBase64ImageFromURL('/assets/images/net-zero.png'),
      netpositive: await this.getBase64ImageFromURL(
        '/assets/images/net-positive.png'
      ),
      arating: await this.getBase64ImageFromURL('/assets/images/A_Rating.svg'),
      brating: await this.getBase64ImageFromURL('/assets/images/B_Rating.svg'),
      crating: await this.getBase64ImageFromURL('/assets/images/C_Rating.svg'),
      drating: await this.getBase64ImageFromURL('/assets/images/D_Rating.svg'),
      erating: await this.getBase64ImageFromURL('/assets/images/E_Rating.svg'),
      frating: await this.getBase64ImageFromURL('/assets/images/F_Rating.svg'),
      grating: await this.getBase64ImageFromURL('/assets/images/G_Rating.svg'),
      arrowline: await this.getBase64ImageFromURL(
        '/assets/images/Arrow_Line.svg'
      ),
      arrowindicator: await this.getBase64ImageFromURL(
        '/assets/images/Arrow_Line_Indicator.svg'
      ),

      property_1: this.unitDetails?.PropertyMedia?.Image[0]
        ? this.unitDetails?.PropertyMedia?.Image[0].Url
        : PROPERTY_IMAGE,
      property_2: this.unitDetails?.PropertyMedia?.Image[1]
        ? this.unitDetails?.PropertyMedia?.Image[1].Url
        : PROPERTY_IMAGE,
      property_3: this.unitDetails?.PropertyMedia?.Image[2]
        ? this.unitDetails?.PropertyMedia?.Image[2].Url
        : PROPERTY_IMAGE,
      unit_1:
        this.unitDetails?.UnitMedia?.Image != undefined &&
        this.unitDetails?.UnitMedia?.Image[0]
          ? this.unitDetails?.UnitMedia?.Image[0].Url
          : PLACEHOLDER,
      unit_2:
        this.unitDetails?.UnitMedia?.Image != undefined &&
        this.unitDetails?.UnitMedia?.Image[1]
          ? this.unitDetails?.UnitMedia?.Image[1].Url
          : PLACEHOLDER,
      unit_3:
        this.unitDetails?.UnitMedia?.Image != undefined &&
        this.unitDetails?.UnitMedia?.Image[2]
          ? this.unitDetails?.UnitMedia?.Image[2].Url
          : PLACEHOLDER,
    };
  }

  /**
   *
   * @param images array of object which contain Url property
   * @returns
   */
  getImageGrid(type: string): any {
    if (type === 'unit') {
      if (this.unitDetails?.UnitMedia?.Image == undefined) {
        return {
          margin: [0, -30, 0, 0],
          layout: 'noBorders',
          table: {
            id: type,
            body: [
              [
                {
                  text: ` `,
                },
              ],
            ],
          },
        };
      } else if (
        this.unitDetails?.UnitMedia?.Image != undefined &&
        this.unitDetails?.UnitMedia?.Image.length == 1
      ) {
        return {
          layout: 'noBorders',
          margin: [-20, -32, -20, 0],
          table: {
            id: type,
            widths: [pdfConfig.pageWidth / 2, pdfConfig.pageWidth / 2],
            body: [
              [
                {
                  image: `${type}_1`,
                  // width: pdfConfig.pageWidth / 2 + 4,
                  width: pdfConfig.pageWidth,
                  height: pdfConfig.pageHeight / 4 + 5,
                  //  rowSpan: 2,
                },
              ],
              [''],
            ],
          },
        };
      } else if (
        this.unitDetails?.UnitMedia?.Image != undefined &&
        this.unitDetails?.UnitMedia?.Image.length == 2
      ) {
        return {
          layout: 'noBorders',
          margin: [-20, -32, -20, 0],
          table: {
            id: type,
            widths: [pdfConfig.pageWidth / 2, pdfConfig.pageWidth / 2],
            body: [
              [
                {
                  image: `${type}_1`,
                  width: pdfConfig.pageWidth / 2 + 4,
                  height: pdfConfig.pageHeight / 4 + 5,
                  rowSpan: 2,
                },
                {
                  image: `${type}_2`,
                  width: pdfConfig.pageWidth / 2,
                  height: pdfConfig.pageHeight / 4 / 2,
                },
              ],
              ['', {}],
            ],
          },
        };
      } else {
        return {
          layout: 'noBorders',
          margin: [-20, -32, -20, 0],
          table: {
            id: type,
            widths: [pdfConfig.pageWidth / 2, pdfConfig.pageWidth / 2],
            body: [
              [
                {
                  image: `${type}_1`,
                  width: pdfConfig.pageWidth / 2 + 4,
                  height: pdfConfig.pageHeight / 4 + 5,
                  rowSpan: 2,
                },
                {
                  image: `${type}_2`,
                  width: pdfConfig.pageWidth / 2,
                  height: pdfConfig.pageHeight / 4 / 2,
                },
              ],
              [
                '',
                {
                  image: `${type}_3`,
                  width: pdfConfig.pageWidth / 2,
                  height: pdfConfig.pageHeight / 4 / 2,
                },
              ],
            ],
          },
        };
      }
    } else {
      return {
        layout: 'noBorders',
        margin: [-20, -32, -20, 0],
        table: {
          id: type,
          widths: [pdfConfig.pageWidth / 2, pdfConfig.pageWidth / 2],
          body: [
            [
              {
                image: `${type}_1`,
                width: pdfConfig.pageWidth / 2 + 4,
                height: pdfConfig.pageHeight / 4 + 5,
                rowSpan: 2,
              },
              {
                image: `${type}_2`,
                width: pdfConfig.pageWidth / 2,
                height: pdfConfig.pageHeight / 4 / 2,
              },
            ],
            [
              '',
              {
                image: `${type}_3`,
                width: pdfConfig.pageWidth / 2,
                height: pdfConfig.pageHeight / 4 / 2,
              },
            ],
          ],
        },
      };
    }
  }

  /**
   * Creates the list of features
   * @param features An array of object, object must contain the Title property
   * @returns
   */
  getFeatureAmenities(title: string, features: any[], perRow: number = 3): any {
    if (features?.length > 0) {
      let featuresAndAmenities: any[] = [
        {
          text: title,
          style: 'header',
          margin: [0, 20, 0, 10],
        },
      ];
      // if (features.length) {
      for (let i = 0; i < features.length; i += perRow) {
        let featuresAmenities: any = {
          columns: [],
          fontSize: 11,
          margin: [0, 0, 0, 20],
        };
        features.slice(i, i + perRow).forEach((feature: any) => {
          featuresAmenities.columns.push({
            columns: [
              {
                width: 18,
                image: this.getFeatureImageName(feature.Title),
              },
              {
                width: 'auto',
                text: feature.Title,
                color: 'grey',
                margin: [10, 2],
              },
            ],
            width: '30%',
          });
        });
        featuresAndAmenities.push(featuresAmenities);
      }
      //}
      // else {
      //   featuresAndAmenities.push({
      //     text: 'Not available',
      //     color: 'grey',
      //     fontSize: 11,
      //     margin: [0, 0, 0, 0],
      //   });
      // }
      return featuresAndAmenities;
    }
  }
  getFeatureImageName(feature: string) {
    switch (feature) {
      case FEATURE_AMENITIES.PIT:
        return 'barricade';
      case FEATURE_AMENITIES.BALCONIES:
        return 'stairs';
      case FEATURE_AMENITIES.CRANES:
      case FEATURE_AMENITIES.CRANE_MAKE:
      case FEATURE_AMENITIES.TONNAGE_ALLOCATION:
        return 'crane';
      case FEATURE_AMENITIES.DEDICATED_TANKS:
      case FEATURE_AMENITIES.DIESEL_BOWSERS:
        return 'cylinder';
      case FEATURE_AMENITIES.OUTSIDE_GANTRIES:
        return 'outsideGantries';
      case FEATURE_AMENITIES.GENERATOR:
      case FEATURE_AMENITIES.BACKUP_GENERATOR:
        return 'lightning';
      case FEATURE_AMENITIES.SOLAR_PV:
        return 'sun';
      case FEATURE_AMENITIES.SECURITY:
        return 'shield';
      case FEATURE_AMENITIES.SPRINKLERS:
        return 'shower';
      case FEATURE_AMENITIES.WEIGH_BRIDGE:
        return 'truck';
      case FEATURE_AMENITIES.STOREROOMS:
        return 'warehouse';
      case FEATURE_AMENITIES.STANDBY_WATER:
        return 'drop';
      case FEATURE_AMENITIES.FIBRE:
        return 'fibre';
      case FEATURE_AMENITIES.WIFI:
        return 'wiFi';
      case FEATURE_AMENITIES.ROOF:
        return 'house';
      default:
        return 'attribute';
    }
  }
  /**
   *
   * @param features
   * @returns
   */
  getUnitFeatureAmenities(features: any[]): any {
    if (features?.length > 0) {
      let featuresAmenities: any[] = [
        {
          text: 'Features and amenities',
          style: 'header',
        },
      ];
      // if (features.length) {
      let featureTable: any = {
        table: {
          widths: ['50%', '50%'],
          body: [],
        },
        layout: 'noBorders',
        fontSize: 11,
        margin: [0, 0, 0, 20],
      };
      features.forEach((feature: any) => {
        featureTable.table.body.push([
          { text: feature.Title, alignment: 'left' },
          {
            text: this.isNullOrEmpty(feature.Value),
            color: 'grey',
            alignment: 'right',
            margin: [0, 0, 0, 10],
          },
        ]);
      });
      featuresAmenities.push(featureTable);
      // } else {
      //   featuresAmenities.push({
      //     text: 'Not available',
      //     color: 'grey',
      //     fontSize: 11,
      //     margin: [0, 0, 0, 20],
      //   });
      // }
      featuresAmenities.push({
        text:
          this.unitDetails.unitfeatureamenities
            .FeatureAmenitiesAddtionalDetails != null
            ? parse(
                this.unitDetails.unitfeatureamenities
                  .FeatureAmenitiesAddtionalDetails
              )
            : '',
        alignment: 'justify',
        color: 'grey',
        fontSize: 11,
        margin: [0, 0, 0, 20],
      });
      return featuresAmenities;
    }
  }

  getEsgFeatures(esgfeaturesList: any[]): any {
    if (esgfeaturesList?.length) {
      let subFeaturesTables = this.getSubFeatures(esgfeaturesList);
      let esgfeatures: any[] = [
        {
          text: 'ESG Features',
          style: 'header',
        },
      ];

      // if (esgfeaturesList.length) {
      esgfeaturesList.forEach((feature: any) => {
        if (feature.Name == 'Green Star Rating') {
          esgfeatures.push([
            {
              text: feature.Name,
              fontSize: 11,
              margin: [0, 30, 0, 10],
            },
            {
              image: 'greenstarrating',
              // margin: [left, top, right, bottom]
              margin: [0, -40, 0, 30],
              alignment: 'right',
              width: 230,
              height: 40,
            },
          ]);
          esgfeatures = esgfeatures.concat(subFeaturesTables[feature.EsgId]);
        } else if (feature.Name == 'Net Zero') {
          esgfeatures.push([
            {
              text: feature.Name,
              fontSize: 11,
              margin: [0, 30, 0, 10],
            },
            {
              image: 'netzero',
              margin: [0, -40, 0, 30],
              alignment: 'right',
              width: 230,
              height: 40,
            },
          ]);
          esgfeatures = esgfeatures.concat(subFeaturesTables[feature.EsgId]);
        } else if (feature.Name == 'Net Positive') {
          esgfeatures.push([
            {
              text: feature.Name,
              fontSize: 11,
              margin: [0, 30, 0, 10],
            },
            {
              image: 'netpositive',
              margin: [0, -40, 0, 30],
              alignment: 'right',
              width: 230,
              height: 40,
            },
          ]);
          esgfeatures = esgfeatures.concat(subFeaturesTables[feature.EsgId]);
        } else if (feature.Name == 'Energy Performance Certificate') {
          esgfeatures.push([
            {
              text: feature.Name,
              fontSize: 11,
              margin: [0, 30, 0, 10],
            },
          ]);
          esgfeatures = esgfeatures.concat(subFeaturesTables[feature.EsgId]);
        } else if (feature.Name == 'WELL Health & Safety') {
          esgfeatures.push([
            {
              text: feature.Name,
              fontSize: 11,
              margin: [0, 30, 0, 10],
            },
          ]);
          esgfeatures = esgfeatures.concat(subFeaturesTables[feature.EsgId]);
        }
      });
      // }
      // else {
      //   esgfeatures.push({
      //     text: 'Not available',
      //     color: 'grey',
      //     fontSize: 11,
      //     margin: [0, 0, 0, 20],
      //   });
      // }

      esgfeatures.push({
        text: '',
        pageBreak: 'after',
      });

      return esgfeatures;
    } else {
      let esgfeatures: any = [];
      esgfeatures.push({
        text: '',
        pageBreak: 'after',
      });
      return esgfeatures;
    }
  }

  getSubFeatures(esgfeaturesList: any[]) {
    let subFeatures: any = {};
    esgfeaturesList.forEach((feature: any) => {
      let tableData: any = [];
      if (feature.Name == 'Green Star Rating') {
        this.greenStarRatingSubfeaturelength = feature.SubFeatures.length;
        feature.SubFeatures.forEach((Subfeature: any) => {
          tableData.push([
            {
              table: {
                dontBreakRows: true,
                body: [
                  [''],
                  [
                    {
                      fillColor: this.getColor(Subfeature.EsgFeaturesId),
                      stack: [
                        {
                          text: `${Subfeature.FeatureName}`,
                          margin: [10, 10, 0, 0],
                          color: 'white',
                          alignment: 'left',
                          fontSize: 7,
                        },

                        this.underLine('Green Star Rating'),
                        this.getStars(Subfeature.Rating),
                        {
                          text: `${this.getStarRating(
                            Subfeature.Rating
                          )} Star Rating`,
                          margin: [10, 0, 0, 0],
                          color: 'white',
                          fontSize: 11,
                          bold: true,
                        },
                        this.thinUnderLine('Green Star Rating'),
                      ],
                    },
                  ],
                ],
              },
              layout: 'noBorders',
              margin: [0, -50, 0, 50],
              columnGap: 20,
            },
          ]);
        });
        tableData = this.prepareTable(tableData, 3);
        subFeatures[feature.EsgId] = tableData;
      } else if (feature.Name == 'Net Zero' || feature.Name == 'Net Positive') {
        feature.SubFeatures.forEach((Subfeature: any) => {
          tableData.push([
            {
              table: {
                dontBreakRows: true,
                widths: [pdfConfig.pageWidth / 3.5, 1],
                body: [
                  [''],
                  [
                    {
                      fillColor: this.getColor(Subfeature.EsgFeaturesId),
                      stack: [
                        {
                          text: `${Subfeature.FeatureName}`,
                          margin: [10, 10, 0, 0],
                          color: 'white',
                          alignment: 'left',
                          fontSize: 7,
                        },
                        this.underLine(),
                        {
                          text: `${Subfeature.Rating} (${Subfeature.LevelType})`,
                          margin: [10, 0, 0, 10],
                          color: 'white',
                          alignment: 'left',
                          fontSize: 7,
                        },
                        // this.getEmptyText(Subfeature.Rating),
                        {
                          text: `-including ${Subfeature.OffsetPercentage}% Offset Percentage`,
                          margin: [10, 0, 0, 10],
                          color: 'white',
                          alignment: 'left',
                          fontSize: 7,
                        },
                        this.getLevels(),

                        this.getArrow(Subfeature.Rating),
                        {
                          image: 'arrowline',
                          margin: [10, 0, 0, 10],
                          width: 140,
                        },

                        {
                          text: this.validityText(
                            Subfeature.ValidityStartDate,
                            Subfeature.ValidityEndDate
                          ),
                          margin: [10, 0, 0, 5],
                          color: 'white',
                          alignment: 'left',
                          fontSize: 7,
                        },
                        this.thinUnderLine(),
                      ],
                    },
                  ],
                ],
              },
              layout: 'noBorders',
              margin: [0, -50, 0, 50],
              columnGap: 0,
            },
          ]);
        });

        tableData = this.prepareTable(tableData, 3);
        subFeatures[feature.EsgId] = tableData;
      } else if (feature.Name == 'WELL Health & Safety') {
        feature.SubFeatures.forEach((Subfeature: any) => {
          tableData.push({
            table: {
              dontBreakRows: true,
              body: [
                [
                  {
                    fillColor: this.getColor(Subfeature.EsgFeaturesId),
                    columns: [
                      {
                        stack: [
                          {
                            text: `${Subfeature.FeatureName}`,
                            margin: [10, 10, 0, 0],
                            color: 'white',
                            alignment: 'left',
                            fontSize: 7,
                          },
                          this.underLine('WELL Health & Safety'),
                          this.getStarsWellandHealthy(Subfeature.Rating),
                          {
                            text: `${this.getStarRatingWellAndHealthy(
                              Subfeature.Rating
                            )}`,
                            margin: [10, 10, 0, 0],
                            color: 'white',
                            fontSize: 11,
                            bold: true,
                          },
                          this.thinUnderLine('WELL Health & Safety'),
                        ],
                      },
                    ],
                  },
                ],
              ],
            },
            margin: [0, 10, 0, 0],
            layout: 'noBorders',
          });
        });

        subFeatures[feature.EsgId] = tableData;
      } else if (feature.Name == 'Energy Performance Certificate') {
        feature.SubFeatures.forEach((Subfeature: any) => {
          tableData.push({
            table: {
              widths: ['30%', '50%'],
              body: [
                [
                  {
                    columns: [
                      {
                        stack: [
                          this.getEnergeyPerformanceImage(Subfeature.Rating),
                          // {
                          //   image: this.getEnergeyPerformanceImage(Subfeature.Rating),
                          //   width: 500,
                          //   height: 40
                          // },

                          this.getTextofEnergyCertificate(
                            Subfeature.Rating,
                            Subfeature.AdditionalInformation
                          ),
                          // {
                          //   text: 'View Certificate',
                          //   fontSize: 12,
                          //   margin: [0, 40, 0, 30],
                          //   alignment: 'right',
                          //   decoration: 'underline'
                          // },
                        ],
                      },
                    ],
                  },
                ],
              ],
            },
            layout: 'noBorders',
            margin: [0, 10, 0, 40],
          });
        });

        tableData.push(this.hLine());
        subFeatures[feature.EsgId] = tableData;
      }
    });

    return subFeatures;
  }

  prepareTable(tableData: any, numberOfColumn: number) {
    let columnHeadders: any = [];
    let totalSubColumns = {
      table: {
        body: [columnHeadders],
      },
      margin: [0, 30, 0, -20],
      layout: 'noBorders',
    };

    for (let i = 0; i < tableData.length; i += numberOfColumn) {
      let chunk: any = tableData.slice(i, i + numberOfColumn);
      columnHeadders = [];
      if (i == 0) {
        for (let j = 0; j < numberOfColumn; j++) {
          columnHeadders.push('');
        }
        totalSubColumns.table.body[0] = columnHeadders;
      }
      while (chunk.length < numberOfColumn) {
        chunk.push([]);
      }

      totalSubColumns.table.body.push(chunk);
    }

    tableData = [];
    tableData.push(totalSubColumns);
    tableData.push(this.hLine());
    return tableData;
  }

  getEmptyText(rating: any): any {
    if (
      rating.includes('Level 1') ||
      rating.includes('Level 3') ||
      rating.includes('Level 4')
    ) {
      return {
        text: ` `,
        fontSize: 5,
      };
    }
  }

  getStars(rating: any): any {
    let levelList = [];
    for (let i = 0; i < this.getStarRatingGreenStar(rating); i++) {
      levelList.push({
        margin: [8, 0, 0, 10],
        image: 'star',
        width: 20,
        height: 20,
      });
    }

    return {
      columns: levelList,
      columnGap: 6,
    };
  }

  getStarRatingGreenStar(rating: any): any {
    if (rating.includes('Star')) {
      switch (rating) {
        case '1 Star':
          return 1;
        case '2 Star':
          return 2;
        case '3 Star':
          return 3;
        case '4 Star':
          return 4;
        case '5 Star':
          return 5;
        case '6 Star':
          return 6;
      }
    } else {
      switch (rating) {
        case '1':
          return 1;
        case '2':
          return 2;
        case '3':
          return 3;
        case '4':
          return 4;
        case '5':
          return 5;
        case '6':
          return 6;
      }
    }
  }

  getLevels(): any {
    return {
      margin: [10, 0, 0, 10],
      table: {
        body: [
          [
            {
              text: 'Level 1',
              fillColor: '#C7D42C',
              color: 'white',
              alignment: 'left',
              fontSize: 6,
              border: [false, false, false, false],
            },
            {
              border: [false, false, false, false],
              text: 'Level 2',
              fillColor: '#A5C439',
              color: 'white',
              alignment: 'left',
              fontSize: 6,
            },
            {
              text: 'Level 3',
              fillColor: '#6DBA45',
              color: 'white',
              alignment: 'left',
              fontSize: 6,
              border: [false, false, false, false],
            },
            {
              text: 'Level 4',
              fillColor: '#23A149',
              color: 'white',
              alignment: 'left',
              fontSize: 6,
              border: [false, false, false, false],
            },
            {
              text: 'Level 5',
              fillColor: '#118441',
              color: 'white',
              alignment: 'left',
              fontSize: 6,
              border: [false, false, false, false],
            },
          ],
        ],
        columnGap: 0,
      },
    };
  }

  getStarsWellandHealthy(rating: any): any {
    let levelList = [];
    for (let i = 0; i < rating; i++) {
      levelList.push({
        margin: [8, 0, 0, 0],
        image: 'star',
        width: 20,
        height: 20,
      });
    }
    return {
      columns: levelList,
      columnGap: 10,
    };
  }

  getStarRating(rating: any): any {
    if (rating.includes('Star')) {
      switch (rating) {
        case '1 Star':
          return 1;
        case '2 Star':
          return 2;
        case '3 Star':
          return 3;
        case '4 Star':
          return 4;
        case '5 Star':
          return 5;
        case '6 Star':
          return 6;
      }
    } else {
      switch (rating) {
        case '1':
          return 1;
        case '2':
          return 2;
        case '3':
          return 3;
        case '4':
          return 4;
        case '5':
          return 5;
        case '6':
          return 6;
      }
    }
  }

  getStarRatingWellAndHealthy(rating: any): any {
    switch (rating) {
      case '1':
        return '1 Star Rating';
      case '2':
        return '2 Star Rating';
      case '3':
        return '3 Star Rating';
      case '4':
        return '4 Star Rating';
      case '5':
        return '5 Star Rating';
      case '6':
        return '6 Star Rating';
      default:
        return '';
    }
  }

  validityText(startDate: any, endDate: any): any {
    if (startDate != '0000-00-00' && endDate != '0000-00-00')
      return {
        text: `Validity: ${startDate.split('-')[0]} - ${
          startDate.split('-')[1]
        } to ${endDate.split('-')[0]} - ${endDate.split('-')[1]}`,
      };
    else {
      return {
        text: `Validity: NA`,
      };
    }
  }

  getArrow(rating: any): any {
    if (rating.includes('Level 1')) {
      return {
        image: 'arrowindicator',
        margin: [18, -5, 0, 0],
      };
    } else if (rating.includes('Level 2')) {
      return {
        image: 'arrowindicator',
        margin: [48, -5, 0, 0],
      };
    } else if (rating.includes('Level 3')) {
      return {
        image: 'arrowindicator',
        margin: [74, -5, 0, 0],
      };
    } else if (rating.includes('Level 4')) {
      return {
        image: 'arrowindicator',
        margin: [101, -5, 0, 0],
      };
    } else if (rating.includes('Level 5')) {
      return {
        image: 'arrowindicator',
        margin: [130, -5, 0, 0],
      };
    }
  }

  colors: any[] = [
    { Id: 1, color: '#004D38' },
    { Id: 2, color: '#A1998F' },
    { Id: 3, color: '#A1998F' },
    { Id: 4, color: '#A1998F' },
    { Id: 5, color: '#A1998F' },
    { Id: 6, color: '#A1998F' },
    { Id: 7, color: '#859C99' },
    { Id: 8, color: '#085F86' },

    { Id: 9, color: '#BA634F' },
    { Id: 10, color: '#D47D1F' },
    { Id: 11, color: '#A1998F' },
    { Id: 12, color: '#A1998F' },
    { Id: 13, color: '#D2AF1F' },
    { Id: 14, color: '#004D38' },
    { Id: 15, color: '#085F86' },
    { Id: 16, color: '#085F86' },

    // { Id: 7, color: '#004D38' },
    { Id: 21, color: '#FFBE00' },
    { Id: 17, color: '#FFBE00' },
    { Id: 26, color: '#289889' },
    { Id: 18, color: '#5B9AD4' },
    { Id: 22, color: '#5B9AD4' },
    { Id: 23, color: '#A96B31' },
    { Id: 19, color: '#A96B31' },
    { Id: 20, color: '#40A955' },
    { Id: 24, color: '#40A955' },
  ];

  getColor(id: any) {
    return this.colors.find((x) => x.Id === id)?.color;
  }

  getEnergeyPerformanceImage(rating: any): any {
    switch (rating) {
      case 'A':
        return {
          image: 'arating',
          width: 150,
          height: 40,
        };
      case 'B':
        return {
          image: 'brating',
          width: 200,
          height: 40,
        };
      case 'C':
        return {
          image: 'crating',
          width: 250,
          height: 40,
        };
      case 'D':
        return {
          image: 'drating',
          width: 300,
          height: 40,
        };
      case 'E':
        return {
          image: 'erating',
          width: 350,
          height: 40,
        };
      case 'F':
        return {
          image: 'frating',
          width: 400,
          height: 40,
        };
      case 'G':
        return {
          image: 'grating',
          width: 450,
          height: 40,
        };
    }
  }

  getTextofEnergyCertificate(rating: any, addiInfo: any): any {
    if (addiInfo != '' && addiInfo != null && addiInfo != undefined) {
      return {
        text: `${rating} - ${addiInfo}`,
        color: 'white',
        margin: [5, -25, 0, 0],
        fontSize: 10,
      };
    } else {
      return {
        text: `${rating}`,
        color: 'white',
        margin: [4, -25, 0, 0],
        fontSize: 10,
      };
    }
  }

  /**
   * Create list of property advertisements
   * @param advertisement
   */
  getAdvertisingOpportunities(advertisementOpportunities: any[]): any {
    if (advertisementOpportunities?.length > 0) {
      let advertisements: any[] = [
        {
          text: 'Advertising opportunities',
          style: 'header',
        },
      ];
      // if (advertisementOpportunities.length) {
      advertisementOpportunities.forEach((advertisement: any) => {
        advertisements.push([
          {
            text: advertisement.AdvertisingType,
            fontSize: 11,
            margin: [0, 0, 0, 10],
          },
          {
            text: advertisement.DescriptionAndLocation,
            alignment: 'justify',
            fontSize: 11,
            color: 'grey',
            margin: [0, 0, 0, 10],
            noWrap: false,
          },
        ]);
      });
      // }
      // else {
      //   advertisements.push({
      //     text: 'Not available',
      //     color: 'grey',
      //     fontSize: 11,
      //     margin: [0, 0, 0, 20],
      //   });
      // }
      advertisements.push({
        text: '',
        // pageBreak: 'after',
        pageBreak:
          this.unitDetails.propertyesgfeatures.length > 0 ? 'after' : '',
      });
      return advertisements;
    }
  }
  /**
   * Convert image to a base64 string
   * @param url image path
   * @returns base64 string promise
   */
  getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }

  isNullOrEmpty(data: any): any {
    return data == undefined || data == null || data == '' ? 'N/A' : data;
  }
}
