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

    value = 'search1';

    constructor() {
        console.log('AutocompleteComponent:constructor');
    }

    ngOnInit() {
        console.log('AutocompleteComponent:onInit');
    }

    onChange = (_: any) => {};
    onTouched = () => {};

    registerOnChange(fn: (_: any) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    writeValue(value: any): void {
        if (value !== undefined) {
            this.value = value;
        }
    }
}
