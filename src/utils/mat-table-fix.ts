import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { BehaviorSubject, Subscription } from 'rxjs'

interface MatTableFixConstructorArg {

  readonly paginator: MatPaginator

  readonly dataSource: MatTableDataSource<unknown>

  readonly paginatorLabels?: PaginatorLabels

}

type PaginatorLabels = Partial<Omit<MatPaginatorIntl, 'changes'>>

/**
 * Clase creada para poder corregir el problema  
 * de la altura variable del componente MatTable según su contenido.
 * 
 * La idea es llenar la tabla de elementos irrelevantes  
 * que podamos distinguir de manera fiable para su correcto manejo  
 * consiguiendo que la tabla mantenga una altura consistente según  
 * el tamaño de página especificado.
 * 
 * Para ocultar las filas vacías hay que añadirles el atributo `data-empty-row`
 * de la siguiente forma:
 * ```html
 * <tr
 *   mat-row
 *   *matRowDef="let rowItem; columns: displayedColumns"
 *   [style.visibility]="rowItem === matTableFix.emptyRowSymbol ? 'hidden' : 'visible'"
 * >
 * </tr>
 * ```
 * 
 * Para aplicar el ajuste a MatTable basta con hacer lo siguiente:
 * ```ts
 * class MyComponent implements AfterViewInit {
 *
 *   matTableFix: MatTableFix
 *
 *   \@ViewChild(MatPaginator)
 *   readonly paginator: MatPaginator
 *
 *   readonly dataSource: MatTableDataSource<MyData> = new MatTableDataSource()
 *
 *   // Some data to fill the table
 *   data: MyData[] = []
 * 
 *   ngAfterViewInit() {
 *     window.setTimeout(() => this.init(), 0)
 *   }
 *
 *   async init() {
 *     this.dataSource.paginator = this.paginator
 *     this.dataSource.sort = this.sort
 *
 *     this.matTableFix = new MatTableFix({
 *       paginator: this.paginator,
 *       dataSource: this.dataSource,
 *
 *       // Opcional
 *       paginatorLabels: {
 *         itemsPerPageLabel: 'Registros por página',
 *         firstPageLabel: 'Primera Página',
 *         lastPageLabel: 'Última Página',
 *         nextPageLabel: 'Siguiente Página',
 *         previousPageLabel: 'Anterior Página',
 *
 *         getRangeLabel: (page: number, pageSize: number, length: number) => {
 *           const from = Math.min(pageSize * page + 1, length)
 *           const to = Math.min(pageSize * page + pageSize, length)
 *
 *           return `${from} - ${to} de ${length}`
 *         },
 *       },
 *     })
 *
 *     this.dataSource.data = this.data
 *   }
 * 
 * }
 * ```
 */
export default class MatTableFix {

  constructor(options: MatTableFixConstructorArg) {
    this.#dataSource = options.dataSource
    this.#paginatorLabels = options.paginatorLabels
    this.#paginator = options.paginator

    this.#init()
  }

  readonly #paginator: MatPaginator

  readonly #dataSource: MatTableDataSource<any>

  readonly #paginatorLabels?: PaginatorLabels

  #lastPageSize = -1

  #init() {
    this.#setPaginatorLabels()

    this.#setDataSourceFilter()

    this.#setDataSourceSort()

    this.#addPageChangeSubscription()

    this.#addFilterChangeSubscription()

