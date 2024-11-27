import { Injectable } from '@angular/core';
import {
  Border,
  BorderStyle,
  Cell,
  ImageHyperlinkValue,
  ImagePosition,
  Workbook,
  Worksheet,
} from 'exceljs';
import * as fs from 'file-saver-es';
import { FILETYPE, VACANCY_SCHEDULE_EXCEL } from '../models/constants';
import { SECTOR } from '../models/sector';
import {
  CONTACT_DETAILS_HEADER,
  INDUSTRIAL_HEADER,
  OFFICE_HEADER,
  PARKING_DETAILS_HEADER,
  RETAIL_HEADER,
} from '../models/table-headers';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { stripHtml } from 'string-strip-html';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  base64Logo: any;
  borderStyle: BorderStyle = 'thick';
  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.getLogo();
  }

  exportVacancyScheduleExcel(excelConfig: {
    title: string;
    data: any[];
    description: string;
  }) {
    let date = new Date();
    let htmlContentColumns: string[] = [
      'CommentDisclaimers',
      'CommentDisclaimers',
      'TenentAllowance',
    ];
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('SUMMARY');
    worksheet.views = [{ showGridLines: false }];
    const redefineLogo = workbook.addImage({
      base64: this.base64Logo,
      extension: 'png',
    });

    let col = worksheet.getColumn(2);
    col.width = 120;

    let logoCell = worksheet.getCell('B1');
    worksheet.addImage(redefineLogo, {
      tl: { col: 1, row: 1.5 },
      ext: { width: 240, height: 60 },
    });
    logoCell.style = {
      alignment: {
        horizontal: 'center',
      },
    };

    let headingCell = worksheet.getCell('B6');
    worksheet.getRow(+headingCell.row).height = 40;
    headingCell.value = `VACANCY SCHEDULE - ${this.datePipe
      .transform(date, 'dd-MM-yyyy')
      ?.toUpperCase()}`;
    headingCell.style = {
      font: {
        size: 15,
        bold: true,
      },
      alignment: {
        vertical: 'middle',
        // horizontal: 'center',
      },
    };
    let descCell = worksheet.getCell('B7');
    // worksheet.getRow(+descCell.row).height = 50;
    descCell.value = excelConfig.description ? excelConfig.description : '';
    descCell.style = {
      alignment: {
        wrapText: true,
      },
    };

    let listHeading = worksheet.getCell('B8');
    worksheet.getRow(+listHeading.row).height = 50;
    listHeading.value = {
      richText: [
        { text: 'BUILDING NODE NAVIGATION:', font: { bold: true, size: 12 } },
        {
          text: '\nClick on the node below and it will navigate you straight to the buildings that fall within the area',
          font: { size: 11, italic: true },
        },
      ],
    };
    listHeading.style = {
      alignment: {
        vertical: 'middle',
        wrapText: true,
      },
    };

    excelConfig.data.forEach((data: any, index: number) => {
      let city = data.name.toUpperCase();
      let cells = `B${+listHeading.row + 1 + index}`;
      worksheet.mergeCells(cells);
      let cityCell = worksheet.getCell(cells);
      worksheet.getRow(+cityCell.row).height = 20;
      cityCell.value = {
        text: city,
        hyperlink: `#'${city}'!A1`,
      };
      cityCell.style = {
        font: {
          color: { argb: 'aa0015' },
        },
        alignment: {
          vertical: 'middle',
        },
      };
    });
    excelConfig.data.forEach((data: any) => {
      let worksheet = workbook.addWorksheet(data.name.toUpperCase());
      // Sector Loop
      data.sector.forEach((sector: any) => {
        let sectorType = sector.name;
        let headers = this.getSectorBasedHeaders(sectorType) || [];
        let sectorColor = this.getSectorColor(sectorType);
        let sectorRow = worksheet.addRow([sectorType]);
        sectorRow.height = 30;
        worksheet.mergeCells(
          sectorRow.number,
          1,
          sectorRow.number,
          headers ? headers.length : 1
        );
        sectorRow.getCell(1).style = {
          font: {
            color: { argb: 'ffffff' },
            bold: true,
            size: 15,
          },
          alignment: {
            horizontal: 'center',
            vertical: 'middle',
          },
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: sectorColor },
          },
        };
        worksheet.addRow([]);
        // Property Units Loop
        sector.properties.forEach((property: any, index: number) => {
          // if (index) {
          //   let separatorRow = worksheet.addRow([]);
          //   worksheet.mergeCells(
          //     separatorRow.number,
          //     1,
          //     separatorRow.number,
          //     headers ? headers.length : 1
          //   );
          //   separatorRow.height = 2;
          //   separatorRow.getCell(1).style = {
          //     fill: {
          //       type: 'pattern',
          //       pattern: 'solid',
          //       fgColor: { argb: 'aa0015' },
          //     },
          //   };
          //   worksheet.addRow([]);
          // }
          let propertyNameRow = worksheet.addRow([
            // `${index + 1})`,
            `${property.name}`,
          ]);
          worksheet.mergeCells(
            propertyNameRow.number,
            1,
            propertyNameRow.number,
            headers ? headers.length : 1
          );
          propertyNameRow.height = 30;
          propertyNameRow.eachCell((cell: Cell, colNumber: number) => {
            cell.style = {
              font: {
                color: { argb: sectorColor },
                bold: true,
                size: 20,
              },
              alignment: {
                vertical: 'middle',
                // horizontal: colNumber === 1 ? 'center' : undefined,
              },
            };
          });

          // Parking Details
          worksheet.mergeCells([
            propertyNameRow.number + 2, // +2 because we are skipping one row after Property name
            0,
            propertyNameRow.number + 2,
            2,
          ]);
          let parkingDetailsCell = worksheet.getCell(
            propertyNameRow.number + 2,
            1
          );
          parkingDetailsCell.value = VACANCY_SCHEDULE_EXCEL.PARKING_DETAILS;
          parkingDetailsCell.style = {
            font: {
              color: { argb: 'ffffff' },
              bold: true,
            },
            alignment: {
              shrinkToFit: false,
              wrapText: false,
              vertical: 'middle',
              horizontal: 'center',
            },
            fill: {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: sectorColor },
            },
          };

          Object.entries(PARKING_DETAILS_HEADER).forEach(
            (d: any, index: number) => {
              let keyCell = worksheet.getCell(
                parkingDetailsCell.row + 1 + index,
                parkingDetailsCell.col
              );
              keyCell.style = {
                alignment: {
                  horizontal: 'left',
                  wrapText: true,
                },
              };
              let valueCell = worksheet.getCell(
                parkingDetailsCell.row + 1 + index,
                parkingDetailsCell.col + 1
              );
              keyCell.value = d[1];
              valueCell.value =
                property.details[d[0]] != null &&
                property.details[d[0]] != undefined &&
                property.details[d[0]] != ''
                  ? property.details[d[0]]
                  : '0.0';
              // valueCell.value = this.formatCellValue(valueCell);
              valueCell.style = {
                alignment: {
                  horizontal: 'left',
                },
              };
            }
          );

          this.createOuterBorder(
            worksheet,
            [+parkingDetailsCell.col, +parkingDetailsCell.row],
            [
              +parkingDetailsCell.col + 1,
              +parkingDetailsCell.row +
                Object.entries(PARKING_DETAILS_HEADER).length,
            ],
            {
              style: this.borderStyle,
              color: { argb: sectorColor },
            }
          );
          // Other Features and Charges
          worksheet.mergeCells(
            +parkingDetailsCell.row,
            +parkingDetailsCell.col + 4,
            +parkingDetailsCell.row,
            +parkingDetailsCell.col + 3
          );
          let featureCell = worksheet.getCell(
            parkingDetailsCell.row,
            parkingDetailsCell.col + 3
          );

          featureCell.style = {
            alignment: {
              horizontal: 'left',
            },
          };

          if (property.featuresamenities.length > 0) {
            featureCell.value = VACANCY_SCHEDULE_EXCEL.FEATURE_AND_CHARGES;
            featureCell.style = {
              font: {
                color: { argb: 'ffffff' },
                bold: true,
              },
              alignment: {
                shrinkToFit: false,
                wrapText: false,
                vertical: 'middle',
                horizontal: 'center',
              },
              fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: sectorColor },
              },
            };
            [...property.featuresamenities].forEach((d: any, index: number) => {
              let keyCell = worksheet.getCell(
                featureCell.row + 1 + index,
                featureCell.col
              );
              keyCell.style = {
                alignment: {
                  horizontal: 'left',
                },
              };
              let valueCell = worksheet.getCell(
                featureCell.row + 1 + index,
                featureCell.col + 1
              );

              keyCell.value = d.Title;
              valueCell.value = d.Value;
              valueCell.style = {
                alignment: {
                  horizontal: 'left',
                  wrapText: true,
                },
              };
            });

            this.createOuterBorder(
              worksheet,
              [+featureCell.col, +featureCell.row],
              [
                +featureCell.col + 1,
                +featureCell.row + [...property.featuresamenities].length,
              ],
              {
                style: this.borderStyle,
                color: { argb: sectorColor },
              }
            );
          }

          let contactDetailsHeaderStartCell = worksheet.getCell(
            featureCell.row,
            featureCell.col + 3
          );

          // Contact Details
          Object.entries(CONTACT_DETAILS_HEADER).forEach(
            (d: any, index: number) => {
              let headerCell = worksheet.getCell(
                featureCell.row,
                featureCell.col + 3 + index
              );
              headerCell.value = d[1];
              headerCell.style = {
                font: {
                  color: { argb: 'ffffff' },
                  bold: true,
                },
                alignment: {
                  shrinkToFit: false,
                  wrapText: false,
                  vertical: 'middle',
                  horizontal: 'center',
                },
                fill: {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: sectorColor },
                },
              };
              [...property.contactDetails].forEach(
                (contact: any, index: number) => {
                  let valueCell = worksheet.getCell(
                    headerCell.row + 1 + index,
                    headerCell.col
                  );
                  valueCell.value = contact[d[0]];
                  // valueCell.value = this.formatCellValue(valueCell);
                  valueCell.style = {
                    alignment: {
                      horizontal: 'left',
                    },
                  };
                }
              );
            }
          );
          this.createOuterBorder(
            worksheet,
            [
              +contactDetailsHeaderStartCell.col,
              +contactDetailsHeaderStartCell.row,
            ],
            [
              +contactDetailsHeaderStartCell.col +
                Object.entries(CONTACT_DETAILS_HEADER).length -
                1,
              +contactDetailsHeaderStartCell.row +
                [...property.contactDetails].length,
            ],
            {
              style: this.borderStyle,
              color: { argb: sectorColor },
            }
          );

          worksheet.addRow([]);
          // Unit details
          let headerRow = worksheet.addRow(headers);
          let unitTableCellStart = headerRow.getCell(1);
          headerRow.height = 20;
          headerRow.eachCell((cell: Cell, colNumber: number) => {
            worksheet.getColumn(colNumber).width = 25;
            cell.style = {
              font: {
                color: { argb: 'ffffff' },
                bold: true,
              },
              alignment: {
                shrinkToFit: false,
                wrapText: false,
                vertical: 'middle',
                horizontal: 'center',
              },
              fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: sectorColor },
              },
            };
          });

          property.units.forEach((unit: any) => {
            htmlContentColumns.forEach((data: string) => {
              unit = {
                ...unit,
                [data]: stripHtml(unit[data] ? unit[data] : '').result,
              };
            });
            let dataRow = worksheet.addRow(Object.values(unit));
            dataRow.eachCell((cell: Cell, colNumber: number) => {
              cell.style = {
                alignment: {
                  wrapText: false,
                  horizontal: 'left',
                },
              };
            });
          });
          this.createOuterBorder(
            worksheet,
            [+unitTableCellStart.col, +unitTableCellStart.row],
            [
              +unitTableCellStart.col + Object.keys(headers).length - 1,
              +unitTableCellStart.row + [...property.units].length,
            ],
            {
              style: this.borderStyle,
              color: { argb: sectorColor },
            }
          );
          worksheet.addRow([]);
        });
        worksheet.addRow([]);
      });
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: FILETYPE.EXCEL_SPREADSHEET,
      });
      fs.saveAs(blob, excelConfig.title + '.xlsx');
    });
  }
  createOuterBorder = (
    worksheet: Worksheet,
    [startCol, startRow]: [number, number],
    [endCol, endRow]: [number, number],
    border: Border = { style: 'medium', color: { argb: '000' } }
  ) => {
    for (let i = startRow; i <= endRow; i++) {
      const leftBorderCell = worksheet.getCell(i, startCol);
      const rightBorderCell = worksheet.getCell(i, endCol);

      leftBorderCell.border = {
        ...leftBorderCell.border,
        left: border,
      };

      rightBorderCell.border = {
        ...rightBorderCell.border,
        right: border,
      };
    }

    for (let i = startCol; i <= endCol; i++) {
      const topBorderCell = worksheet.getCell(startRow, i);
      const bottomBorderCell = worksheet.getCell(endRow, i);

      topBorderCell.border = {
        ...topBorderCell.border,
        top: border,
      };

      bottomBorderCell.border = {
        ...bottomBorderCell.border,
        bottom: border,
      };
    }
  };
  getSectorColor(sector: string) {
    switch (sector.toUpperCase()) {
      case SECTOR.OFFICE.toUpperCase():
      case SECTOR.COMMERCIAL.toUpperCase():
        return '017D67';
      case SECTOR.INDUSTRIAL.toUpperCase():
        return '5C676D';
      case SECTOR.RETAIL.toUpperCase():
        return '004B6A';
      case SECTOR.SPECIALISED.toUpperCase():
        return '555d8b';
      default:
        return 'aa0015';
    }
  }

  getSectorBasedHeaders(sector: string) {
    switch (sector.toUpperCase()) {
      case SECTOR.OFFICE.toUpperCase():
      case SECTOR.COMMERCIAL.toUpperCase():
      case SECTOR.SPECIALISED.toUpperCase():
        return Object.values(OFFICE_HEADER);
      case SECTOR.INDUSTRIAL.toUpperCase():
        return Object.values(INDUSTRIAL_HEADER);
      case SECTOR.RETAIL.toUpperCase():
        return Object.values(RETAIL_HEADER);
      default:
        return null;
    }
  }
  getRowData(data: any, sector: string) {
    switch (sector) {
      case SECTOR.OFFICE:
      case SECTOR.COMMERCIAL:
        return data;
      case SECTOR.INDUSTRIAL:
        return data;
      case SECTOR.RETAIL:
        return data;
      default:
        return data;
    }
  }
  getLogo() {
    this.http
      .get('/assets/images/Logo.png', { responseType: 'blob' })
      .subscribe((res) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.base64Logo = reader.result;
        };
        reader.readAsDataURL(res);
      });
  }
  addImage(
    imageId: number,
    range:
      | string
      | ({ editAs?: string } & ImagePosition & {
            hyperlinks?: ImageHyperlinkValue;
          })
  ) {}
}
