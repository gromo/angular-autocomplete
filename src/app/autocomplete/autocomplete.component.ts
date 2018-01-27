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

    matches: string[] = [];

    @Input()
    minlength: number = 1;

    @Input()
    source: any;

    value: string;

    constructor() {
        console.log('AutocompleteComponent:constructor');
    }

    getMatches(value: any): string[] {
        // load items for autocomplete
        if (!this.source || value == null || value.length < this.minlength) {
            return [];
        }
        value = value.toLowerCase();
        return this.source.filter(v => v.toLowerCase().match(value));
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