import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AutocompleteComponent),
            multi: true
        }
    ],
    selector: 'app-autocomplete',
    styleUrls: ['./autocomplete.component.css'],
    templateUrl: './autocomplete.component.html',
})
export class AutocompleteComponent implements ControlValueAccessor {

    data: string[] = [
        'The Commuter',
        'Avengers: Infinity War',
        '12 Strong',
        'Black Panther',
        'Insidious: The Last Key',
        'Den of Thieves',
        'Proud Mary',
        'Red Sparrow',
        'Tomb Raider',
        'Solo: A Star Wars Story',
        'Venom',
    ];
    matches: string[] = [];
    value: string;

    constructor() {
        console.log('AutocompleteComponent:constructor');
    }

    getMatches(value: any): string[] {
        // load items for autocomplete
        if (value == null || value === '') {
            return [];
        }
        value = value.toLowerCase();
        return this.data.filter(v => v.toLowerCase().match(value));
    }

    ngOnInit() {
        console.log('AutocompleteComponent:onInit');
    }

    onChange = (value: any) => {
        this.propagateValue(value);

        this.matches = this.getMatches(value);
    };

    propagateValue = (_: any) => {};

    registerOnChange(fn: (_: any) => void): void {
        this.propagateValue = fn;
    }

    registerOnTouched(fn: () => void): void {}

    writeValue(value: any): void {
        if (value == null) {
            value = '';
        }
        this.value = value;
    }
}