import { FormFieldState } from '@primevue/forms'
import { PrimeVueLocaleOptions } from 'primevue/config'
import { ZodErrorMap, ZodIssueCode } from 'zod'

interface ISelectOption {
    label: string
    value: string
}

/**
 * Converts an object with string values into an array of SelectOption objects.
 *
 * @param obj - The object to be converted, where each key-value pair represents a select option.
 * @returns An array of SelectOption objects, each containing a label and value derived from the object's values.
 */
export const getObjectAsSelectOptions = (obj: {
    [key: string]: string
}): ISelectOption[] => {
    return Object.values(obj).map((value) => ({
        label: value,
        value: value,
    }))
}

/**
 * Converts a record of form field states to a specified type.
 *
 * @template T - The type to which the form state should be converted.
 * @param {Record<string, FormFieldState>} states - A record of form field states.
 * @returns {T} - The form state converted to the specified type.
 */
export const getFormStatesAsType = <T>(
    states: Record<string, FormFieldState>
): T => {
    const result: any = {}

    Object.entries(states).forEach(([key, state]) => {
        const keys = key.split('.')
        let current = result

        keys.forEach((k, index) => {
            if (index === keys.length - 1) {
                current[k] = state.value // Assign final value
            } else {
                current[k] = current[k] || {} // Ensure nested object exists
                current = current[k]
            }
        })
    })

    return result as T
}

/**
 * Returns the localized configuration options for PrimeVue components in German.
 *
 * @returns {PrimeVueLocaleOptions} The localized configuration options.
 */
