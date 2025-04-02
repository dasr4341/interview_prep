import ExcelJs from 'exceljs';
import saveAs from 'file-saver';

type TFontTypes = 'title' | 'sub_title' | 'table_header' | 'normal';

interface IMetaTableColumn {
  /**
   * Must pass and argb HEX code like `FFFFD7D7`
   *
   * @link https://stackoverflow.com/questions/23201134/transparent-argb-hex-value
   */
  background: string;
}
interface ICustomColumns extends ExcelJs.TableColumnProperties {
  meta?: IMetaTableColumn;
}

interface IColumnBackgroundMeta {
  colIndex: number;
  color: string;
}

interface IHeaderSecondaryRow {
  label: string;
  value: string;
}

class ExcelBuilder {
  private workbook: ExcelJs.Workbook;

  private worksheet: ExcelJs.Worksheet;

  private currentRowPosition: number;

  private currentColumnPosition: string;

  // TODO -  We can better handle all these constants.
  private readonly INITIAL_COLUMN_POSITION = 'B';

  private readonly INITIAL_ROW_POSITION = 1;

  private readonly SPACE_ROWS = 3;

  private readonly DEFAULT_FONT_PROPS: Partial<ExcelJs.Font> = {
    name: 'Arial',
    family: 1,
  };

  private readonly TITLE_FONT_SIZE = 18;

  private readonly SUB_TITLE_FONT_SIZE = 12;

  private readonly TABLE_HEADER_FONT_SIZE = 11;

  private readonly NORMAL_FONT_SIZE = 10;

  constructor() {
    this.reset();
  }

  private reset(): void {
    this.workbook = new ExcelJs.Workbook();
    this.currentColumnPosition = this.INITIAL_COLUMN_POSITION;
    this.currentRowPosition = this.INITIAL_ROW_POSITION;
  }

  private getCurrentCell(): string {
    return `${this.currentColumnPosition}${this.currentRowPosition}`;
  }

  private getFontProps(type: TFontTypes): Partial<ExcelJs.Font> {
    const fontProps = { ...this.DEFAULT_FONT_PROPS };

    switch (type) {
      case 'title':
        fontProps.size = this.TITLE_FONT_SIZE;
        fontProps.bold = true;
        break;

      case 'sub_title':
        fontProps.size = this.SUB_TITLE_FONT_SIZE;
        fontProps.bold = true;
        break;

      case 'table_header':
        fontProps.size = this.TABLE_HEADER_FONT_SIZE;
        fontProps.bold = true;
        break;

      case 'normal':
        fontProps.size = this.NORMAL_FONT_SIZE;
        break;

      default:
        fontProps.size = this.NORMAL_FONT_SIZE;
        break;
    }

    return fontProps;
  }

  /**
   * Equivalent to new line.
   * It'll move current row to specified `rowPosition` and reset column to initial column position.
   *
   * @param rowPosition {number} number of the row.
   */
  private changeRowPosition(rowPosition: number): void {
    if (rowPosition < this.currentRowPosition) {
      // TODO - make this detailed message.
      throw new Error('Can not reposition to already used positions.');
    }
    this.currentRowPosition = rowPosition;
    this.currentColumnPosition = this.INITIAL_COLUMN_POSITION;
  }

  private changeColumnPosition(columnPosition: string): void {
    if (columnPosition < this.currentColumnPosition) {
      // TODO - make this detailed message.
      throw new Error('Can not reposition to already used positions.');
    }
    this.currentColumnPosition = String.fromCharCode(columnPosition.charCodeAt(0) + 1);
  }

  private createSecondaryRowsForHeader(secondaryRow: IHeaderSecondaryRow): void {
    this.changeRowPosition(this.currentRowPosition + 1);

    const countText = this.worksheet.getCell(this.getCurrentCell());
    countText.value = secondaryRow.label;
    countText.style = {
      font: {
        ...this.getFontProps('table_header'),
      },
    };

    this.changeColumnPosition(this.currentColumnPosition + 1);

    const defaultBorderStyles: Partial<ExcelJs.Border> = {
      color: { argb: '#FF000000' },
      style: 'thin',
    };

    const countValue = this.worksheet.getCell(this.getCurrentCell());
    countValue.value = secondaryRow.value;
    countValue.style = {
      font: {
        ...this.getFontProps('normal'),
      },
      border: {
        top: { ...defaultBorderStyles },
        left: { ...defaultBorderStyles },
        bottom: { ...defaultBorderStyles },
        right: { ...defaultBorderStyles },
      },
    };

    const countRowText = this.worksheet.getRow(Number(countText.row));
    countRowText.height = 16;
  }