    this.#addDataChangeSubscription()
  }

  #addPageChangeSubscription() {
    // Ajustar las filas de relleno cuando se actualiza el tamaño del paginado
    this.#paginator.page.subscribe({
      next: (event?: PageEvent) => {
        if (this.#lastPageSize === this.#paginator.pageSize) {
          return
        }

        this.#fillDataSourceWithEmptyDataToKeepConsistentPageSize()

        this.#lastPageSize = this.#paginator.pageSize
      },
    })

    // Forzar evento para que se ejecute al inicio
    this.#paginator.page.emit()
  }

  #changeSubscriber: Subscription | null =  null

  #isInternalDataSourceAssignment = false

  #addDataChangeSubscription() {
    this.#changeSubscriber = (this.#dataSource['_data'] as BehaviorSubject<unknown[]>).subscribe({
      next: data => {
        if (this.#isInternalDataSourceAssignment) {
          return
        }

        if (!this.#changeSubscriber) {
          return
        }

        // Como los datos son reasignados en esta función para evitar
        // recursión hay que primero desuscribirse y volverse a suscribir después
        this.#fillDataSourceWithEmptyDataToKeepConsistentPageSize(data)
      },
    })
  }

  #addFilterChangeSubscription() {
    return (this.#dataSource['_filter'] as BehaviorSubject<string>).subscribe({
      next: filterValue => {
        // Ajustar las filas vacías añadidas al filtrar
        this.#fillDataSourceWithEmptyDataToKeepConsistentPageSize()
      },
    })
  }

  #setPaginatorLabels() {
    const original_getRangeLabel = this.#paginator._intl.getRangeLabel

    // Asignar texto propio a las etiquetas de `<mat-paginator>`
    Object.assign(this.#paginator._intl, <PaginatorLabels>{
      ...this.#paginatorLabels,

      getRangeLabel: (page: number, pageSize: number, length: number) => {
        // Calcular tamaño real de la tabla ignorando los `symbols`
        // creados para mantener una altura consistente en la tabla.
        const realLength: number = this.#dataSource.filteredData.reduce((acc, prev) => prev !== this.emptyRowSymbol ? acc + 1 : acc, 0)

        return this.#paginatorLabels?.getRangeLabel?.(page, pageSize, realLength) ?? original_getRangeLabel(page, pageSize, realLength)
      }
    })
  }

  /**
   * `symbol` que se usa para llenar el array de filas de la tabla en la función {@link #fillDataSourceWithEmptyDataToKeepConsistentPageSize}  
   * para poder mantener una altura consistente y calcular el tamaño real de la tabla.
   */
  readonly emptyRowSymbol = Symbol('empty row')

  #originalData: unknown[] = []

  /**
   * Llenar de `symbols` el final del array de filas de la tabla para mantener
   * una altura consistente para así mantener una buena experiencia de usuario.
   */
  #fillDataSourceWithEmptyDataToKeepConsistentPageSize(newData?: unknown[]) {
    if (newData) {
      this.#originalData = newData
    }

    let totalEmptyRowsLength = this.#paginator.pageSize - (this.#originalData.length % this.#paginator.pageSize)

    if (this.#originalData.length !== 0 && this.#paginator.pageSize === totalEmptyRowsLength) {
      totalEmptyRowsLength = 0
    }

    let emptyRowsLength: number

    if (newData) {
      emptyRowsLength = totalEmptyRowsLength
    }
    else {
      const filteredDataLength = this.#dataSource.filteredData.reduce((acc: number, prev) => {
        if (prev === this.emptyRowSymbol) {
          return acc
        }

        return acc + 1
      }, 0)

      emptyRowsLength = this.#paginator.pageSize - (filteredDataLength % this.#paginator.pageSize)
    }

    this.#isInternalDataSourceAssignment = true

    this.#dataSource.data = [
      ...this.#originalData,
      ...Array.from(
        {length: emptyRowsLength},
        () => this.emptyRowSymbol,
      ),
    ]

    this.#isInternalDataSourceAssignment = false

    const filteredTableRowsLength = this.#dataSource.filteredData.length % this.#paginator.pageSize

    if (filteredTableRowsLength !== 0) {
      const extraEmptyRowsLength = this.#paginator.pageSize - filteredTableRowsLength

      this.#isInternalDataSourceAssignment = true

      this.#dataSource.data = [
        ...this.#originalData,
        ...Array.from(
          {length: emptyRowsLength},
          () => this.emptyRowSymbol,
        ),
        ...Array.from(
          {length: extraEmptyRowsLength},
          () => this.emptyRowSymbol,
        ),
      ]

      this.#isInternalDataSourceAssignment = false
    }

  }

  #setDataSourceFilter() {
    this.#dataSource.filterPredicate = (data, filter) => {
      // Mantener `symbols` de fila vacía en los datos filtrados
      // para poder mantener la altura de la tabla al aplicar un filtro
      //@ts-ignore
      if (data === this.emptyRowSymbol) {
        return true
      }

      // Código perteneciente a la function por defecto de `dataSource.filterPredicate()`

      // Transform the data into a lowercase string of all property values.
      const dataStr = Object.keys(data)
        .reduce((currentTerm, key) => {
            // Use an obscure Unicode character to delimit the words in the concatenated string.
            // This avoids matches where the values of two columns combined will match the user's query
            // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
            // that has a very low chance of being typed in by somebody in a text field. This one in
            // particular is "White up-pointing triangle with dot" from
            // https://en.wikipedia.org/wiki/List_of_Unicode_characters
            return currentTerm + data[key] + '◬'
        }, '')
        .toLowerCase();

      // Transform the filter by converting it to lowercase and removing whitespace.
      const transformedFilter = filter.trim().toLowerCase()
      return dataStr.indexOf(transformedFilter) !== -1
    }
  }

  #setDataSourceSort() {
    this.#dataSource.sortData = (data, sort) => {
      const active = sort.active;
      const direction = sort.direction;

      if (!active || direction == '') {
        return data;
      }

      return data.sort((a, b) => {
        // Mantener `symbols` al final de la tabla al ordenar los datos

        //@ts-ignore
        if (a === this.emptyRowSymbol) {
          return 1
        }

        //@ts-ignore
        if (b === this.emptyRowSymbol) {
          return -1
        }

        // Código perteneciente a la function por defecto de `dataSource.sortData()`

        let valueA = this.#dataSource.sortingDataAccessor(a, active);
        let valueB = this.#dataSource.sortingDataAccessor(b, active);

        // If there are data in the column that can be converted to a number,
        // it must be ensured that the rest of the data
        // is of the same type so as not to order incorrectly.
        const valueAType = typeof valueA;
        const valueBType = typeof valueB;
        if (valueAType !== valueBType) {
            if (valueAType === 'number') {
              valueA += '';
            }
            if (valueBType === 'number') {
              valueB += '';
            }
        }

        // If both valueA and valueB exist (truthy), then compare the two. Otherwise, check if
        // one value exists while the other doesn't. In this case, existing value should come last.
        // This avoids inconsistent results when comparing values to undefined/null.
        // If neither value exists, return 0 (equal).
        let comparatorResult = 0;
        if (valueA != null && valueB != null) {
          // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
          if (valueA > valueB) {
            comparatorResult = 1;
          }
          else if (valueA < valueB) {
            comparatorResult = -1;
          }
        }
        else if (valueA != null) {
          comparatorResult = 1;
        }
        else if (valueB != null) {
          comparatorResult = -1;
        }

        return comparatorResult * (direction === 'asc' ? 1 : -1);
      });
    }
  }

}