export const getPrimeVueLocalized = (): PrimeVueLocaleOptions => {
    return {
        startsWith: 'Beginnt mit',
        contains: 'Enthält',
        notContains: 'Nicht enthalten',
        endsWith: 'Endet mit',
        equals: 'Gleich',
        notEquals: 'Nicht gleich',
        noFilter: 'Kein Filter',
        lt: 'Weniger als',
        lte: 'Weniger oder gleich',
        gt: 'Größer als',
        gte: 'Größer oder gleich',
        dateIs: 'Datum ist',
        dateIsNot: 'Datum ist nicht',
        dateBefore: 'Datum ist vor',
        dateAfter: 'Datum ist nach',
        clear: 'Löschen',
        apply: 'Anwenden',
        matchAll: 'Alle zutreffen',
        matchAny: 'Beliebige zutreffen',
        addRule: 'Regel hinzufügen',
        removeRule: 'Regel entfernen',
        accept: 'Ja',
        reject: 'Nein',
        choose: 'Wählen',
        upload: 'Hochladen',
        cancel: 'Abbrechen',
        completed: 'Abgeschlossen',
        pending: 'Ausstehend',
        fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        dayNames: [
            'Sonntag',
            'Montag',
            'Dienstag',
            'Mittwoch',
            'Donnerstag',
            'Freitag',
            'Samstag',
        ],
        dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        monthNames: [
            'Januar',
            'Februar',
            'März',
            'April',
            'Mai',
            'Juni',
            'Juli',
            'August',
            'September',
            'Oktober',
            'November',
            'Dezember',
        ],
        monthNamesShort: [
            'Jan',
            'Feb',
            'Mär',
            'Apr',
            'Mai',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Okt',
            'Nov',
            'Dez',
        ],
        chooseYear: 'Jahr wählen',
        chooseMonth: 'Monat wählen',
        chooseDate: 'Datum wählen',
        prevDecade: 'Vorheriges Jahrzehnt',
        nextDecade: 'Nächstes Jahrzehnt',
        prevYear: 'Vorheriges Jahr',
        nextYear: 'Nächstes Jahr',
        prevMonth: 'Vorheriger Monat',
        nextMonth: 'Nächster Monat',
        prevHour: 'Vorherige Stunde',
        nextHour: 'Nächste Stunde',
        prevMinute: 'Vorherige Minute',
        nextMinute: 'Nächste Minute',
        prevSecond: 'Vorherige Sekunde',
        nextSecond: 'Nächste Sekunde',
        am: 'vorm.',
        pm: 'nachm.',
        today: 'Heute',
        weekHeader: 'KW',
        firstDayOfWeek: 0,
        showMonthAfterYear: false,
        dateFormat: 'tt.mm.jj',
        weak: 'Schwach',
        medium: 'Mittel',
        strong: 'Stark',
        passwordPrompt: 'Passwort eingeben',
        searchMessage: '{0} Ergebnisse verfügbar',
        selectionMessage: '{0} Elemente ausgewählt',
        emptySelectionMessage: 'Keine Elemente ausgewählt',
        emptySearchMessage: 'Keine Ergebnisse gefunden',
        fileChosenMessage: '{0} Dateien',
        noFileChosenMessage: 'Keine Datei gewählt',
        emptyMessage: 'Keine Optionen verfügbar',
        aria: {
            trueLabel: 'Wahr',
            falseLabel: 'Falsch',
            nullLabel: 'Nicht ausgewählt',
            star: '1 Stern',
            stars: '{star} Sterne',
            selectAll: 'Alle Elemente ausgewählt',
            unselectAll: 'Alle Elemente abgewählt',
            close: 'Schließen',
            previous: 'Vorherige',
            next: 'Nächste',
            navigation: 'Navigation',
            scrollTop: 'Nach oben scrollen',
            moveTop: 'Nach oben bewegen',
            moveUp: 'Nach oben verschieben',
            moveDown: 'Nach unten verschieben',
            moveBottom: 'Nach unten bewegen',
            moveToTarget: 'Zum Ziel bewegen',
            moveToSource: 'Zur Quelle bewegen',
            moveAllToTarget: 'Alles zum Ziel bewegen',
            moveAllToSource: 'Alles zur Quelle bewegen',
            pageLabel: 'Seite {page}',
            firstPageLabel: 'Erste Seite',
            lastPageLabel: 'Letzte Seite',
            nextPageLabel: 'Nächste Seite',
            prevPageLabel: 'Vorherige Seite',
            rowsPerPageLabel: 'Zeilen pro Seite',
            jumpToPageDropdownLabel: 'Zu Seite Dropdown springen',
            jumpToPageInputLabel: 'Zu Seite Eingabe springen',
            selectRow: 'Zeile ausgewählt',
            unselectRow: 'Zeile abgewählt',
            expandRow: 'Zeile erweitert',
            collapseRow: 'Zeile minimiert',
            showFilterMenu: 'Filtermenü anzeigen',
            hideFilterMenu: 'Filtermenü ausblenden',
            filterOperator: 'Filteroperator',
            filterConstraint: 'Filtereinschränkung',
            editRow: 'Zeile bearbeiten',
            saveEdit: 'Bearbeitung speichern',
            cancelEdit: 'Bearbeitung abbrechen',
            listView: 'Listenansicht',
            gridView: 'Rasteransicht',
            slide: 'Folie',
            slideNumber: '{slideNumber}',
            zoomImage: 'Bild vergrößern',
            zoomIn: 'Hineinzoomen',
            zoomOut: 'Herauszoomen',
            rotateRight: 'Nach rechts drehen',
            rotateLeft: 'Nach links drehen',
        },
    }
}

/**
 * Custom validation error map for Zod schema validation.
 *
 * This function provides custom error messages for validation issues
 * related to string length constraints.
 *
 * @param issue - The validation issue encountered.
 * @param ctx - The validation context, which includes the default error message.
 * @returns An object containing a custom error message based on the validation issue.
 *
 */
export const getCustomValidationErrorMap: ZodErrorMap = (issue, ctx) => {
    if (issue.code === ZodIssueCode.too_small) {
        switch (issue.type) {
            case 'string':
                return {
                    message: `Mindestens ${issue.minimum} Zeichen erforderlich.`,
                }
        }
    }
    if (issue.code === ZodIssueCode.too_big) {
        switch (issue.type) {
            case 'string':
                return {
                    message: `Maximal ${issue.maximum} Zeichen erlaubt.`,
                }
        }
    }

    return { message: ctx.defaultError }
}