  /**
   * Creates a new worksheet.
   *
   * @param name name of the worksheet
   * @returns ExcelBuilder class to allow method chaining
   */
  createWorkSheet(name: string): ExcelBuilder {
    this.worksheet = this.workbook.addWorksheet(name, {
      properties: {
        defaultColWidth: 45,
      },
    });
    this.worksheet.getColumn('A').width = 5;

    return this;
  }

  /**
   * Allows changing the current worksheet (we probably won't need this).
   *
   * @param name name or index of worksheet
   */
  setWorkSheet(name: string): ExcelBuilder;
  setWorkSheet(index: number): ExcelBuilder;
  setWorkSheet(indexOrName: any): ExcelBuilder {
    this.worksheet = this.workbook.getWorksheet(indexOrName);
    return this;
  }

  /**
   * Adds header portion for a table.
   *
   * @param title title text
   * @param rowsToMerge how many cells title should merge, this is same as number of columns (length of columns)
   * @param subHeader sub header text
   * @param secondaryRows array of secondary rows to display
   * @param color this color will be applied to entire table
   * @returns ExcelBuilder class to allow method chaining
   */
  addHeader(
    title: string,
    rowsToMerge?: number,
    subHeader?: string,
    secondaryRows?: IHeaderSecondaryRow[],
    // Color must be of argb HEX value.
    color?: string
  ): ExcelBuilder {
    if (this.currentRowPosition !== this.INITIAL_ROW_POSITION) {
      this.changeRowPosition(this.currentRowPosition + this.SPACE_ROWS);
    }

    /**
     * merge next `rowsToMerge` cells for title.
     * Need to add +1 for last param as we're skipping the first column.
     *
     * @link https://github.com/exceljs/exceljs#merged-cells
     */
    if (rowsToMerge) {
      this.worksheet.mergeCells(this.currentRowPosition, 2, this.currentRowPosition, rowsToMerge + 1);
    }
    

    // Title cell construction
    const titleCell = this.worksheet.getCell(this.getCurrentCell());
    titleCell.value = title;
    titleCell.style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
      },
      font: {
        ...this.getFontProps('title'),
      },
      ...(color && {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: color,
          },
        },
      }),
    };
    const titleCellRow = this.worksheet.getRow(Number(titleCell.row));
    titleCellRow.height = 20;

    // Add new line.
    this.changeRowPosition(this.currentRowPosition + 1);

    if (rowsToMerge !== undefined && subHeader) {
       // Subheader cell construction.
      this.worksheet.mergeCells(this.currentRowPosition, 2, this.currentRowPosition, rowsToMerge + 1);
      const subHeaderCell = this.worksheet.getCell(this.getCurrentCell());
      subHeaderCell.value = subHeader;
      subHeaderCell.style = {
        font: {
          ...this.getFontProps('sub_title'),
        },
        ...(color && {
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
              argb: color,
            },
          },
        }),
      };
      const clientCellRow = this.worksheet.getRow(Number(subHeaderCell.row));
      clientCellRow.height = 16;
    }
   
    
    

    // Add other secondary rows if provided.
    secondaryRows?.forEach((row, index) => {
      this.createSecondaryRowsForHeader(row);

      // Add new empty line for spacing for last row (so there is an empty space between next table/content).
      if (index === secondaryRows.length - 1) {
        this.changeRowPosition(this.currentRowPosition + 1);
      }
    });

    return this;
  }

  /**
   * Adds table
   *
   * @param tableName name of the table (MUST NOT include spaces)
   * @param columns columns of the table
   * @param rows rows of the table
   * @param firstColumnAsHeader if the first column should be considered as header or not (it'll make first col bold)
   * @returns ExcelBuilder to allow method chaining
   */
  addTable(tableName: string, columns: ICustomColumns[], rows: any[][], firstColumnAsHeader = false): ExcelBuilder {
    try {
      this.changeRowPosition(this.currentRowPosition + 1);

      // TODO - make this dynamic based on input data.
      this.worksheet.addTable({
        name: tableName,
        ref: this.getCurrentCell(),
        headerRow: true,
        columns,
        rows,
      });
  
      const headerRow = this.worksheet.getRow(this.currentRowPosition);
      // apply styles to header row.
      headerRow.font = {
        ...this.getFontProps('table_header'),
      };
      // Set cell's bg color if provided for column
      const colBackgroundColor: IColumnBackgroundMeta[] = [];
      columns.forEach((column, index) => {
        if (column.meta?.background) {
          colBackgroundColor.push({
            // Add 2 as we're skipping the first column in excel and in js indexing starts at 0.
            colIndex: index + 2,
            color: column.meta.background,
          });
        }
      });
      // Apply cell color to any column in header row if specified.
      headerRow.eachCell((cell) => {
        // Add color to cell if there is any specified in column.
        const currentCellBackgroundData = colBackgroundColor.find((col) => col.colIndex === Number(cell.col));
        if (currentCellBackgroundData && cell.value?.toString().trim() !== '') {
          cell.fill = {
            pattern: 'solid',
            type: 'pattern',
            fgColor: {
              argb: currentCellBackgroundData.color,
            },
          };
        }
      });
  
      // Default border styles of black color and think border.
      const defaultBorderStyles: Partial<ExcelJs.Border> = {
        color: { argb: 'FF000000' },
        style: 'thin',
      };
  
      // apply styles to remaining rows of table.
      this.worksheet.getRows(this.currentRowPosition + 1, rows.length + 1)?.forEach((row) => {
        row.eachCell((cell) => {
          // Add color to cell if there is any specified in column.
          const currentCellBackgroundData = colBackgroundColor.find((col) => col.colIndex === Number(cell.col));
          if (currentCellBackgroundData) {
            cell.fill = {
              pattern: 'solid',
              type: 'pattern',
              fgColor: {
                argb: currentCellBackgroundData.color,
              },
            };
          }
  
          // If fist column is considered as header we don't want to apply border hence these conditions.
          if (firstColumnAsHeader) {
            // This checks if the current cell we're iterating over is in the first column.
            if (Number(cell.col) > this.INITIAL_COLUMN_POSITION.charCodeAt(0) - 65 + 1) {
              cell.border = {
                top: { ...defaultBorderStyles },
                left: { ...defaultBorderStyles },
                bottom: { ...defaultBorderStyles },
                right: { ...defaultBorderStyles },
              };
              cell.font = {
                ...this.getFontProps('normal'),
              };
  
              // Else if the current cell is in first column we want to make them as table header (apply styles).
            } else if (Number(cell.col) === this.INITIAL_COLUMN_POSITION.charCodeAt(0) - 65 + 1) {
              cell.font = {
                ...this.getFontProps('table_header'),
              };
            }
  
            // if this table doesn't consider first column as header we want to apply border to all content cells.
          } else {
            cell.border = {
              top: { ...defaultBorderStyles },
              left: { ...defaultBorderStyles },
              bottom: { ...defaultBorderStyles },
              right: { ...defaultBorderStyles },
            };
            cell.font = {
              ...this.getFontProps('normal'),
            };
          }
        });
      });
  
      // Move current row position to after the table. // +1 to add an extra empty row at the end.
      this.changeRowPosition(this.currentRowPosition + rows.length + 1);
    } catch (e) {
      console.log(e);
    }
    return this;
  }

  async exportExcel(fileName: string): Promise<void> {
    // ! Enable wrap text for all cells except for those which are merged (to make sure we don't override for headers).
    // ! this is dangerous because this will override any existing alignments for the cell.
    this.worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        if (!cell.isMerged) {
          cell.alignment = {
            wrapText: true,
          };
        }
      });
    });

    const buffer = await this.workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // File name
    saveAs(blob, fileName);
  }
}

export default ExcelBuilder;
